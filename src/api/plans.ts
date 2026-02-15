export type Plan = {
  planId: string;
  title: string;
  from: string;
  to: string;
  price: number;
  description: string;
};

const DB: Plan[] = [
  {
    planId: "p1",
    title: "新幹線+ホテル お得プラン",
    from: "TYO",
    to: "OSA",
    price: 24000,
    description: "新幹線とホテルをまとめたシンプルなパック",
  },
  {
    planId: "p2",
    title: "飛行機+ホテル 早割プラン",
    from: "TYO",
    to: "OSA",
    price: 28000,
    description: "早割の航空券とホテルのセット",
  },
  {
    planId: "p3",
    title: "札幌 食べ歩きプラン",
    from: "TYO",
    to: "CTS",
    price: 35000,
    description: "札幌グルメを中心にした週末プラン",
  },
  {
    planId: "p4",
    title: "福岡 うまかもん食べ歩きプラン",
    from: "OSA",
    to: "FUK",
    price: 15000,
    description: "安い美味しい食べ物",
  },
];

export type FetchPlansQuery = {
  from?: string;
  to?: string;
  sort?: "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
};

export type FetchPlansResult = {
  plans: Plan[];
  totalPages: number;
  page: number;
};

export async function fetchPlans(
  query: FetchPlansQuery = {},
): Promise<FetchPlansResult> {
  await new Promise((r) => setTimeout(r, 300));

  const { from, to, sort = "price_asc", page = 1, pageSize = 2 } = query;

  const filtered = DB.filter((p) => {
    const okFrom = from ? p.from === from : true;
    const okTo = to ? p.to === to : true;
    return okFrom && okTo;
  });

  const sorted = [...filtered].sort((a, b) => {
    return sort === "price_asc" ? a.price - b.price : b.price - a.price;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const plans = sorted.slice(start, start + pageSize);

  return { plans, totalPages, page: safePage };
}

export async function fetchPlanById(planId: string): Promise<Plan> {
  await new Promise((r) => setTimeout(r, 600));
  const found = DB.find((p) => p.planId === planId);
  if (!found) {
    throw new Error("プランが見つかりません");
  }
  return found;
}
