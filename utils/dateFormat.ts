import { addDays, formatDate } from "date-fns";

export function toISOFormatString(date: string) {
    if (!date || date.length === 0) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
}

export const formatExpirationDate = (date?: string) => {
    if (!date) return "Sem dados";
    const daysAdded = addDays(new Date(date), 1).toString();
    const formatted = formatDate(daysAdded, "dd/MM/yyyy");
    return formatted;
};
