const { pool } = require('../db');

/**
 * Logs a user activity into the database.
 * @param {number} userId - The ID of the user performing the action.
 * @param {string} action - Description of the action (e.g., 'Added a new property').
 * @param {string} module - The module affected (e.g., 'Property', 'Task').
 * @param {number} relatedId - (Optional) ID of the related record.
 * @param {string} details - (Optional) Additional details.
 */
async function logActivity(userId, action, module, relatedId = null, details = null) {
  try {
    await pool.query(
      `INSERT INTO activities (user_id, action, module, related_id, details) VALUES (?, ?, ?, ?, ?)`,
      [userId, action, module, relatedId, details]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

module.exports = { logActivity };
