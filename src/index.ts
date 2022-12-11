import "reflect-metadata";
import 'source-map-support/register';

import grpc from "@grpc/grpc-js";

import { GetLogsResponse } from "./proto/proto/chronicle";

async function main(): Promise<void> {
    const server = new grpc.Server();
    server.addService(LogService)
}

main()
    .then(_ => console.log(`The process has completed; closing now`))    
    .catch(err => console.error(err));