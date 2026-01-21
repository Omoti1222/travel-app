import {
  Link,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from "react-router-dom";

function SearchPage() {
  const from = "TYO";
  const to = "OSA";
  const date = "2026-3-14";
  const pax = 2;
  const qs = new URLSearchParams({
    from,
    to,
    date,
    pax: String(pax),
  }).toString();

  return (
    <div style={{ padding: 24 }}>
      <h1>検索</h1>
      <p>
        from{from} to={to} date={date} pax={pax}
      </p>
      <Link to={`/results?${qs}`}>検索する</Link>
    </div>
  );
}

function ResultsPage() {
  const [sp] = useSearchParams();
  const from = sp.get("from");
  const to = sp.get("to");
  const date = sp.get("date");
  const pax = sp.get("pax");

  const items = [
    { planId: "p1", title: "新幹線+ホテル お得プラン" },
    { planId: "p2", title: "飛行機+ホテル 早割プラン" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>検索結果</h1>
      <p>
        条件: from={from} to={to} date={date} pax={pax}
      </p>

      <ul>
        {items.map((it) => (
          <li key={it.planId}>
            <Link to={`/plan/${it.planId}?date=${date}&pax=${pax}`}>
              {it.title}
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/">←検索に戻る</Link>
    </div>
  );
}

function PlanPage() {
  const { planId } = useParams();
  const [sp] = useSearchParams();
  const date = sp.get("date");
  const pax = sp.get("pax");

  return (
    <div>
      <h1>プラン詳細</h1>
      <p>planId={planId}</p>
      <p>
        引き継いだ条件: date={date} pax={pax}
      </p>

      <Link to={`/book/${planId}?date=${date}&pax={pax}`}>
        このプランを予約する
      </Link>
      <br />
      <Link to="/results?from=TYO&to=OSA&date=2026-03-14&pax=2">
        ←結果に戻る
      </Link>
    </div>
  );
}

function BookPage() {
  const { planId } = useParams();
  const [sp] = useSearchParams();
  const date = sp.get("date");
  const pax = sp.get("pax");

  return (
    <div style={{ padding: 24 }}>
      <h1>予約システム(ダミー)</h1>
      <p>planId={planId}</p>
      <p>
        date={date} pax={pax}
      </p>

      <p>※※仮※※</p>

      <Link to="/">Topに戻る</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/plan/:planId" element={<PlanPage />} />
      <Route path="/book/:planId" element={<BookPage />} />
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}

export default App;
