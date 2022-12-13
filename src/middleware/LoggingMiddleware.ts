import { Singleton } from "@baileyherbert/container";
import { Logger } from "@baileyherbert/logging";
import { isAbortError } from "abort-controller-x";
import { CallContext, ServerError, ServerMiddlewareCall, Status } from "nice-grpc";

/**
 * An application middleware service that can be used to add application logging to track remote procedure call activity.
 */
@Singleton()
export class LoggingMiddleware {

    /**
     * Represents a unique application logger instance for this service.
     */
    private readonly _logger: Logger;

    /**
     * Initializes a new `LoggingMiddleware` instance.
     */
    public constructor(logger: Logger) {
        this._logger = logger;
        this._logger.name = LoggingMiddleware.name;
    }

    /**
     * Adds application logging to track server gRPC activity.
     * 
     * @param call A container whose contents represent both the request and the response pertaining to the current call.
     * @param context A container whose contents describe the received call.
     * @returns The result of the call.
     */
    async *invoke<Request, Response>(
        call: ServerMiddlewareCall<Request, Response>,
        context: CallContext
    ) {
        const { path } = call.method;
        this._logger.debug(`Handling gRPC to '${path}'`);

        try {
            // Attempt to handle the request through successive middleware and the ultimate handler
            const result = yield* call.next(call.request, context);

            // Indicate that the request was successfully handled
            this._logger.debug(`Call to '${path}' was handled successfully`);

            return result;
        }
        catch (reason) {
            if (reason instanceof ServerError) {
                this._logger.warning(`Call to '${path}' was unsuccessful - status ${Status[reason.code]}: ${reason.details}`);
            }
            else {
                this._logger.error(`Call to '${path}' was unsuccessful due to an unhandled error:`, reason);
            }

            throw reason;
        }
    }

}