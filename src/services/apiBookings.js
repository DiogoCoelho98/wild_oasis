import { getToday } from "../utils/helpers";
import supabase from "./supabase";

// Fetches a specific booking by its ID, along with related cabin and guest information.
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id) // Filters by booking ID
    .single(); // Ensures only one record is returned

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Retrieves all bookings created after a specified date, up until the current day (inclusive).
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date) // Filters bookings created after the specified date
    .lte("created_at", getToday({ end: true })); // Limits bookings to the current day

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Retrieves all stays (bookings) with a start date after a specified date, up until today.
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date) // Filters stays with a start date after the specified date
    .lte("startDate", getToday()); // Limits stays to those starting by today

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Retrieves bookings with activity happening today, meaning either a check-in or check-out occurs today.
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    ) // Filters bookings where check-in or check-out happens today
    .order("created_at"); // Orders by booking creation date

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

// Updates a specific booking's information based on the provided booking ID and update object.
export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj) // Updates the booking with the new data from obj
    .eq("id", id) // Filters by booking ID
    .select() // Retrieves the updated data
    .single(); // Ensures only one record is returned

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

// Deletes a specific booking by its ID.
export async function deleteBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .delete() // Deletes the booking
    .eq("id", id); // Filters by booking ID

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
