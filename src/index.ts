import "reflect-metadata";
import 'source-map-support/register';
import { ContainerRepository } from "./docker/containers/ContainerRepository";
import { ContainerService } from "./docker/containers/ContainerService";
import { ContainerStatus } from "./docker/containers/model/enums/ContainerStatus";

async function main(): Promise<void> {
    const containerService = new ContainerService(new ContainerRepository());
    console.log(await containerService.searchContainers({
        filters: {
            status: [ContainerStatus.Running, ContainerStatus.Exited, ContainerStatus.Dead]
        }
    }));
}

main().catch(err => console.error(err));