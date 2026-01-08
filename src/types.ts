import type { Context } from "grammy";
import type { I18nFlavor } from "@grammyjs/i18n";

export type BotContext = Context & I18nFlavor;

export type UserInput = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  is_bot?: boolean;
  language_code?: string;
};
