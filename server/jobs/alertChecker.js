const { pool } = require('../db');
const { sendToUser } = require('../sse');

/**
 * Auto-Alert Checker Job
 * Runs every 60 seconds to scan for:
 *  - Tasks due today that are still Pending or In Progress
 *  - Overdue tasks (past due_date, not Completed)
 * Creates alerts for each if not already alerted (deduped by related_id + related_type).
 */
async function runAlertChecker() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Get all users so we can assign alerts
    const { rows: users } = await pool.query(`SELECT id FROM users`);
    if (!users || users.length === 0) return;

    // Get tasks due today OR overdue that are not completed
    const { rows: dueTasks } = await pool.query(
      `SELECT * FROM tasks
       WHERE status != 'Completed'
         AND (
           date(due_date) = date('now')
           OR date(due_date) < date('now')
         )`
    );

    for (const task of dueTasks) {
      const isOverdue = new Date(task.due_date) < today;
      const title = isOverdue ? '⚠️ Overdue Task' : '⏰ Task Due Today';
      const priority = isOverdue ? 'high' : 'medium';
      const message = isOverdue
        ? `Task "${task.title}" was due on ${new Date(task.due_date).toLocaleDateString()} and is still ${task.status}.`
        : `Task "${task.title}" is due today. Current status: ${task.status}.`;

      // Send to all users (since tasks have no user_id in current schema)
      for (const user of users) {
        // Deduplicate: skip if an alert for this task already exists and is unresolved
        const { rows: existing } = await pool.query(
          `SELECT id FROM alerts
           WHERE related_id = ? AND related_type = 'task' AND user_id = ? AND is_resolved = 0`,
          [task.id, user.id]
        );
        if (existing.length > 0) continue;

        const { rows: newRows } = await pool.query(
          `INSERT INTO alerts (title, message, type, priority, due_date, related_id, related_type, user_id)
           VALUES (?, ?, 'task', ?, ?, ?, 'task', ?)`,
          [title, message, priority, task.due_date, task.id, user.id]
        );

        // Fetch the newly created alert to push via SSE
        const newId = newRows[0]?.id;
        if (newId) {
          const { rows: alertRows } = await pool.query(
            `SELECT * FROM alerts WHERE id = ?`, [newId]
          );
          if (alertRows[0]) {
            sendToUser(user.id, 'new_alert', alertRows[0]);
          }
        }
      }
    }
  } catch (err) {
    console.error('[AlertChecker] Error:', err.message);
  }
}

function startAlertChecker() {
  console.log('[AlertChecker] Starting — checks every 60 seconds.');
  // Run immediately on startup, then every 60s
  runAlertChecker();
  setInterval(runAlertChecker, 60 * 1000);
}

module.exports = { startAlertChecker };
