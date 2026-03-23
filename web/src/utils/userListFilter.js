import { getUserTypeLabel } from "./userDisplay";

/**
 * Filters users by a single search term against name, email, raw type value, or localized type label.
 * @param {Array<{ name?: string, email?: string, type?: string }>} users
 * @param {string} query
 */
export function filterUsersBySearchQuery(users, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return users;

  return users.filter((u) => {
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const typeVal = (u.type || "").toLowerCase();
    const typeLabel = getUserTypeLabel(u.type).toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      typeVal.includes(q) ||
      typeLabel.includes(q)
    );
  });
}
