export const getCallRecord = async (
  record: string,
  partnership_id: string
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.skilla.ru/mango/getRecord?record=${record}&partnership_id=${partnership_id}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer testtoken",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка при получении записи: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return audioUrl;
  } catch (error) {
    console.error("Ошибка при загрузке записи:", error);
    throw error;
  }
};
