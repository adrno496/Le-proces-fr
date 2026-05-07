// Notifications: Capacitor Local Notifications when available, fallback Web Notifications API.

import { Storage } from "./storage.js";
import { t } from "./i18n.js";

export async function isAvailable() {
  if (typeof window === "undefined") return false;
  // Capacitor v8: Local Notifications plugin
  if (window.Capacitor?.Plugins?.LocalNotifications) return "capacitor";
  if ("Notification" in window) return "web";
  return false;
}

export async function requestPermission() {
  const av = await isAvailable();
  if (av === "capacitor") {
    const r = await window.Capacitor.Plugins.LocalNotifications.requestPermissions();
    return r.display === "granted";
  }
  if (av === "web") {
    const p = await Notification.requestPermission();
    return p === "granted";
  }
  return false;
}

// Schedule the daily reminder at user-chosen hour/min.
export async function scheduleDaily(hour = 18, minute = 0) {
  const av = await isAvailable();
  Storage.saveSettings({ notifsEnabled: true, notifHour: hour, notifMinute: minute });

  if (av === "capacitor") {
    const plugin = window.Capacitor.Plugins.LocalNotifications;
    // Cancel existing daily
    try { await plugin.cancel({ notifications: [{ id: 100 }] }); } catch {}
    await plugin.schedule({
      notifications: [{
        id: 100,
        title: t("notif.daily.title"),
        body: t("notif.daily.body"),
        schedule: { on: { hour, minute }, every: "day", allowWhileIdle: true },
      }],
    });
    return true;
  }
  if (av === "web") {
    // Schedule in-page (only fires while the app is open). For a true background push,
    // a Service Worker is needed — not added here to keep the project zero-backend.
    scheduleInPageReminder(hour, minute);
    return true;
  }
  return false;
}

let _webTimer = null;
function scheduleInPageReminder(hour, minute) {
  if (_webTimer) clearTimeout(_webTimer);
  const fire = () => {
    if (Notification.permission === "granted") {
      new Notification(t("notif.daily.title"), { body: t("notif.daily.body") });
    }
    scheduleInPageReminder(hour, minute); // reschedule next day
  };
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  _webTimer = setTimeout(fire, next - now);
}

export async function cancel() {
  Storage.saveSettings({ notifsEnabled: false });
  const av = await isAvailable();
  if (av === "capacitor") {
    try { await window.Capacitor.Plugins.LocalNotifications.cancel({ notifications: [{ id: 100 }] }); } catch {}
  }
  if (_webTimer) { clearTimeout(_webTimer); _webTimer = null; }
}

// Fire a local "achievement unlocked" notification at any time.
export async function fireImmediate(title, body) {
  const av = await isAvailable();
  if (av === "capacitor") {
    try {
      await window.Capacitor.Plugins.LocalNotifications.schedule({
        notifications: [{ id: Math.floor(Math.random() * 1e6), title, body, schedule: { at: new Date(Date.now() + 500) } }],
      });
    } catch {}
  } else if (av === "web" && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
