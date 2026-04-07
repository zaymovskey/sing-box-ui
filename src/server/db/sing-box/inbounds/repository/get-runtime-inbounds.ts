// import { getDb } from "@/server/db/client";
// import { InboundRowSchema, InboundUserRowSchema } from "@/shared/api/contracts";

// const sql = String.raw;

// export function getRuntimeInbounds() {
//   const db = getDb();

//   const inboundRows = db
//     .prepare(
//       sql`
//           SELECT
//             id,
//             display_tag,
//             internal_tag,
//             type,
//             listen,
//             listen_port,
//             sniff,
//             sniff_override_destination,
//             security_asset_id,
//             created_at,
//             updated_at
//           FROM inbounds
//           ORDER BY created_at DESC
//         `,
//     )
//     .all()
//     .map((row) => InboundRowSchema.parse(row));

//   const userRows = db
//     .prepare(
//       sql`
//           SELECT
//             id,
//           inbound_id,
//           kind,
//           sort_order,
//           internal_name,
//           display_name,
//           uuid,
//           flow,
//           password,
//           up_traffic_total,
//           down_traffic_total,
//           last_seen_up_counter,
//           last_seen_down_counter,
//           last_up_traffic_at,
//           last_down_traffic_at
//           FROM inbound_users
//           ORDER BY sort_order ASC
//         `,
//     )
//     .all()
//     .map((row) => InboundUserRowSchema.parse(row));
// }
