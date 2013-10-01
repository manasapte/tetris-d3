from socketio.namespace import BaseNamespace
import redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)
class PlayersNamespace(BaseNamespace):
    def recv_connect(self):
        print "Got a socket connection" # debug
        self.ps = r.pubsub()
    
    def on_login(self, packet):
        self.id = r.get('sessionid')
        r.incr('sessionid')
        r.lpush('players',self.id)
        self.ps.subscribe([self.id])
        data = self.ps.listen()
        #print "got data: "+data
        self.emit('login',self.id)
        
    def disconnect(self, *args, **kwargs):
        print "Got a socket disconnection" # debug
        self.ps.unsubscribe()
        if self.id is not None:
            r.delete(self.id)
        super(PlayersNamespace, self).disconnect(*args, **kwargs)

