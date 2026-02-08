import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchPlanById, type Plan } from "./api/plans";
import { useEffect, useState } from "react";

export function PlanPage() {
  const { planId } = useParams();
  const [sp] = useSearchParams();
  const date = sp.get("date") ?? "";
  const pax = sp.get("pax") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    console.log("[PlanPage effect] START planId =", planId);
    if (!planId) {
      console.log("[PlanPage effect] NO planId -> stop");
      setError("planIdがありません");
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);
    setPlan(null);

    fetchPlanById(planId)
      .then((data) => {
        console.log(
          "[PlanPage effect] THEN planId =",
          planId,
          "cancelled =",
          cancelled,
        );
        if (cancelled) return;
        setPlan(data);
      })
      .catch((e: unknown) => {
        console.log(
          "[PlanPage effect] CATCH planId =",
          planId,
          "cancelled =",
          cancelled,
        );
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "読み込みに失敗しました");
      })
      .finally(() => {
        console.log(
          "[PlanPage effect] FINALLY planId =",
          planId,
          "cancelled =",
          cancelled,
        );
        if (cancelled) return;
        console.log("[PlanPage effect] setLoading(false) run");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      console.log(
        "[PlanPage effect] CLEANUP planId =",
        planId,
        "-> cancelled = true",
      );
    };
  }, [planId]);

  return (
    <div style={{ padding: 24 }}>
      <h1>プラン詳細</h1>
      <p>
        URLから: planId={planId} / date={date} / pax={pax}
      </p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {plan && (
        <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>{plan.title}</h2>
          <p>
            {plan.from} → {plan.to}
          </p>
          <p>{plan.price} 円〜</p>
          <p>{plan.description}</p>

          <Link to={`/book/${planId}?date=${date}&pax=${pax}`}>予約へ</Link>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Link to="/results?from=TYO&to=OSA&date=2026-02-01&pax=2">
          ←結果に戻る
        </Link>
      </div>
    </div>
  );
}
