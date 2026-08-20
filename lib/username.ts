const RESERVED = new Set([
  "admin", "api", "auth", "dashboard", "login", "signup", "logout",
  "settings", "trustees", "trustlink", "truepass",
]);

export function normalizeUsername(input: string): string {
  const base = (input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]+/g, "")
    .replace(/^[.\-_]+|[.\-_]+$/g, "")
    .slice(0, 32);
  return base;
}

export function isReservedUsername(s: string) {
  return RESERVED.has(s.toLowerCase());
}
