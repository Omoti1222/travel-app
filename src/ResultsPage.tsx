import { Link, useSearchParams } from "react-router-dom";

type Item = {
  planId: string;
  title: string;
  from: string;
  to: string;
  price: number;
};

const items: Item[] = [
  {
    planId: "p1",
    title: "新幹線+ホテル お得プラン",
    from: "TYO",
    to: "OSA",
    price: 24000,
  },
  {
    planId: "p2",
    title: "飛行機+ホテル 早割プラン",
    from: "TYO",
    to: "OSA",
    price: 28000,
  },
  {
    planId: "p3",
    title: "札幌 食べ歩きプラン",
    from: "TYO",
    to: "CTS",
    price: 35000,
  },
  {
    planId: "p4",
    title: "福岡 週末満喫プラン",
    from: "OSA",
    to: "FUK",
    price: 26000,
  },
  {
    planId: "p5",
    title: "大阪 食い倒れプラン",
    from: "TYO",
    to: "OSA",
    price: 22000,
  },
];

const PAGE_SIZE = 2;

export function ResultsPage() {
  const [sp, setSp] = useSearchParams();

  const from = sp.get("from") ?? "";
  const to = sp.get("to") ?? "";
  const date = sp.get("date") ?? "";
  const pax = Number(sp.get("pax") ?? "1");

  const sort = (sp.get("sort") ?? "price_asc") as "price_asc" | "price_desc";

  const page = Math.max(1, Number(sp.get("page") ?? "1"));

  const filtered = items.filter((it) => {
    const okFrom = from ? it.from === from : true;
    const okTo = to ? it.to === to : true;
    return okFrom && okTo;
  });

  const sorted = [...filtered].sort((a, b) => {
    return sort === "price_asc" ? a.price - b.price : b.price - a.price;
  });

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

      {/* ページ操作 */}
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
          次へ →
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/">検索に戻る</Link>
      </div>
    </div>
  );
}
