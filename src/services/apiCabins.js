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

// Querying supabase client to create and edit a Cabin
export async function createEditCabin(newCabin, id) {
  // CHECK IF THE PROVIDED IMG PATH IS A SUPABASE URL (INDICATING AN EXISTING IMAGE)
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  // UNIQUE IMG NAME
  const imgName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
  // DETERMINE IMG PATH: IF IT'S AN EXISTING IMG, USE THAT; OTHERWISE, CREATE A NEW PATH FOR THE UPLOAD
  const imgPath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-image/${imgName}`;

  let query = supabase.from("cabins");

  // CREATE CABIN IF NO ID
  if (!id) {
    query = query.insert([{ ...newCabin, image: imgPath }]);
  }

  // EDIT IF ID
  if (id) {
    query = query.update({ ...newCabin, image: imgPath }).eq("id", id);
  }

  const { data, error } = await query.select();

  if (error) {
    console.error(error.message);
    throw new Error("Cabin could not be added");
  }
  // IF IMG WAS AN EXISTING SUPABASE IMG, RETURN THE CABIN DATA
  if (hasImagePath) {
    return data;
  }

  // IF IMG NEW, UPLOAD TO SUPABASE STORAGE
  const { error: storageError } = await supabase.storage
    .from("cabin-image")
    .upload(imgName, newCabin.image);

  // DELETE CABIN IF THERE'S AN UPLOADING ERROR
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError.message);
    throw new Error("Cabin image could not be uploaded, cabin was deleted");
  }

  return data;
}

// Querying supabase client to delete a Cabin by the ID
export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
