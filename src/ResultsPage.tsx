import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPlans, type Plan } from "./api/plans";

const PAGE_SIZE = 2;

export function ResultsPage() {
  const [sp, setSp] = useSearchParams();

  const from = sp.get("from") ?? "";
  const to = sp.get("to") ?? "";
  const travelDate = sp.get("date") ?? "";
  const pax = Number(sp.get("pax") ?? "1");
  const sort = (sp.get("sort") ?? "price_asc") as "price_asc" | "price_desc";
  const page = Math.max(1, Number(sp.get("page") ?? "1"));

  const returnTo = `/results?${sp.toString()}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagedPlans, setPagedPlans] = useState<Plan[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [safePage, setSafePage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPlans({ from, to, sort, page, pageSize: PAGE_SIZE })
      .then((res) => {
        console.log("fetchPlans data =", res);
        if (cancelled) return;
        setPagedPlans(res.plans);
        setTotalPages(res.totalPages);
        setSafePage(res.page);
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
  }, [from, to, sort, page]);

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
        条件: from={from} to={to} date={travelDate} pax={pax} sort={sort}
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
          {pagedPlans.length === 0 ? (
            <p>該当なし(条件を再入力してください)</p>
          ) : (
            <ul>
              {pagedPlans.map((it) => (
                <li key={it.planId} style={{ marginBottom: 10 }}>
                  <Link
                    to={`/plan/${it.planId}?date=${travelDate}&pax=${pax}&returnTo=${encodeURIComponent(returnTo)}`}
                  >
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

            <span style={{ margin: "0 12px" }}>
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
