from typing import Union
from fastapi import FastAPI
from Producer.producer import MyProducer
from Consumer.consumer import MyConsumer
from Consumer.utils import process_checked_grammar_msg
from pydantic import BaseModel
import asyncio
import socketio
from fastapi.middleware.cors import CORSMiddleware
from sockets import sio_app, sio_server
import uvicorn
import json
import threading


app = FastAPI()




# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Structure of payload that is recieved from the client side when user submits text to be checked
class Content(BaseModel):
    text: str
    sessionId: str
    
# On App Starup start the consumers.
@app.on_event("startup")
async def startup_event():
    loop = asyncio.get_event_loop()
    global grammar_checked_consumer 
    grammar_checked_consumer = MyConsumer(loop=loop)
    
    loop.create_task(grammar_checked_consumer.consume(process_message=process_checked_grammar_msg))
    
# On App Shutdown shut the consumer.
@app.on_event("shutdown")
async def shutdown_event():
    await grammar_checked_consumer.close()
    


# User uploads text to be grammar checked at this route.
@app.post("/upload-text")
async def upload_text(content: Content):
    try:
        # Produce the item to the Kafka topic
        text_producer = MyProducer(topic="upload-text")
        text_producer.produce(json.dumps({"text": content.text, "sessionId": content.sessionId}))
        
        # Emit the submission status to the backend
        await sio_server.emit("submit", {"text": content.text, "sessionId": content.sessionId})
        
        
        return {"message": "Uploaded"}
    except Exception as e:
        print(e)


# Allow all traffic FastAPI gets to Socket.IO
app.mount("/", app=sio_app)




if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)