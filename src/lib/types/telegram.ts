import { AsOpaque, summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";

const { summon } = summonFor<{}>({});

const Telegram_ = summon((F) =>
  F.interface(
    {
      enabled: F.boolean(),
      botToken: F.string(),
      chatId: F.string(),
    },
    "Telegram"
  )
);

export interface Telegram extends AType<typeof Telegram_> {}
export interface TelegramRaw extends EType<typeof Telegram_> {}
export const Telegram = AsOpaque<TelegramRaw, Telegram>()(Telegram_);

export default Telegram;
