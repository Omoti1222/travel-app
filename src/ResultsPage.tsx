import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPlans, type Plan } from "./api/plans";

const PAGE_SIZE = 2;

export function ResultsPage() {
  const [sp, setSp] = useSearchParams();

  const from = sp.get("from") ?? "";
  const to = sp.get("to") ?? "";
  const date = sp.get("date") ?? "";
  const pax = Number(sp.get("pax") ?? "1");
  const sort = (sp.get("sort") ?? "price_asc") as "price_asc" | "price_desc";
  const page = Math.max(1, Number(sp.get("page") ?? "1"));

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPlans()
      .then((data) => {
        if (cancelled) return;
        setPlans(date);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "読み込みに失敗しました");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return plans.filter((it) => {
      const okFrom = from ? it.from === from : true;
      const okTo = to ? it.to === to : true;
      return okFrom && okTo;
    });
  }, [plans, from, to]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      return sort === "price_asc" ? a.price - b.price : b.price - a.price;
    });
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paged = sorted.slice(start, start + PAGE_SIZE);

  function changeSort(next: "price_asc" | "price_desc") {
    const nextSp = new URLSearchParams(sp);
    nextSp.set("sort", next);
    nextSp.set("page", "1");

    setSp(nextSp);
  }

  function changePage(nextPage: number) {
    const nextSp = new URLSearchParams(sp);
    nextSp.set("page", String(nextPage));
    setSp(nextSp);
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>検索結果</h1>

      <p>
        条件: from={from} to={to} date={date} pax={pax} sort={sort}
      </p>

      <div style={{ marginBottom: 12 }}>
        <span style={{ marginRight: 8 }}>並び替え</span>

        <button
          type="button"
          onClick={() => changeSort("price_asc")}
          disabled={sort === "price_asc"}
        >
          安い順
        </button>

        <button
          type="button"
          onClick={() => changeSort("price_desc")}
          disabled={sort === "price_desc"}
          style={{ marginLeft: 8 }}
        >
          高い順
        </button>
      </div>

      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          {paged.length === 0 ? (
            <p>該当なし(条件を再入力してください)</p>
          ) : (
            <ul>
              {paged.map((it) => (
                <li key={it.planId} style={{ marginBottom: 10 }}>
                  <Link to={`/plan/${it.planId}?date=${date}&pax=${pax}`}>
                    {it.title}
                  </Link>
                  <div>{it.price} 円</div>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() => changePage(safePage - 1)}
              disabled={safePage <= 1}
            >
              ←前に戻る
            </button>

            <span style={{ margin: "0, 12px" }}>
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => changePage(safePage + 1)}
              disabled={safePage >= totalPages}
            >
              次へ→
            </button>
          </div>
        </>
      )}

      <div style={{ marginTop: 16 }}>
        <Link to="/">検索に戻る</Link>
      </div>
    </div>
  );
}
