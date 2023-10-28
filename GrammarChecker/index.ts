import { MyConsumer } from "./Consumer/consumer";
import {Kafka} from "kafkajs";
import axios from 'axios';
import { onUploadTextConsume } from "./Consumer/utils";


export const kafka = new Kafka({
  clientId: 'upload',
  brokers: ['localhost:9092'],
});

//Create consumer
const textConsumer = new MyConsumer();

//Start consuming messages from 'upload-text'
textConsumer.consume(onUploadTextConsume);






