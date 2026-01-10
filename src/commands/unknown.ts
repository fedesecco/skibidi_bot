import type { AiCommandHandler } from "./types.js";

export const handleUnknownCommand: AiCommandHandler = async (reply) => {
  return reply.responseText;
};
