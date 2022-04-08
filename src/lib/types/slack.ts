import { AsOpaque, summonFor } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";

const { summon } = summonFor<{}>({});

const Slack_ = summon((F) =>
  F.interface(
    {
      enabled: F.boolean(),
      hookKey: F.string(),
      channel: F.string(),
    },
    "Slack"
  )
);

export interface Slack extends AType<typeof Slack_> {}
export interface SlackRaw extends EType<typeof Slack_> {}
export const Slack = AsOpaque<SlackRaw, Slack>()(Slack_);

export default Slack;
