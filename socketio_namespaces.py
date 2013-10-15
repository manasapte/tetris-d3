from socketio.namespace import BaseNamespace
import redis
import signal
import json
import time

r = redis.StrictRedis(host='localhost', port=6379, db=0)

class PlayersNamespace(BaseNamespace):
  def recv_connect(self):
    self.ps = r.pubsub()
  
  def on_sync(self,packet):
    pData = packet.get('args')[0]
    board = pData.get('board')
    nextIndex = pData.get('nextIndex')
    score = pData.get('score')
    data = json.dumps({'board':board,'nextIndex':nextIndex,'score':score})
    r.set(self.id,data)
    partner_data = None
    if self.partner_id is not None and self.partner_id != -1:
      partner_data = r.get(self.partner_id) 
      self.emit('sync',{'partnerData':partner_data})
  
  def on_login(self, packet):
    try:
      self.id = r.get('sessionid')
      r.incr('sessionid')
      if packet.get('args')[0].get('multi'):
        r.lpush('players',self.id)
        self.ps.subscribe([self.id])
        for item in self.ps.listen():
          print 'got an item from listen'+str(item)
          if(item.get('type') == 'message'):
            data = json.loads(item.get('data'))
            self.partner_id = int(data.get('partner'))
            self.emit('login',{'id':self.id,'partner': data.get('partner'),'pieces':data.get('pieces')})
            break
      else:
        self.emit('login',{'id':self.id,'partner': -1,'pieces':[]})
    except:
      print "some exception"
      raise


  def disconnect(self, *args, **kwargs):
    print "Got a socket disconnection" # debug
    self.ps.unsubscribe()
    if self.id is not None:
        r.delete(self.id)
    super(PlayersNamespace, self).disconnect(*args, **kwargs)

