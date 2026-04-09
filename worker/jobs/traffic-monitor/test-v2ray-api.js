"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTO_PATH = void 0;
exports.queryStats = queryStats;
/* eslint-disable @typescript-eslint/no-explicit-any */
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
function resolveProtoPath() {
    const distPath = node_path_1.default.resolve(process.cwd(), ".worker-dist/server/worker/grpc/stats.proto");
    if (node_fs_1.default.existsSync(distPath)) {
        return distPath;
    }
    return node_path_1.default.resolve(process.cwd(), "src/server/worker/grpc/stats.proto");
}
exports.PROTO_PATH = resolveProtoPath();
const packageDefinition = protoLoader.loadSync(exports.PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDefinition);
const StatsService = proto.v2ray.core.app.stats.command.StatsService;
const client = new StatsService("127.0.0.1:4444", grpc.credentials.createInsecure());
async function queryStats() {
    return new Promise((resolve, reject) => {
        client.QueryStats({
            pattern: "",
            reset: false,
        }, (err, response) => {
            if (err) {
                return reject(err);
            }
            resolve(response);
        });
    });
}
// async function main() {
//   try {
//     console.log("🚀 calling v2ray api...");
//     const res = await queryStats();
//     console.log("✅ RESPONSE:");
//     console.dir(res, { depth: null });
//   } catch (err) {
//     console.error("❌ ERROR:");
//     console.error(err);
//   }
// }
// main();
