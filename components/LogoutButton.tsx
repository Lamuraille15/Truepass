"use client";
export function LogoutButton() {
  async function logout() {
    await fetch("/auth/logout", { method: "POST" });
    window.location.href = "/";
  }
  return (
    <button type="button" onClick={logout} className="btn-ghost text-xs">Se déconnecter</button>
  );
}
