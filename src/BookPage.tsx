import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { createBookingUsecase } from "./usecases/createBookingUsecase";
import { toAppError } from "./domain/errors";
import { getIntMin, getReturnTo, getString } from "./utils/query";

type Phase = "editing" | "submitting" | "confirmed";

export function BookPage() {
  const { planId } = useParams();
  const [sp] = useSearchParams();
  const date = getString(sp, "date");
  const pax = getIntMin(sp, "pax", 1, 1);

  const backUrl = getReturnTo(sp);

  const [phase, setPhase] = useState<Phase>("editing");
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  console.log("phase now =", phase);

  async function onSubmit(e: React.FormEvent) {
    console.log("submit", { name, email, planId, date, pax });
    e.preventDefault();
    setError(null);

    if (!planId) {
      setError("planIdがありません");
      return;
    }

    try {
      setPhase("submitting");
      const res = await createBookingUsecase({
        planId,
        date,
        pax,
        name,
        email,
      });
      setBookingId(res.bookingId);
      setPhase("confirmed");
    } catch (e: unknown) {
      const err = toAppError(e);

      if (err.code === "INPUT") {
        setError(err.message);
      } else if (err.code === "NETWORK") {
        setError(err.message);
      } else {
        setError("予約に失敗しました(再試行してください)");
      }

      setPhase("editing");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>予約入力</h1>

      <p>
        planId={planId} / date={date} / pax={pax}
      </p>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {phase === "editing" && (
        <form
          onSubmit={onSubmit}
          style={{ display: "grid", gap: 12, maxWidth: 360 }}
        >
          <label>
            氏名
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            メール
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <button type="submit">予約する</button>
        </form>
      )}

      {phase === "submitting" && <p>送信中... (Loading)</p>}

      {phase === "confirmed" && (
        <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>予約完了</h2>
          <p>予約ID: {bookingId}</p>

          <Link
            to={`/plan/${planId}?date=${date}&pax=${pax}&returnTo=${encodeURIComponent(backUrl)}`}
          >
            ← プラン詳細
          </Link>
          <br />
          <Link to={backUrl}>最初に戻る</Link>
        </div>
      )}
    </div>
  );
}
