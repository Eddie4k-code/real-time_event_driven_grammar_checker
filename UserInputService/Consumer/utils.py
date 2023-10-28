from sockets import sio_app, sio_server
import json

#Send the checked grammar result to the client via socket.io
async def process_checked_grammar_msg(data):
    
    
    try:
        
        payload_dict = json.loads(data)
        
        await sio_server.emit('checked', payload_dict)
    except Exception as e:
        print(e)
    