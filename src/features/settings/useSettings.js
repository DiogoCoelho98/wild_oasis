import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

// FETCH SETTINGS DATA
export function useSettings() {
  const {
    isPending,
    error,
    data: settings,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  return { isPending, error, settings };
}
