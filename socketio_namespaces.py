from socketio import namespace.BaseNamespace
import redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)
class PlayersNamespace(BaseNamespace):
    def recv_connect(self):
        print "Got a socket connection" # debug
        self.id = r.get('sessionid')
        self.ps = r.pubsub()
        r.incr('sessionid')
        r.lpush('players',self.id)
        self.ps.subscribe([self.id])
        data = self.ps.listen()
        print "got data: "+data

    def disconnect(self, *args, **kwargs):
        print "Got a socket disconnection" # debug
        self.ps.unsubscribe()
        super(PlayersNamespace, self).disconnect(*args, **kwargs)

    # broadcast to all sockets on this channel!
    @classmethod
    def broadcast(self, event, message):
        for ws in self.sockets.values():
            ws.emit(event, message)

class GamesNamespace(BaseNamespace):
    sockets = {}
    def recv_connect(self):
        print "Got a socket connection" # debug
        self.sockets[id(self)] = self
    def disconnect(self, *args, **kwargs):
        print "Got a socket disconnection" # debug
        if id(self) in self.sockets:
            del self.sockets[id(self)]
        super(PlayersNamespace, self).disconnect(*args, **kwargs)
    # broadcast to all sockets on this channel!
    @classmethod
    def broadcast(self, event, message):
        for ws in self.sockets.values():
            ws.emit(event, message)
