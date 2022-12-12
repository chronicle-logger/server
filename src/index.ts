import "reflect-metadata";
import 'source-map-support/register';

import { from } from "ix/asynciterable";
import { map, withAbort } from "ix/asynciterable/operators";
import { CallContext, createServer } from "nice-grpc";
import { ContainerRepository } from "./docker/containers/ContainerRepository";
import { ContainerService } from "./docker/containers/ContainerService";
import { LogRepository } from "./docker/logs/LogRepository";
import { LogService } from "./docker/logs/LogService";

import {
    LogServiceImplementation,
    GetLogsRequest,
    GetLogsResponse,
    LogMessage,
    DeepPartial,
    LogServiceDefinition
} from "./proto/chronicle";

class LogController implements LogServiceImplementation {

    private readonly _containerService: ContainerService;
    private readonly _logService: LogService;

    public constructor() {
       this._containerService = new ContainerService(new ContainerRepository());
       this._logService = new LogService(new LogRepository()); 
    }

    public async getLogs(request: GetLogsRequest, context: CallContext): Promise<DeepPartial<GetLogsResponse>> {
        const containers = await this._containerService.searchContainers();
        const exampleContainer = containers[0];
        if (exampleContainer === undefined) throw new Error(`Could not resolve an example container.`);

        const exampleContainerLogs = await this._logService.getLogs(exampleContainer.id);

        return {
            contents: exampleContainerLogs
        }
    }

    public async *streamLogs(request: GetLogsRequest, context: CallContext): AsyncIterable<DeepPartial<LogMessage>> {
        try {
            const containers = await this._containerService.searchContainers();
            const exampleContainer = containers[0];
            if (exampleContainer === undefined) throw new Error(`Could not resolve an example container.`);
    
            const exampleContainerLogStream = await this._logService.getLogsStream(exampleContainer.id);
            
            yield* from(exampleContainerLogStream).pipe(
                withAbort(context.signal),
                map((message: Buffer) => ({ contents: message.toString('utf8') }))
            );
        }
        catch (reason) {
            console.error(reason);
        }
    }

}

async function main(): Promise<void> {
    const server = createServer();
    server.add(LogServiceDefinition, new LogController());

    console.log(`Starting LogService gRPC server`);
    await server.listen('localhost:3000');
}

main()
    .catch(err => console.error(err));