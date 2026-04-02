export function formatDate(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(date));
}
