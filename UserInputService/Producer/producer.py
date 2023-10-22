from confluent_kafka import KafkaError
from confluent_kafka import Producer


class MyProducer:
    producer_config = {
        'bootstrap.servers': 'localhost:9092',
    }
    
    def __init__(self, topic) -> None:
        self.producer = Producer(
            self.producer_config
        )

        self.topic = topic

    def produce(self, value):
        #Produces message to kafka topic
        self.producer.produce(topic=self.topic, value=value)
        self.producer.flush()


