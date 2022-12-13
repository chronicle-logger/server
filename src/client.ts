import { createChannel, createClient, Metadata } from "nice-grpc";
import {
    LogServiceClient,
    LogServiceDefinition
} from "./proto/chronicle";

async function main(): Promise<void> {
    const channel = createChannel("127.0.0.1:7878");
    const client: LogServiceClient = createClient(LogServiceDefinition, channel);
    
    // const response = await client.getLogs({ containerId: 'abc123' });
    // console.log(response.contents);

    const response = client.streamLogs({ containerId: 'hello' }, {
        metadata: Metadata({
            Authorization: "Bearer abc123"
        })
    });
    
    for await (const message of response) {
        console.log(`Received message:`, message.contents);
    }

}

main()
    .catch(reason => console.error(reason));