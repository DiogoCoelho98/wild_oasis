import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns/esm";

// Number of days between two dates.
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

// Formats a date string as the distance from the current date (e.g., "2 days ago" or "In 5 days")
export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true, // Adds "ago" or "In" based on whether the date is past or future
  })
    .replace("about ", "") // Removes "about"
    .replace("in", "In");

// Returns today's date as an ISO string, with time set to either the start or end of the day depending on the options
export const getToday = function (options = {}) {
  const today = new Date();
  // Set time to the last second of the day if we are comparing with earlier dates
  if (options?.end)
    today.setUTCHours(23, 59, 59, 999); // End of the day (23:59:59.999)
  else today.setUTCHours(0, 0, 0, 0); // Start of the day (00:00:00.000)

  return today.toISOString();
};

// Formats a numeric value as a USD currency string (e.g., "$1,234.56")
export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );
