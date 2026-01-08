import type { Bot } from "grammy";
import type { BotContext, UserInput } from "../types.js";
import type { BaseCommandDeps } from "./types.js";

function parseBirthday(input: string): string | null {
  const trimmed = input.trim();
  let year: number;
  let month: number;
  let day: number;

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else {
    const eu = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
    if (!eu) return null;
    day = Number(eu[1]);
    month = Number(eu[2]);
    year = Number(eu[3]);
  }

  if (!isValidDate(year, month, day)) return null;

  const yyyy = String(year).padStart(4, "0");
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isValidDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function registerBirthdayCommand(
  bot: Bot<BotContext>,
  deps: BaseCommandDeps
) {
  bot.command(["birthday", "bday"], async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId || !ctx.from) return;

    const preferredLang = deps.initialLangFromUser(ctx.from as UserInput);
    await deps.ensureChatOnce(chatId, preferredLang);

    await deps.useChatLocale(ctx, chatId);
    const arg = ctx.match?.trim();

    if (!arg) {
      await ctx.reply(ctx.t("birthday_help"));
      return;
    }

    const birthday = parseBirthday(arg);
    if (!birthday) {
      await ctx.reply(ctx.t("birthday_invalid"));
      return;
    }

    await deps.db.upsertMember(chatId, ctx.from as UserInput);
    await deps.db.setBirthday(chatId, ctx.from.id, birthday);
    await ctx.reply(ctx.t("birthday_saved", { date: birthday }));
  });
}
