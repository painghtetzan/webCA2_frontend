import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { createPost, deletePost, getPosts, updatePost } from "../api/posts";

const TYPES = ["submission", "event", "meeting"];

function toDatetimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 16);
  const d2 = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(d2.getTime()) ? "" : d2.toISOString().slice(0, 16);
}

export default function LecturerDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: "submission",
    title: "",
    description: "",
    scheduled_at: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({
    type: "submission",
    title: "",
    description: "",
    scheduled_at: "",
  });

  async function refresh() {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function updateForm(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.scheduled_at) {
      alert("Title and Date/Time are required.");
      return;
    }

    try {
      const scheduledAt = form.scheduled_at.replace("T", " ") + ":00";
      await createPost({
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        scheduled_at: scheduledAt,
      });
      setForm({ type: "submission", title: "", description: "", scheduled_at: "" });
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditing({
      type: p.type,
      title: p.title,
      description: p.description || "",
      scheduled_at: toDatetimeLocal(p.scheduled_at),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditing({ type: "submission", title: "", description: "", scheduled_at: "" });
  }

  async function saveEdit(id) {
    if (!editing.title.trim() || !editing.scheduled_at) {
      alert("Title and Date/Time are required.");
      return;
    }
    try {
      const scheduledAt = editing.scheduled_at.replace("T", " ") + ":00";
      await updatePost(id, {
        type: editing.type,
        title: editing.title.trim(),
        description: editing.description.trim(),
        scheduled_at: scheduledAt,
      });
      cancelEdit();
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  }, [posts]);

  return (
    <>
      <Navbar />

      <div className="container">
        <h2 className="page-title">Lecturer Dashboard</h2>
        <p className="subtle">Create and manage submissions, events, and meetings.</p>

        <div className="grid two">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Create post</h3>
              <span className="chip">Create</span>
            </div>

            <form className="form" onSubmit={handleCreate}>
              <label>Type</label>
              <select value={form.type} onChange={(e) => updateForm("type", e.target.value)}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>

              <label>Title</label>
              <input value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="e.g., CA2 Submission" />

              <label>Description</label>
              <textarea rows="3" value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Add details for students..." />

              <label>Date & Time</label>
              <input type="datetime-local" value={form.scheduled_at} onChange={(e) => updateForm("scheduled_at", e.target.value)} />

              <button className="btn primary" type="submit">Create</button>
              <div className="helper">Students will see it immediately on their dashboard.</div>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">All posts</h3>
              <span className="chip">{loading ? "Loading" : `${sortedPosts.length} items`}</span>
            </div>

            {loading ? (
              <div className="notice"><span className="muted">Loading posts...</span></div>
            ) : sortedPosts.length === 0 ? (
              <div className="notice"><span className="muted">No posts yet. Create your first one on the left.</span></div>
            ) : (
              <div className="list">
                {sortedPosts.map((p) => (
                  <div className="item" key={p.id}>
                    <div className="item-top">
                      <div>
                        <div className="item-title">
                          <span className="tag">{p.type}</span>{p.title}
                        </div>
                        <div className="muted">{new Date(p.scheduled_at).toLocaleString()}</div>
                        {p.description ? <div className="subtle" style={{marginTop:8}}>{p.description}</div> : null}
                      </div>

                      <div className="actions">
                        <button className="btn" onClick={() => startEdit(p)}>Edit</button>
                        <button className="btn danger" onClick={() => remove(p.id)}>Delete</button>
                      </div>
                    </div>

                    {editingId === p.id ? (
                      <>
                        <div className="hr" />
                        <div className="form">
                          <label>Edit type</label>
                          <select value={editing.type} onChange={(e) => setEditing((x) => ({ ...x, type: e.target.value }))}>
                            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>

                          <label>Edit title</label>
                          <input value={editing.title} onChange={(e) => setEditing((x) => ({ ...x, title: e.target.value }))} />

                          <label>Edit description</label>
                          <textarea rows="3" value={editing.description} onChange={(e) => setEditing((x) => ({ ...x, description: e.target.value }))} />

                          <label>Edit date & time</label>
                          <input type="datetime-local" value={editing.scheduled_at} onChange={(e) => setEditing((x) => ({ ...x, scheduled_at: e.target.value }))} />

                          <div className="row">
                            <button className="btn primary" onClick={() => saveEdit(p.id)}>Save</button>
                            <button className="btn" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
