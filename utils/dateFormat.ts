export function toISOFormatString(date: string) {
  if (!date || date.length === 0) return "";
  const [day, month, year] = date.split("/");
  return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
}
