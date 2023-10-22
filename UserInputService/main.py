from typing import Union
from fastapi import FastAPI
from Producer.producer import MyProducer
from pydantic import BaseModel
import eventlet
import socketio
from fastapi.middleware.cors import CORSMiddleware
from sockets import sio_app, sio_server
import uvicorn
import json



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Content(BaseModel):
    text: str
    sessionId: str


@app.post("/upload-text")
async def upload_text(content: Content):

    try:

        #Produce the item to kafka topic
        text_producer = MyProducer(topic="upload-text")
        text_producer.produce(json.dumps({"text":content.text, "sessionId": content.sessionId}))

        #Emit the submission status to the backend
        await sio_server.emit("submit", {"text": content.text, "sessionId": content.sessionId})

        return {"message": "Uploaded"}
    
    except Exception as e:
        print(e)

    
    

@app.get("/")
def test():
    return "Hey!"


#Allow all traffic fast api gets to socket io
app.mount("/", app=sio_app)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)