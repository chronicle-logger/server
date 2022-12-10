import { Singleton } from "@baileyherbert/container";
import { ContainerRepository, ISearchContainersOptions } from "./ContainerRepository";
import { IContainer } from "./model/IContainer";

/**
 * The application service responsible for exposing and managing `Container` resources.
 */
@Singleton()
export class ContainerService {

    /**
     * The application service responsible for exposing and managing `Container` resources from the Docker Engine API.
     */
    private readonly _containerRepository: ContainerRepository;

    /**
     * Initializes a new `ContainerService` instance.
     * 
     * @param containerRepository The application service responsible for exposing and managing `Container` resources from the Docker Engine API.
     */
    public constructor(containerRepository: ContainerRepository) {
        this._containerRepository = containerRepository;
    }

    /**
     * Searches the `Container` instances on the connected Docker Engine instance and returns those matching the provided search criteria.
     * 
     * @returns A collection of `IContainer` instances that meet the provided search criteria.
     */
    public async searchContainers(options?: ISearchContainersOptions): Promise<IContainer[]> {
        return await this._containerRepository.searchContainers(options);
    }

}