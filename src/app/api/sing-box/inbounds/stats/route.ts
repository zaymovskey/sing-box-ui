import { getInboundsStats } from "@/server/db/sing-box/inbounds";
import { InboundStatsSchema } from "@/shared/api/contracts";
import { withRoute } from "@/shared/lib/server";

export const GET = withRoute({
  auth: true,
  responseSchema: InboundStatsSchema.array(),
  handler: async () => {
    const inboundsStats = getInboundsStats();

    return inboundsStats;
  },
});
