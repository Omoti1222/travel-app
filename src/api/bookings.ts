export type BookingRequest = {
  planId: string;
  date: string;
  pax: number;
  name: string;
  email: string;
};

export type BookingResult = {
  bookingId: string;
};

export async function createBooking(
  req: BookingRequest,
): Promise<BookingResult> {
  await new Promise((r) => setTimeout(r, 800));

  if (!req.planId) throw new Error("planIdがありません");
  if (!req.date) throw new Error("日付を選んでください");
  if (req.pax < 1) throw new Error("人数が不正です");
  if (!req.name.trim()) throw new Error("氏名を入力してください");
  if (!req.email.trim()) throw new Error("メールを入力してください");

  const bookingId = `b_${Math.random().toString(16).slice(2, 10)}`;
  return { bookingId };
}
