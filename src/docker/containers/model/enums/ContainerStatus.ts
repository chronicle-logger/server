/**
 * An enumeration of the lifecycle states available to `Container` resources.
 */
export const enum ContainerStatus {
    Created = "created",
    Running = "running",
    Paused = "paused",
    Restarting = "restarting",
    Removing = "removing",
    Exited = "exited",
    Dead = "dead"
}