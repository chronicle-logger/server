import { EnvironmentManager, FileEnvironmentSource, ProcessEnvironmentSource } from "@baileyherbert/env";
import { join } from "path";

export const ApplicationEnvironmentManager: EnvironmentManager = new EnvironmentManager([
    new ProcessEnvironmentSource(),
    new FileEnvironmentSource(process.env.ENVIRONMENT_SOURCE ?? join(__dirname, "..", ".env"))
]);

/**
 * A container for the environment configuration values passed to this process.
 */
export const Environment = ApplicationEnvironmentManager.rules({
    
    /**
     * Whether or not debug mode should be enabled. Do not use this on production.
     */
    CHRONICLE_DEBUG: ApplicationEnvironmentManager.schema.boolean().optional(false),

    /**
     * The network port through which the server should be exposed.
     */
    CHRONICLE_PORT: ApplicationEnvironmentManager.schema.number().optional(7878),

    /**
     * The private token that should be used to authenticate requests to the API.
     */
    CHRONICLE_KEY: ApplicationEnvironmentManager.schema.string()

});