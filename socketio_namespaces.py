from socketio.namespace import BaseNamespace
import redis
import signal
import json
import time

r = redis.StrictRedis(host='localhost', port=6379, db=0)

class PlayersNamespace(BaseNamespace):
  def recv_connect(self):
    print "Got a socket connection" # debug
    self.ps = r.pubsub()
  
  def on_sync(self,packet):
    r.set(self.id,packet['data']) 
    if self.partner_id is not None and self.partner_id != -1:
      self.emit('sync',{'data':r.get(self.partner_id)})
  
  def on_login(self, packet):
    self.id = r.get('sessionid')
    r.incr('sessionid')
    r.lpush('players',self.id)
    self.ps.subscribe([self.id])
    for item in self.ps.listen():
      print 'got an item from listen'+str(item)
      if(item['type'] == 'message'):
        data = json.loads(item['data'])
        self.partner_id = int(data['partner'])
        self.emit('login',{'id':self.id,'partner': data['partner'],'pieces':data['pieces']})
      
  def disconnect(self, *args, **kwargs):
    print "Got a socket disconnection" # debug
    self.ps.unsubscribe()
    if self.id is not None:
        r.delete(self.id)
    super(PlayersNamespace, self).disconnect(*args, **kwargs)

