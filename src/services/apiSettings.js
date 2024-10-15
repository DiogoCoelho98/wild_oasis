import supabase from "./supabase";

// Fetches the current settings from the "settings" table.s.
export async function getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*") // Selects all fields from the settings table
    .single(); // Expects a single row to be returned (since there is only one settings row)

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// Updates the existing settings in the "settings" table with the new values from `newSetting`
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting) // Updates the settings with the provided new values
    .eq("id", 1) // Filters by the ID
    .single(); // Ensures the updated data returned is a single row

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}
