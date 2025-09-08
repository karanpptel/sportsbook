//  src/lib/api.ts
// Client-side API helper functions
export async function markNotificationAsRead(role: "player" | "owner", id: string) {
  const res = await fetch(`/api/dashboard/${role}/notifications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ read: true }),
  });

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return await res.json();
}
