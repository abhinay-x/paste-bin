export function getCurrentTime(req) {
  if (
    process.env.TEST_MODE === "1" &&
    req?.headers?.["x-test-now-ms"] !== undefined
  ) {
    const ms = Number(req.headers["x-test-now-ms"]);
    if (!Number.isNaN(ms)) {
      return new Date(ms);
    }
  }
  return new Date();
}
