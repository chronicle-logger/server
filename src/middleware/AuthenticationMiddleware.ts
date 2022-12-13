import { Singleton } from "@baileyherbert/container";
import { Logger } from "@baileyherbert/logging";
import { CallContext, ServerError, ServerMiddlewareCall, Status } from "nice-grpc";
import { Environment } from "../environment";

/**
 * The application middleware service responsible for authenticating incoming remote procedure call requests.
 */
@Singleton()
export class AuthenticationMiddleware {

    /**
     * Represents a unique application logger for this service.
     */
    private readonly _logger: Logger;

    /**
     * Initializes a new `AuthenticationMiddleware` instance.
     */
    public constructor(logger: Logger) {
        this._logger = logger;
        this._logger.name = AuthenticationMiddleware.name;
    }

    async *invoke<Request, Response>(
        call: ServerMiddlewareCall<Request, Response>,
        context: CallContext
    ) {
        const authorization = context.metadata.get("Authorization");

        if (!authorization) {
            throw new ServerError(Status.UNAUTHENTICATED, "Missing Authorization metadata");
        }

        const parts = authorization.toString().split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new ServerError(Status.UNAUTHENTICATED, `Invalid Authorization metadata format. Expected "Bearer <token>".`);
        }

        const token = parts[1];

        if (token !== Environment.CHRONICLE_KEY) {
            throw new ServerError(Status.UNAUTHENTICATED, `Unable to authenticate provided credentials`);
        }

        this._logger.info(`Authenticated request to ${call.method.path} with token'`);
        return yield* call.next(call.request, context);
    }

}
