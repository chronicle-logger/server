import { Singleton } from "@baileyherbert/container";
import { Logger } from "@baileyherbert/logging";
import { isAbortError } from "abort-controller-x";
import { CallContext, ServerError, ServerMiddlewareCall, Status } from "nice-grpc";
import { Environment } from "../environment";

/**
 * The application middleware service responsible for properly reporting server errors to clients during remote procedure call handling.
 */
@Singleton()
export class ErrorHandlerMiddleware {

    /**
     * Represents a unique application logger instance for this service.
     */
    private readonly _logger: Logger;

    /**
     * Initializes a new `ErrorHandlerMiddleware` instance.
     */
    public constructor(logger: Logger) {
        this._logger = logger;
        this._logger.name = ErrorHandlerMiddleware.name;
    }

    /**
     * Handles the reporting of certain unexpected server errors through standard gRPC error conventions.
     * 
     * @param call A container whose contents represent both the request and the response pertaining to the current call.
     * @param context A container whose contents describe the received call.
     * @returns The result of the call.
     */
    async *invoke<Request, Response>(
        call: ServerMiddlewareCall<Request, Response>,
        context: CallContext
    ) {
        try {
            return yield* call.next(call.request, context);
        }
        catch (reason) {
            if (reason instanceof ServerError || isAbortError(reason)) {
                throw reason;
            }

            if (reason instanceof Error && reason.message === "aborted") {
                throw new ServerError(Status.ABORTED, `The operation was aborted.`);
            }

            if (reason instanceof Error && reason.message === "aborted") {
                throw new ServerError(Status.UNKNOWN, Environment.CHRONICLE_DEBUG ? `An unknown server error occurred: ${reason.message}` : `An unknown server error occurred.`);
            }

            throw new ServerError(Status.UNKNOWN, Environment.CHRONICLE_DEBUG ? `An unknown server error occurred: ${reason}` : `An unknown server error occurred.`);
        }
    }

}