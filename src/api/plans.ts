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
];

export async function fetchPlanById(planId: string): Promise<Plan> {
  await new Promise((r) => setTimeout(r, 600));

  const found = DB.find((p) => p.planId === planId);
  if (!found) {
    throw new Error("プランが見つかりません");
  }
  return found;
}
