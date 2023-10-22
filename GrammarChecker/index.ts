import { MyConsumer } from "./Consumer/consumer";

import {Kafka} from "kafkajs";
import axios from 'axios';


export const kafka = new Kafka({
  clientId: 'upload',
  brokers: ['localhost:9092'],
});

//Create consumer
const textConsumer = new MyConsumer();


//Function will check the grammar for text read by the consumer
const onUploadTextConsume = () => {




}



//Start consuming messages
textConsumer.consume(onUploadTextConsume);






