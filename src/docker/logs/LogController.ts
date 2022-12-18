import { Singleton } from "@baileyherbert/container";
import { from } from "ix/asynciterable";
import { map } from "ix/asynciterable/operators";
import { CallContext } from "nice-grpc";
import { DeepPartial, GetLogsRequest, GetLogsResponse, LogMessage, LogServiceImplementation } from "../../proto/chronicle";
import { ContainerService } from "../containers/ContainerService";
import { LogService } from "./LogService";

/**
 * Controller responsible for exposing the networked Logs API.
 */
@Singleton()
export class LogController implements LogServiceImplementation {

    /**
     * The application service responsible for exposing and managing `Container` resources.
     */
    private readonly _containerService: ContainerService;

    /**
     * The application service responsible for exposing `Container` log resources.
     */
    private readonly _logService: LogService;

    /**
     * Initializes a new `LogController` instance.
     */
    public constructor(containerService: ContainerService, logService: LogService) {
       this._containerService = containerService;
       this._logService = logService;
    }

    /**
     * Returns a `string` consisting of the `Container` entity's log messages among the requested streams (among `stdout` and/or `stderr`)
     * within the requested timeframe or bounds.
     * 
     * @param request The contents of the request received from the client, outlining the `Container` whose logs should be returned.
     * @param context A container for details pertaining to the received request.
     * @returns A `string` consisting of the `Container` entity's log messages among the requested streams (among `stdout` and/or `stderr`)
     * within the requested timeframe or bounds.
     */
    public async getLogs(request: GetLogsRequest, context: CallContext): Promise<DeepPartial<GetLogsResponse>> {
        // Create a reference to the requested container
        const containers = await this._containerService.searchContainers();
        const exampleContainer = containers[0];
        if (exampleContainer === undefined) throw new Error(`Could not resolve an example container.`);

        // Retrieve the logs from the requested container
        const exampleContainerLogs = await this._logService.getLogs(exampleContainer.id);

        // Return the retrieved logs from the requested container
        return {
            contents: exampleContainerLogs
        }
    }

    /**
     * Returns a stream consisting of the requested `Container` entity's logs among the requested streams (among `stdout` and/or `stderr`).
     * 
     * @param request The contents of the request received from the client, outliing the `Container` whose logs should be streamed.
     * @param context A container for details pertaining to the received request.
     * @returns A stream consistingt of the requested `Container` entity's logs among the requested streams (among `stdout` and/or `stderr`).
     */
    public async *streamLogs(request: GetLogsRequest, context: CallContext): AsyncIterable<DeepPartial<LogMessage>> {
        // Create a reference to the requested container
        const containers = await this._containerService.searchContainers();
        const exampleContainer = containers[0];
        if (exampleContainer === undefined) throw new Error(`Could not resolve an example container.`);

        // Create a readable stream consisting of the requested container's logs
        const exampleContainerLogStream = await this._logService.getLogsStream(exampleContainer.id, { abortSignal: context.signal });

        // Forward the contents of the readable stream to the client
        yield* from(exampleContainerLogStream).pipe(
            map((message: Buffer) => ({ contents: message.toString('utf8') }))
        );
    }

}