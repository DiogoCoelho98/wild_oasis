import supabase from "./supabase";

// Fetches the current settings
export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// Update existing settings (id not needed cause I'm updating only the first row)
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    .eq("id", 1) // Filters by the ID
    .single();

  console.log(data);
  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }

  return data;
}
