import { AsOpaque, summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";

const { summon } = summonFor<{}>({});

const Discord_ = summon((F) =>
  F.interface(
    {
      enabled: F.boolean(),
      webhook: F.string(),
      channel: F.string(),
    },
    "Discord"
  )
);

export interface Discord extends AType<typeof Discord_> {}
export interface DiscordRaw extends EType<typeof Discord_> {}
export const Discord = AsOpaque<DiscordRaw, Discord>()(Discord_);

export default Discord;
