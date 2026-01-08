import type { Bot } from "grammy";
import type { BotContext, UserInput } from "../types.js";
import type { LanguageCommandDeps } from "./types.js";

export function registerLanguageCommand(
  bot: Bot<BotContext>,
  deps: LanguageCommandDeps
) {
  bot.command(["language", "lang"], async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const preferredLang = deps.initialLangFromUser(ctx.from as UserInput);
    await deps.ensureChatOnce(chatId, preferredLang);

    if (ctx.from) {
      await deps.db.upsertMember(chatId, ctx.from as UserInput);
    }

    await deps.useChatLocale(ctx, chatId);
    const raw = ctx.match?.trim();

    if (!raw) {
      await ctx.reply(ctx.t("language_help"));
      return;
    }

    const selected = deps.normalizeLang(raw);
    if (!selected) {
      await ctx.reply(ctx.t("language_invalid"));
      return;
    }

    await deps.setLang(chatId, selected);
    ctx.i18n.useLocale(selected);
    await ctx.reply(
      ctx.t("language_set", { language: deps.languageLabel(selected) })
    );
  });
}
