import socketio

sio_server = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=[]
)

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path="sockets"
)

#Events


#When client reaches socket endpoint this is initiated.
@sio_server.event
async def connect(sid, environ, auth):
    print(f"Connected!! {sid}")

#Hnadle when user first uploads text
@sio_server.event()
async def submit(sid, text, sessionId):
    print(f"User {sessionId} has submitted text \n {text}")

#When user gets checked grammar back
@sio_server.event()
async def checked(sid, result, sessionId):
    print(f"User {sessionId} has a result.")

