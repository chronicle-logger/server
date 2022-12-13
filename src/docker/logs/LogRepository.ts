import { Singleton } from "@baileyherbert/container";
import Docker from "dockerode";
import { Readable } from "stream";

/**
 * The application service responsible for communicating with the Docker Engine API to access `Container` log resources.
 */
@Singleton()
export class LogRepository {

    private readonly _client: Docker;

    public constructor() {
        this._client = new Docker();
    }

    /**
     * Returns a `string` consisting of the `Container` entity's log messages through the requested streams (among `stdout` and/or `stderr`)
     * within the requested timeframe or bounds.
     * 
     * @param containerId A reference to the `Container ID` of the `Container` whose logs should be returned.
     * @param options Configuration options that can be used to influence the behavior of the operation.
     */
    public async getLogs(containerId: string, options?: IGetLogsOptions): Promise<string> {
        // Create a reference to the Container entity
        const container = this._client.getContainer(containerId);

        // Retrieve the logs from the Docker Engine server
        const buffer = await container.logs({
            stdout: options?.stdout ?? true,
            stderr: options?.stderr ?? true,
            since: options?.since?.getTime() ? options.since.getTime() / 1000 : 0,
            until: options?.until?.getTime() ? options.until.getTime() / 1000 : 0,
            timestamps: options?.timestamps ?? false,
            tail: options?.tail
        });

        // Read the buffer into a UTF-8 string
        const logs = buffer.toString('utf-8');

        return logs;
    }

    /**
     * Returns a readable stream consisting of the requested `Container` entity's logs.
     * 
     * @param containerId A reference to the `Container ID` of the `Container` whose logs should be streamed.
     * @returns A readable stream consisting of the requested `Container` entity's logs.
     */
    public async getLogsStream(containerId: string, options?: IGetLogsStreamOptions): Promise<Readable> {
        // Create a reference to the Container entity
        const container = this._client.getContainer(containerId);
        
        // Use the client's HTTP connection to establish a new read stream consisting of the Container's logs
        const logStream = await container.logs({
            follow: true,
            stdout: options?.stdout ?? true,
            stderr: options?.stderr ?? true,
            since: options?.since?.getTime() ? options.since.getTime() / 1000 : 0,
            timestamps: options?.timestamps ?? false,
            tail: options?.tail,
            abortSignal: options?.abortSignal
        });

        // Wrap the old-style `NodeJS.ReadableStream` instance with a more modern `Readable` instance
        const readableLogStream = new Readable().wrap(logStream);

        

        // Return the log stream
        return readableLogStream;
    }

}

/**
 * Configuration options that can influence the behavior of a `getLogsStream()` operation.
 */
export interface IGetLogsStreamOptions {

    /**
     * Whether or not logs from the `stdout` stream should be included in the returned stream. 
     * 
     * Default: `true`.
     */
    readonly stdout?: boolean;

    /**
     * Whether or not logs from the `stderr` stream should be included in the returned stream. Default: `false`.
     */
    readonly stderr?: boolean;

    /**
     * Whether or not timestamps should be present for each log in the returned stream. Default: `false`.
     */
    readonly timestamps?: boolean;

    /**
     * Limits the scope of logs initially returned through the stream to those sent after `since` moment in time.
     */
    readonly since?: Date;

    /**
     * Limits the number of logs initially returned through the stream to the most recent `tail` number of logs. When `undefined`, all existing lines will be returned.
     */
    readonly tail?: number;

    /**
     * An `AbortSignal` that can be used to signal the termination of the stream.
     */
    readonly abortSignal?: AbortSignal;

}

/**
 * Configuration options that can influence the behavior of a `getLogs()` operation.
 */
export interface IGetLogsOptions extends IGetLogsStreamOptions {

    /**
     * Limits the scope of logs initially returned through the stream to those sent before `until` moment in time.
     */
    readonly until?: Date;

}