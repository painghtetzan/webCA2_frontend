import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getPosts } from "../api/posts";
import { getReminders, setReminder } from "../api/reminders";

const OPTIONS = [
  { label: "1 hour", minutes: 60 },
  { label: "6 hours", minutes: 360 },
  { label: "12 hours", minutes: 720 },
];

export default function StudentDashboard() {
  const [posts, setPosts] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([getPosts(), getReminders()]);
      setPosts(p);
      setReminders(r);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const reminderSet = useMemo(() => {
    const s = new Set();
    reminders.forEach((r) => s.add(`${r.post_id}-${r.remind_before_minutes}`));
    return s;
  }, [reminders]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  }, [posts]);

  async function handleRemind(postId, minutes) {
    try {
      await setReminder({ post_id: postId, remind_before_minutes: minutes });
      await refresh();
      alert("Reminder set!");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2 className="page-title">Student Dashboard</h2>
        <p className="subtle">View upcoming submissions, events and meetings. Set reminders to avoid missing deadlines.</p>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming</h3>
            <span className="chip">{loading ? "Loading" : `${sortedPosts.length} items`}</span>
          </div>

          {loading ? (
            <div className="notice"><span className="muted">Loading posts...</span></div>
          ) : sortedPosts.length === 0 ? (
            <div className="notice"><span className="muted">No posts available yet.</span></div>
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
                  </div>

                  <div className="hr" />

                  <div className="row" style={{justifyContent:"space-between"}}>
                    <div className="muted">Set reminder:</div>
                    <div className="actions">
                      {OPTIONS.map((opt) => {
                        const key = `${p.id}-${opt.minutes}`;
                        const already = reminderSet.has(key);
                        return (
                          <button
                            key={opt.minutes}
                            className={`btn ${already ? "" : "primary"}`}
                            disabled={already}
                            onClick={() => handleRemind(p.id, opt.minutes)}
                          >
                            {already ? `${opt.label} ✓` : opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="helper">Reminder will be sent before the scheduled time.</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
