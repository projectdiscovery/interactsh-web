import { summonFor, AsOpaque } from "@morphic-ts/batteries/lib/summoner-ESBST";
import type { AType, EType } from "@morphic-ts/summoners";

import { ThemeName } from "theme";

import Data from "./data";
import Discord from "./discord";
import Filter from "./filter";
import Slack from "./slack";
import Tab from "./tab";
import Telegram from "./telegram";
import View from "./view";

const { summon } = summonFor<{}>({});

// Data structure of localStorage
export const StoredData_ = summon((F) =>
  F.interface(
    {
      view: View(F),
      increment: F.number(),
      correlationId: F.string(),
      theme: ThemeName(F),

      publicKey: F.string(),
      privateKey: F.string(),
      secretKey: F.string(),

      host: F.string(),
      token: F.string(),
      telegram: Telegram(F),
      slack: Slack(F),
      discord: Discord(F),
      selectedTab: Tab(F),
      tabs: F.array(Tab(F)),
      data: F.array(Data(F)),
      notes: F.array(F.string()),
      aesKey: F.string(),
      filter: Filter(F),
    },
    "StoredData"
  )
);

export interface StoredData extends AType<typeof StoredData_> {}
export interface StoredDataRaw extends EType<typeof StoredData_> {}
export default AsOpaque<StoredDataRaw, StoredData>()(StoredData_);
