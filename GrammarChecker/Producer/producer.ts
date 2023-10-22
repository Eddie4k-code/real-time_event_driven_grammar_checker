import { kafka } from ".."



export class MyProducer {
    private readonly _topic = 'grammar-checked';

    //Produce a message to kafka topic.
    async produce(message: string) {

        const producer = kafka.producer()
        await producer.connect()
        await producer.send({
            topic: this._topic,
            messages: [
                {value: message}
            ]
        });

        await producer.disconnect();




    }



}