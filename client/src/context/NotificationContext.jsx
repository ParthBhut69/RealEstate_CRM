import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);
const API_URL = 'http://localhost:5000/api';

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const eventSourceRef = useRef(null);
  const toastIdRef = useRef(0);

  // ── Request browser notification permission once ──────────────────────────
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const addToast = useCallback((alert) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { ...alert, toastId: id }]);
    // Auto-dismiss after 5.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.toastId !== id));
    }, 5500);

    // Browser OS notification when tab is not visible
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      new Notification(`${alert.title}`, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: `alert-${alert.id}`,
      });
    }

    // Subtle chime via Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) { /* AudioContext not available */ }
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.toastId !== toastId));
  }, []);

  // ── Fetch initial alerts from REST ────────────────────────────────────────
  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('crm_token');
      const [alertsRes, countRes] = await Promise.all([
        axios.get(`${API_URL}/alerts`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/alerts/unread-count`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setAlerts(alertsRes.data);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // ── SSE Connection ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('crm_token');
    if (!token) return;

    // Close any previous connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${API_URL}/alerts/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('connected', () => {
      console.log('[SSE] Connected to notification stream');
    });

    es.addEventListener('new_alert', (e) => {
      const alert = JSON.parse(e.data);
      setAlerts(prev => {
        // Avoid duplicate if already in list
        if (prev.find(a => a.id === alert.id)) return prev;
        return [alert, ...prev];
      });
      setUnreadCount(prev => prev + 1);
      addToast(alert);
    });

    es.addEventListener('alert_resolved', (e) => {
      const { id } = JSON.parse(e.data);
      setAlerts(prev => prev.filter(a => a.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    es.onerror = () => {
      // EventSource will auto-reconnect; just log silently
      console.warn('[SSE] Connection error, will retry...');
    };

    return () => {
      es.close();
    };
  }, [user, addToast]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const resolveAlert = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('crm_token');
      await axios.put(`${API_URL}/alerts/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(prev => prev.filter(a => a.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      const token = localStorage.getItem('crm_token');
      await axios.put(`${API_URL}/alerts/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(prev => prev.map(a => ({ ...a, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  }, []);

  const addAlert = useCallback(async (alertData) => {
    try {
      const token = localStorage.getItem('crm_token');
      const res = await axios.post(`${API_URL}/alerts`, alertData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      console.error('Failed to create alert:', err);
      throw err;
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      alerts,
      unreadCount,
      toasts,
      resolveAlert,
      markAllRead,
      addAlert,
      dismissToast,
      refresh: fetchAlerts,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
