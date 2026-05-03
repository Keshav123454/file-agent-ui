export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export type ChatResponse = {
  response: string;
};
