import { getInboundsStats } from "@/server/db/sing-box/inbounds";
import {
  type InboundsStatsResponse,
  InboundsStatsResponseSchema,
} from "@/shared/api/contracts";
import { withRoute } from "@/shared/server";

export const GET = withRoute({
  auth: true,
  responseSchema: InboundsStatsResponseSchema,
  handler: async () => {
    const inboundsStats = getInboundsStats();

    const inboundsStatsResponse: InboundsStatsResponse = {
      items: inboundsStats,
    };

    return inboundsStatsResponse;
  },
});
