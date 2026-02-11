export type AppErrorCode = "INPUT" | "NETWORK" | "UNKNOWN";

export class AppError extends Error {
  code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export function toAppError(e: unknown): AppError {
  if (e instanceof AppError) return e;
  if (e instanceof Error) return new AppError("UNKNOWN", e.message);
  return new AppError("UNKNOWN", "不明なエラーが発生しました");
}
