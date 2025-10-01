import { axiosInstance } from "../shered/lib/axiosInstance";
import { ApiResponse, Call } from "@/shared/types";

export class AllCalls {
  static getAllCalls = async (): Promise<ApiResponse<Call>> => {
    try {
      const response = await axiosInstance.post("");
      return response.data;
    } catch (error) {
      console.error("Error fetching calls:", error);
      throw error;
    }
  };
}
