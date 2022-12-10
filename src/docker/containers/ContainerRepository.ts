import { Singleton } from "@baileyherbert/container";
import Docker from "dockerode";
import { ContainerStatus } from "./model/enums/ContainerStatus";
import { IContainer } from "./model/IContainer";

/**
 * The application service responsible for communicating with the Docker Engine API to access and manage `Container` resources.
 */
@Singleton()
export class ContainerRepository {

    /**
     * The client instance used internally to communicate with the Docker Engine API.
     */
    private readonly _client: Docker;

    /**
     * Initailizes a new `ContainerRepository` instance.
     */
    public constructor() {
        this._client = new Docker();
    }

    /**
     * Searches the `Container` instances on the connected Docker Engine instance and returns those matching the provided search criteria.
     * 
     * @returns A collection of `IContainer` instances that meet the provided search criteria.
     */
    public async searchContainers(options?: ISearchContainersOptions): Promise<IContainer[]> {
        const clientContainers = await this._client.listContainers({
            filters: options?.filters ?? {}
        });

        return clientContainers.map(clientContainer => ({
            id: clientContainer.Id,
            names: clientContainer.Names,
            imageName: clientContainer.Image,
            imageId: clientContainer.ImageID,
            created: new Date(clientContainer.Created * 1000),
            status: clientContainer.State as ContainerStatus
        }));
    }

}

/**
 * Configuration options that can be used to influence the behavior of a `searchContainers()` operation.
 */
export interface ISearchContainersOptions {

    /**
     * Search filters that outline the criteria that `Container` entities must meet in order to be considered acceptable.
     */
    readonly filters: ISearchContainersFilters
    
}

/**
 * Search filters that outline the criteria that `Container` entities must meet in order to be included within `searchContainers()` results.
 */
export interface ISearchContainersFilters {

    /**
     * A collection of acceptale `ContainerStatus` values.
     */
    readonly status: ContainerStatus[]

}