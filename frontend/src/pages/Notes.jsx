import React, { useEffect, useState } from "react";
import api from "../api.js";
import axios from 'axios';

function NoteForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await api.post("/note", { title, content });
    onCreate(res.data);
    setTitle("");
    setContent("");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" rows={4} />
      <button type="submit">Add note</button>
    </form>
  );
}

function NoteItem({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  async function save() {
    const res = await api.put(`/note/${note._id}`, { title, content });
    onUpdate(res.data);
    setEditing(false);
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      {editing ? (
        <>
          <input value={title} onChange={e => setTitle(e.target.value)} />
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(false)} type="button">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 style={{ margin: "4px 0" }}>{note.title}</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onDelete(note._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/note").then(res => setNotes(res.data)).finally(() => setLoading(false));
  }, []);

  async function onCreate(note) {
    setNotes((prev) => [note, ...prev]);
  }

  async function onUpdate(updated) {
    setNotes((prev) => prev.map(n => n._id === updated._id ? updated : n));
  }

  async function onDelete(id) {
    await api.delete(`/note/${id}`);
    setNotes((prev) => prev.filter(n => n._id !== id));
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <NoteForm onCreate={onCreate} />
      <div style={{ display: "grid", gap: 12 }}>
        {notes.map(n => (
          <NoteItem key={n._id} note={n} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
        {notes.length === 0 && <p>No notes yet — add one above.</p>}
      </div>
    </div>
  );
}
