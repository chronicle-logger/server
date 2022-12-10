import { ContainerStatus } from "./enums/ContainerStatus";

/**
 * Represents a `Docker` container.
 */
export interface IContainer {

    /**
     * A unique identifier for this `Container`.
     */
    readonly id: string;

    /**
     * A collection of the names associated with this `Container`.
     */
    readonly names: string[];

    /**
     * A reference to the name of the `Image` to which this `Container` belongs.
     */
    readonly imageName: string;

    /**
     * A reference to the `ID` associated with the `Image` to which this `Container` belongs.
     */
    readonly imageId: string;

    /**
     * The time at which this `Container` was created.
     */
    readonly created: Date;

    /**
     * The current lifecycle state of this container.
     */
    readonly status: ContainerStatus;
    
}