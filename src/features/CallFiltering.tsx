import { useMemo } from "react";
import { Call, FilterType } from "@/shared/types";

export const useCallFilters = (calls: Call[], filter: FilterType): Call[] => {
  const filteredCalls = useMemo(() => {
    if (filter === "all") return calls;

    if (filter === "incoming") {
      return calls.filter((call) => call.in_out === 1);
    }

    if (filter === "outgoing") {
      return calls.filter((call) => call.in_out === 0);
    }

    return calls;
  }, [calls, filter]);

  return filteredCalls;
};
