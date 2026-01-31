import { apiFetch } from "./client";

export function setReminder({ post_id, remind_before_minutes }) {
  return apiFetch("/reminders", {
    method: "POST",
    body: JSON.stringify({ post_id, remind_before_minutes }),
  });
}

export function getReminders() {
  return apiFetch("/reminders");
}
