import { kafka } from "..";
import { MyProducer } from "../Producer/producer";
import { checkGrammar } from "../api";
import { onUploadTextConsume } from "./utils";


//Kafka Consumer to consume the upload-text topic 

export class MyConsumer {

    private readonly _topic = 'upload-text';
    
    
    async consume(onConsume: (message: any) => void) {
        const consumer = kafka.consumer({groupId: 'upload-group'});

        await consumer.connect()
        await consumer.subscribe({ topic: this._topic, fromBeginning: true })

        await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(JSON.parse(message.value!.toString()));
            onConsume(JSON.parse(message.value!.toString()));
            


        },
        });



    }



}
