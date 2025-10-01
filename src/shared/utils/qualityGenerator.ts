import { CallQuality } from "@/shared/types";

const qualityOptions: CallQuality[] = ["bad", "good", "excellent"];

export const generateRandomQuality = (callId: number): CallQuality => {
  const seed = callId * 7 + 13;
  const index = seed % qualityOptions.length;
  return qualityOptions[index];
};

export const assignQualityToCalls = (calls: any[]): any[] => {
  return calls.map((call) => ({
    ...call,
    quality: generateRandomQuality(call.id),
  }));
};
