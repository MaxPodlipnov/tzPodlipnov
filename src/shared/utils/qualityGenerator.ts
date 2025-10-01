import { CallQuality } from "@/shared/types";

const qualityOptions: CallQuality[] = ["bad", "good", "excellent"];

export const generateRandomQuality = (callId: number): CallQuality => {
  // Используем ID звонка как seed для консистентности
  const seed = callId * 7 + 13; // Простая формула для псевдо-случайности
  const index = seed % qualityOptions.length;
  return qualityOptions[index];
};

export const assignQualityToCalls = (calls: any[]): any[] => {
  return calls.map(call => ({
    ...call,
    quality: generateRandomQuality(call.id)
  }));
};
