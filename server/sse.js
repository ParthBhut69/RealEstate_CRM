/**
 * Server-Sent Events (SSE) Manager
 * Maintains a map of userId → Set of active SSE response objects
 * so we can push events to specific users in real-time.
 */

const clients = new Map(); // userId (string) → Set<res>

function addClient(userId, res) {
  const key = String(userId);
  if (!clients.has(key)) {
    clients.set(key, new Set());
  }
  clients.get(key).add(res);
}

function removeClient(userId, res) {
  const key = String(userId);
  if (clients.has(key)) {
    clients.get(key).delete(res);
    if (clients.get(key).size === 0) {
      clients.delete(key);
    }
  }
}

/**
 * Send an SSE event to all connections for a given user.
 * @param {string|number} userId
 * @param {string} eventType  - e.g. 'new_alert', 'alert_resolved'
 * @param {object} data       - will be JSON-stringified
 */
function sendToUser(userId, eventType, data) {
  const key = String(userId);
  if (!clients.has(key)) return;
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients.get(key)) {
    try {
      res.write(payload);
    } catch (e) {
      // Client disconnected mid-write
      clients.get(key).delete(res);
    }
  }
}

/**
 * Broadcast an SSE event to ALL connected users.
 */
function broadcast(eventType, data) {
  for (const [userId] of clients) {
    sendToUser(userId, eventType, data);
  }
}

module.exports = { addClient, removeClient, sendToUser, broadcast };
