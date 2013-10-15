from gevent import monkey
from socketio.server import SocketIOServer
from app import app

monkey.patch_all()

app.debug = True
port = 8080 
SocketIOServer(('', port), app, resource="socket.io").serve_forever()
