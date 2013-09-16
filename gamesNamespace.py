from socketio import namespace.BaseNamespace

class GamesNamespace(BaseNamespace):
    sockets = {}
    def recv_connect(self):
        print "Got a socket connection" # debug
        self.sockets[id(self)] = self
    def disconnect(self, *args, **kwargs):
        print "Got a socket disconnection" # debug
        if id(self) in self.sockets:
            del self.sockets[id(self)]
        super(GamesNamespace, self).disconnect(*args, **kwargs)
    # broadcast to all sockets on this channel!
    @classmethod
    def broadcast(self, event, message):
        for ws in self.sockets.values():
            ws.emit(event, message)
