import { container } from "@baileyherbert/container";
import { Logger } from "@baileyherbert/logging";
import { isAbortError } from "abort-controller-x";
import { CallContext, createServer, ServerError, ServerMiddlewareCall, Status } from "nice-grpc";
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

async function *loggingMiddleware<Request, Response>(
    call: ServerMiddlewareCall<Request, Response>,
    context: CallContext
) {
    console.log(`Running middleware`);
    
    const { path } = call.method;

    try {
        console.log(`Calling next`);
        const result = yield* call.next(call.request, context);
        console.log(`Running middleware again`);
        console.log('Server call', path, 'end: OK');
        return result;
    }
    catch (reason) {
        if (reason instanceof ServerError) {
            console.log(
            'Server call',
            path,
            `end: ${Status[reason.code]}: ${reason.details}`,
            );
        }
        else if (isAbortError(reason)) {
            console.log('Server call', path, 'cancel');
        } 
        else {
            console.log('Server call', path, `error: `, reason);
        }

        throw reason;
    }
}

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
    const server = createServer().use(loggingMiddleware);
    
    server.add(LogServiceDefinition, container.resolve(LogController));

    // Expose the gRPC server
    logger.info(`Exposing API on port ${Environment.CHRONICLE_PORT}`);
    await server.listen(`0.0.0.0:${Environment.CHRONICLE_PORT}`);
}

main().catch(err => console.error(err));