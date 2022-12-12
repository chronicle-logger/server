import { createChannel, createClient } from "nice-grpc";
import {
    LogServiceClient,
    LogServiceDefinition
} from "./proto/chronicle";

async function main(): Promise<void> {
    const channel = createChannel("127.0.0.1:3000");
    const client: LogServiceClient = createClient(LogServiceDefinition, channel);

    const response = client.streamLogs({ containerId: 'hello' });
    
    for await (const message of response) {
        console.log(`Received message:`, message.contents);
    }

}

main()
    .catch(reason => console.error(reason));