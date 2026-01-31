import { apiFetch } from "./client";

export function getPosts() {
  return apiFetch("/posts");
}

export function createPost({ type, title, description, scheduled_at }) {
  return apiFetch("/posts", {
    method: "POST",
    body: JSON.stringify({ type, title, description, scheduled_at }),
  });
}

export function updatePost(id, payload) {
  return apiFetch(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePost(id) {
  return apiFetch(`/posts/${id}`, {
    method: "DELETE",
  });
}
