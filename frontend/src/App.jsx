import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const res = await fetch(`${BASE_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle("");
    } catch {
      setError("Failed to add task");
    }
  }

  async function toggleTask(task) {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      setError("Failed to update task");
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h1>Todo App</h1>

      <form onSubmit={addTask} style={{ display: "flex", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          style={{ flex: 1, padding: 10 }}
        />
        <button>Add</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              border: "1px solid #ddd",
              marginBottom: 8,
            }}
          >
            <span
              onClick={() => toggleTask(task)}
              style={{
                cursor: "pointer",
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 
