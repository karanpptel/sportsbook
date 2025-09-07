"use client"

import { useState, useEffect } from "react";

export function useNotifications(role: "player" | "owner") {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    const res = await fetch(`/api/dashboard/${role}/notifications`);
    const data = await res.json();
    setNotifications(data);
    setLoading(false);
  };

  // Mark one notification as read
  async function markAsRead(id: string) {
    try {
      await fetch(`/api/dashboard/${role}/notifications/${id}`, {
        method: "PATCH",
      });
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  // ✅ Mark all as read
  async function markAllAsRead() {
    try {
      await fetch(`/api/dashboard/${role}/notifications/mark-all`, {
        method: "PATCH",
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchNotifications(); // initial load

    // Poll every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [role]);

  return { notifications, loading, markAsRead, markAllAsRead, refetch: fetchNotifications };
}
