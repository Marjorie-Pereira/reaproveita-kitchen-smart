export function toISOFormatString(date: string) {
  if (!date) return "";
  const [day, month, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
