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
     * The network port through which the server should be exposed.
     */
    PORT: ApplicationEnvironmentManager.schema.number().optional(7878)

});