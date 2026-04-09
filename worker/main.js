"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const job_1 = require("./jobs/traffic-monitor/job");
async function main() {
    console.log("[worker] started");
    (0, job_1.startTrafficMonitor)();
}
main();
