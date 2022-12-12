import { container } from "@baileyherbert/container";
import { Logger } from "@baileyherbert/logging";
import { createServer } from "nice-grpc";
import "reflect-metadata";
import 'source-map-support/register';
import { ContainerRepository } from "./docker/containers/ContainerRepository";
import { ContainerService } from "./docker/containers/ContainerService";
import { LogController } from "./docker/logs/LogController";
import { LogRepository } from "./docker/logs/LogRepository";
import { LogService } from "./docker/logs/LogService";
import { Environment } from "./environment";

import {
    LogServiceDefinition
} from "./proto/chronicle";

async function main(): Promise<void> {
    // Instantiate the application's logger
    const logger = new Logger();
    logger.createConsoleTransport();

    // Configure the application's services
    container.register(Logger, { useFactory: _ => logger.createChild() });
    container.register(LogService);
    container.register(LogRepository);
    container.register(LogController);
    container.register(ContainerRepository);
    container.register(ContainerService);
    
    // Configure the gRPC server for the API
    const server = createServer();
    server.add(LogServiceDefinition, container.resolve(LogController));

    // Expose the gRPC server
    logger.info(`Exposing API on port ${Environment.PORT}`);
    await server.listen(`0.0.0.0:${Environment.PORT}`);
}

main().catch(err => console.error(err));