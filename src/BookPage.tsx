import { Link, useParams, useSearchParams } from "react-router-dom";

export function BookPage() {
  const { planId } = useParams();
  const [sp] = useSearchParams();
  const date = sp.get("date") ?? "";
  const pax = sp.get("pax") ?? "";

  return (
    <div style={{ padding: 24 }}>
      <h1>予約入力</h1>
      <p>planId: {planId}</p>
      <p>date: {date}</p>
      <p>pax: {pax}</p>

      <Link to={`/plan/${planId}?date=${date}&pax=${pax}`}>
        ← プラン詳細へ戻る
      </Link>
      <br />
      <Link to="/">最初に戻る</Link>
    </div>
  );
}
