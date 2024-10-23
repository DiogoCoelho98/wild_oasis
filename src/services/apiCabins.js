import supabase, { supabaseUrl } from "./supabase.js";

// Querying supabase client to get all Cabins
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

// Querying supabase client to create a Cabin row
export async function createCabin(newCabin) {
  // Validate image type
  const acceptedTypes = ["image/jpeg", "image/png"];
  if (!acceptedTypes.includes(newCabin.image.type)) {
    throw new Error(
      "Invalid image format. Only .jpeg and .png formats are allowed"
    );
  }

  const imgName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
  const imgPath = `${supabaseUrl}/storage/v1/object/public/cabin-image/${imgName}`;

  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imgPath }])
    .select();

  if (error) {
    console.error(error.message);
    throw new Error("Cabin could not be added");
  }

  // Upload a cabin image to supabase
  const { error: storageError } = await supabase.storage
    .from("cabin-image")
    .upload(imgName, newCabin.image);

  // Delete cabin if updating error
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError.message);
    throw new Error("Cabin image could not be uploaded, cabin was deleted");
  }

  return data;
}

// Querying supabase client to delete a Cabin row by the ID
export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
