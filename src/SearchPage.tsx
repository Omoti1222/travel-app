import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SearchPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const initialFrom = sp.get("from") ?? "";
  const initialTo = sp.get("to") ?? "";
  const initialDate = sp.get("date") ?? "";
  const initialPax = Math.max(1, Number(sp.get("pax") ?? "1"));

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const [pax, setPax] = useState(initialPax);

  useEffect(() => {
    setFrom(sp.get("from") ?? "");
    setTo(sp.get("to") ?? "");
    setDate(sp.get("date") ?? "");
    setPax(Math.max(1, Number(sp.get("pax") ?? "1")));
  }, [sp]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const p = new URLSearchParams();
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    if (date) p.set("date", date);
    p.set("pax", String(Math.max(1, pax)));
    p.set("sort", "price_asc");
    p.set("page", "1");

    nav(`/results?${p.toString()}`);
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
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="例: TYO"
          />
        </label>

        <label>
          目的地
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="例: OSA"
          />
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
            onChange={(e) => setPax(Math.max(1, Number(e.target.value || "1")))}
          />
        </label>

        <button type="submit">検索する</button>
      </form>
    </div>
  );
}
