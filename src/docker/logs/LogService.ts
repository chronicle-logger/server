import { Singleton } from "@baileyherbert/container";
import { Logger } from "@baileyherbert/logging/dist/core/Logger";
import { Readable } from "stream";
import { IGetLogsOptions, IGetLogsStreamOptions, LogRepository } from "./LogRepository";

/**
 * The application service responsible for exposing `Container` log resources.
 */
@Singleton()
export class LogService {

    /**
     * A unique logger for this service.
     */
    private readonly _logger: Logger;

    /**
     * The application service responsible for communicating with the Docker Engine API to access `Container` log resources.
     */
    private readonly _logRepository: LogRepository;

    /**
     * Initializes a new `LogService` instance.
     */
    public constructor(logger: Logger, logRepository: LogRepository) {
        this._logger = logger;
        this._logger.name = LogService.name;

        this._logRepository = logRepository;
    }

    /**
     * Returns a `string` consisting of the `Container` entity's log messages through the requested streams (among `stdout` and/or `stderr`)
     * within the requested timeframe or bounds.
     * 
     * @param containerId A reference to the `Container ID` of the `Container` whose logs should be returned.
     * @param options Configuration options that can be used to influence the behavior of the operation.
     * @returns A `string` consisting of the `Container` entity's log messages through the requested streams (among `stdout` and/or `stderr`)
     * within the requested timeframe or bounds.
     */
    public async getLogs(containerId: string, options?: IGetLogsOptions): Promise<string> {
        this._logger.debug(`Fetching logs from Container ID: '${containerId}' with options: `, options);
        return await this._logRepository.getLogs(containerId, options);
    }

    /**
     * Returns a readable stream consisting of the requested `Container` entity's logs.
     * 
     * @param containerId A reference to the `Container ID` of the `Container` whose logs should be streamed.
     * @returns A readable stream consisting of the requested `Container` entity's logs.
     */
    public async getLogsStream(containerId: string, options?: IGetLogsStreamOptions): Promise<Readable> {
        this._logger.debug(`Streaming logs from Container ID: '${containerId}'`);
        return await this._logRepository.getLogsStream(containerId, options);
    }

}