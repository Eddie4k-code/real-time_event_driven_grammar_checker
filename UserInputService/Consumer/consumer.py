from confluent_kafka import KafkaError
from confluent_kafka import Consumer, KafkaException

from aiokafka import AIOKafkaConsumer
import asyncio

#Class for a consumer to listen to 'grammar-checked' kafka topic.




class MyConsumer:
    
    def __init__(self, loop) -> None:
        self.consumer = AIOKafkaConsumer(
        "grammar-checked",
        loop=loop,
        bootstrap_servers="localhost:9092",
        group_id='grammar-checked'
    )
    
    topic = 'grammar-checked'
    
    async def consume(self, process_message):
        
        
        try:
            await self.consumer.start()
            print("Consuming")    
            
        except Exception as e:
            print(e)
            return
        
        
        try:
            async for msg in self.consumer:
                print(msg.value)
                await process_message(msg.value)
                
        finally:
            await self.consumer.stop()
            
    async def close(self):
        await self.consumer.stop()
        


