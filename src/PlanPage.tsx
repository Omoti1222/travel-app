import { Link, useParams, useSearchParams } from "react-router-dom";

export function PlanPage() {
  const { planId } = useParams();
  const [sp] = useSearchParams();
  const date = sp.get("date") ?? "";
  const pax = sp.get("pax") ?? "";

  return (
    <div style={{ padding: 24 }}>
      <h1>プラン詳細</h1>
      <p>planId: {planId}</p>
      <p>date: {date}</p>
      <p>pax: {pax}</p>

      <Link to={`/book/${planId}?date=${date}&pax=${pax}`}>予約へ</Link>
      <br />
      <Link to="/results?from=TYO&to=OSA&date=2026-02-01&pax=2">
        ←結果に戻る
      </Link>
    </div>
  );
}
