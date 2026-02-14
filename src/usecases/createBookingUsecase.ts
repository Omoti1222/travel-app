import {
  createBooking,
  type BookingRequest,
  type BookingResult,
} from "../api/bookings";
import { AppError } from "../domain/errors";

export type CreateBookingInput = BookingRequest;

let inFlight = false;

function validate(input: CreateBookingInput) {
  if (!input.planId) throw new AppError("INPUT", "planIdがありません");
  if (!input.date) throw new AppError("INPUT", "日付を選択してください");
  if (input.pax < 1) throw new AppError("INPUT", "人数が不正です");
  if (!input.name.trim()) throw new AppError("INPUT", "氏名を入力してください");
  if (!input.email.trim())
    throw new AppError("INPUT", "メールを入力してください");
}

export async function createBookingUsecase(
  input: CreateBookingInput,
): Promise<BookingResult> {
  if (inFlight) {
    throw new AppError("INPUT", "送信中、しばらくお待ちください");
  }

  validate(input);

  inFlight = true;
  try {
    const res = await createBooking(input);
    return res;
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;

    if (e instanceof Error) {
      const msg = e.message || "予約に失敗しました";
      const looksNetwork =
        msg.toLowerCase().includes("network") ||
        msg.toLocaleLowerCase().includes("timeout");
      if (looksNetwork)
        throw new AppError(
          "NETWORK",
          "通信に失敗しました。時間をおいて再試行してください。",
        );

      throw new AppError("UNKNOWN", msg);
    }

    throw new AppError("UNKNOWN", "予約に失敗しました");
  } finally {
    inFlight = false;
  }
}
