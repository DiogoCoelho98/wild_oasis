import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

// FETCH CABINS DATA
export function useCabins() {
  const {
    data: cabins,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { cabins, isLoading, error };
}
