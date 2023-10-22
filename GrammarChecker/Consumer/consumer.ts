import { kafka } from "..";



export class MyConsumer {

    private readonly _topic = 'upload-text';
    
    
    async consume(onConsume: () => void) {
        const consumer = kafka.consumer({groupId: 'upload-group'});

        await consumer.connect()
        await consumer.subscribe({ topic: this._topic, fromBeginning: true })

        await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
            value: message.value!.toString(),
            });
        },
        });



    }



}
