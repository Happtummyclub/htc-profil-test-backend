import crypto from "node:crypto";

function secret() {
  const s = process.env.RESULT_SIGNING_SECRET;
  if (!s || s.length < 32) throw new Error("RESULT_SIGNING_SECRET fehlt oder ist zu kurz");
  return s;
}

export function sign(name, values) {
  return crypto.createHmac("sha256", secret()).update(name + "\n" + values).digest("base64url");
}

export function verify(name, values, sig) {
  if (typeof sig !== "string" || !sig) return false;
  const expected = Buffer.from(sign(name, values));
  const given = Buffer.from(sig);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
