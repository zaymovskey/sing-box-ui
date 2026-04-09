"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTrafficMonitor = startTrafficMonitor;
const client_1 = require("@/server/db/client");
const get_inbound_user_by_internal_name_1 = require("@/server/db/sing-box/inbounds/repository/get-inbound-user-by-internal-name");
const update_inbound_user_traffic_1 = require("@/server/db/sing-box/inbounds/repository/update-inbound-user-traffic");
const test_v2ray_api_1 = require("./test-v2ray-api");
function startTrafficMonitor() {
    const db = (0, client_1.getDb)();
    setInterval(async () => {
        try {
            const res = await (0, test_v2ray_api_1.queryStats)();
            const stats = res;
            const tx = db.transaction(() => {
                for (const statItem of stats.stat) {
                    if (!statItem.name.startsWith("user>>>")) {
                        continue;
                    }
                    let linkType;
                    if (statItem.name.endsWith(">>>traffic>>>uplink")) {
                        linkType = "uplink";
                    }
                    else if (statItem.name.endsWith(">>>traffic>>>downlink")) {
                        linkType = "downlink";
                    }
                    else {
                        continue;
                    }
                    const userInternalName = statItem.name.split(">>>")[1];
                    const trafficValue = Number.parseInt(statItem.value, 10);
                    if (Number.isNaN(trafficValue) || trafficValue < 0) {
                        console.warn(`[traffic] invalid traffic value for ${statItem.name}: ${statItem.value}`);
                        continue;
                    }
                    const dbUser = (0, get_inbound_user_by_internal_name_1.getInboundUserByInternalName)(userInternalName);
                    if (!dbUser) {
                        console.warn(`[traffic] user with internal name ${userInternalName} not found in db`);
                        continue;
                    }
                    const prefix = linkType === "uplink" ? "up" : "down";
                    const delta = trafficValue - dbUser[`last_seen_${prefix}_counter`];
                    if (delta > 0) {
                        console.log(`[traffic] user ${dbUser.id} (${dbUser.internal_name}) ${prefix}link traffic increased by ${delta} bytes (total: ${dbUser[`${prefix}_traffic_total`] + delta} bytes)`);
                        (0, update_inbound_user_traffic_1.updateInboundUserTraffic)(prefix, dbUser.id, trafficValue, dbUser[`${prefix}_traffic_total`] + delta);
                    }
                    else if (delta === 0) {
                        console.log(`[traffic] user ${dbUser.id} (${dbUser.internal_name}) ${prefix}link traffic unchanged at ${trafficValue} bytes`);
                        continue;
                    }
                    else {
                        console.log(`[traffic] user ${dbUser.id} (${dbUser.internal_name}) ${prefix}link traffic counter reset`);
                        (0, update_inbound_user_traffic_1.updateInboundUserTraffic)(prefix, dbUser.id, trafficValue, dbUser[`${prefix}_traffic_total`] + trafficValue);
                    }
                }
            });
            tx();
        }
        catch (err) {
            console.error("[traffic] query stats error:");
            console.error(err);
        }
    }, 3000);
}
