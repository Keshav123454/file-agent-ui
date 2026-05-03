import axios from "axios";
import type { ChatResponse } from "../types/chat";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Upload File
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log("Uploading file:", file.name);
  const response = await api.post("/upload-file", formData);
  console.log("Upload response:", response.data);
  return response.data;
};

export const sendMessage = async (
  message: string,
  fileId?: string
): Promise<ChatResponse> => {
  const response = await api.post("/chat", {
    query: message,     // ✅ must match backend
    file_id: fileId,    // ✅ optional
  });

  return response.data;
};