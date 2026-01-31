import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchPage() {
  const nav = useNavigate();

  const [from, setFrom] = useState("TYO");
  const [to, setTo] = useState("OSA");
  const [date, setDate] = useState("2026-02-01");
  const [pax, setPax] = useState(2);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const qs = new URLSearchParams({
      from,
      to,
      date,
      pax: String(pax),
    }).toString();

    nav(`/results?${qs}`);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>検索</h1>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, maxWidth: 360 }}
      >
        <label>
          出発地
          <input value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>

        <label>
          目的地
          <input value={to} onChange={(e) => setTo(e.target.value)} />
        </label>

        <label>
          日付
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          人数
          <input
            type="number"
            min={1}
            value={pax}
            onChange={(e) => setPax(Number(e.target.value))}
          />
        </label>

        <button type="submit">検索する</button>
      </form>
    </div>
  );
}
