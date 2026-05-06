import { useState, useEffect } from "react";

const STATUS_CONFIG = {
  Applied: { color: "#3B82F6", bg: "#EFF6FF", label: "Applied" },
  Interview: { color: "#F59E0B", bg: "#FFFBEB", label: "Interview" },
  Offered: { color: "#10B981", bg: "#ECFDF5", label: "Offered" },
  Rejected: { color: "#EF4444", bg: "#FEF2F2", label: "Rejected" },
};

const EMPTY_FORM = {
  company: "",
  role: "",
  date: "",
  status: "Applied",
  notes: "",
};

// ── helpers ──────────────────────────────────────────────────────────────────
const load = () => {
  try {
    return JSON.parse(localStorage.getItem("jobs")) || [];
  } catch {
    return [];
  }
};
const save = (jobs) => localStorage.setItem("jobs", JSON.stringify(jobs));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// ── sub-components ────────────────────────────────────────────────────────────
function Badge({ status }) {
  const { color, bg, label } = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;
  return (
    <span
      style={{
        background: bg,
        color,
        border: `1px solid ${color}`,
        borderRadius: 20,
        padding: "2px 12px",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".5px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "18px 24px",
        boxShadow: "0 1px 6px rgba(0,0,0,.07)",
        textAlign: "center",
        borderTop: `4px solid ${color}`,
        flex: "1 1 120px",
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function JobForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.company.trim() || !form.role.trim() || !form.date) {
      setError("Company, Role and Date are required.");
      return;
    }
    setError(""); //as content is present setting the error tp empty
    onAdd({ ...form, id: uid() }); // adding data to form
    setForm(EMPTY_FORM); //setting the form empty
  }; 

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1.5px solid #E5E7EB",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border .2s",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 28,
        boxShadow: "0 1px 8px rgba(0,0,0,.08)",
        marginBottom: 28,
      }}
    >
      <h2
        style={{
          margin: "0 0 20px",
          fontSize: 18,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        ➕ Add Application
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          ["Company", "company", "text", "e.g. Google"],
          ["Role", "role", "text", "e.g. Frontend Developer"],
          ["Date Applied", "date", "date", ""],
        ].map(([label, key, type, ph]) => (
          <div key={key} style={key === "date" ? {} : {}}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: 6,
              }}
            >
              {label}
            </label>
            <input
              type={type}
              placeholder={ph}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}

        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 6,
            }}
          >
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}
          >
            {Object.keys(STATUS_CONFIG).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#374151",
            display: "block",
            marginBottom: 6,
          }}
        >
          Notes (optional)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Recruiter name, referral, etc."
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {error && (
        <p style={{ color: "#EF4444", fontSize: 13, margin: "10px 0 0" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 18,
          background: "#111827",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: ".3px",
        }}
      >
        Add Application
      </button>
    </div>
  );
}

function JobCard({ job, onDelete, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "18px 22px",
        boxShadow: "0 1px 6px rgba(0,0,0,.07)",
        borderLeft: `4px solid ${STATUS_CONFIG[job.status]?.color || "#6B7280"}`,
        transition: "box-shadow .2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "#111827",
              marginBottom: 2,
            }}
          >
            {job.company}
          </div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>{job.role}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
            📅{" "}
            {new Date(job.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <Badge status={job.status} />
          <div style={{ display: "flex", gap: 6 }}>
            <select
              value={job.status}
              onChange={(e) => onStatusChange(job.id, e.target.value)}
              style={{
                fontSize: 11,
                padding: "4px 8px",
                borderRadius: 7,
                border: "1.5px solid #E5E7EB",
                background: "#F9FAFB",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setExpanded((x) => !x)}
              style={{
                background: "#F3F4F6",
                border: "none",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 12,
                color: "#374151",
              }}
            >
              {expanded ? "▲" : "▼"}
            </button>
            <button
              onClick={() => onDelete(job.id)}
              style={{
                background: "#FEF2F2",
                border: "none",
                borderRadius: 7,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 12,
                color: "#EF4444",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {expanded && job.notes && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            background: "#F9FAFB",
            borderRadius: 8,
            fontSize: 13,
            color: "#374151",
          }}
        >
          📝 {job.notes}
        </div>
      )}
    </div>
  );
}

// ── main app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [jobs, setJobs] = useState(load);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // persist to localStorage whenever jobs change
  useEffect(() => {
    save(jobs);
  }, [jobs]);

  const addJob = (job) => setJobs((j) => [job, ...j]);
  const deleteJob = (id) => setJobs((j) => j.filter((x) => x.id !== id));
  const changeStatus = (id, status) =>
    setJobs((j) => j.map((x) => (x.id === id ? { ...x, status } : x)));

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = jobs.filter((j) => j.status === s).length;
    return acc;
  }, {});

  const visible = jobs.filter((j) => {
    const matchFilter = filter === "All" || j.status === filter;
    const matchSearch =
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F4F6",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* header */}
      <div
        style={{
          background: "#111827",
          color: "#fff",
          padding: "24px 0 28px",
          marginBottom: 32,
        }}
      >
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.5px",
            }}
          >
            🎯 Job Tracker
          </h1>
          <p style={{ margin: "6px 0 0", color: "#9CA3AF", fontSize: 14 }}>
            Track every application. Land your dream job.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 60px" }}>
        {/* stats */}
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <StatCard label="Total" value={jobs.length} color="#6B7280" />
          <StatCard label="Applied" value={counts.Applied} color="#3B82F6" />
          <StatCard
            label="Interview"
            value={counts.Interview}
            color="#F59E0B"
          />
          <StatCard label="Offered 🎉" value={counts.Offered} color="#10B981" />
          <StatCard label="Rejected" value={counts.Rejected} color="#EF4444" />
        </div>

        {/* form */}
        <JobForm onAdd={addJob} />

        {/* filters + search */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {["All", ...Object.keys(STATUS_CONFIG)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: "2px solid",
                borderColor: filter === s ? "#111827" : "#E5E7EB",
                background: filter === s ? "#111827" : "#fff",
                color: filter === s ? "#fff" : "#374151",
                transition: "all .15s",
              }}
            >
              {s}
            </button>
          ))}
          <input
            placeholder="🔍 Search company or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              borderRadius: 20,
              border: "2px solid #E5E7EB",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              minWidth: 200,
            }}
          />
        </div>

        {/* job list */}
        {visible.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#9CA3AF",
              fontSize: 15,
            }}
          >
            {jobs.length === 0
              ? "No applications yet. Add your first one above! 👆"
              : "No results match your filter."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {visible.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={deleteJob}
                onStatusChange={changeStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
