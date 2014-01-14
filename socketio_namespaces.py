from socketio.namespace import BaseNamespace
import redis
import signal
import json
import time

r = redis.StrictRedis(host='localhost', port=6379, db=0)

class PlayersNamespace(BaseNamespace):
  def __init__(self, *args, **kwargs):
    BaseNamespace.__init__(self, *args, **kwargs)
    self.gameOver = False
    self.pGameOver = False

  def recv_connect(self):
    self.ps = r.pubsub()

  def on_sync(self,packet):
    print('on sync and id: '+self.id)
    pData = packet.get('args')[0]
    if(not self.gameOver):
      gameOver = pData.get('gameOver')
      if(not gameOver):
        score = pData.get('score')
        board = pData.get('board')
        nextIndex = pData.get('nextIndex')
        data = json.dumps({'board': board, 'nextIndex': nextIndex, 'score': score})
        r.set(self.id,data)
      else:
        data = json.loads(r.get(self.id))
        data['gameOver'] = True
        data = json.dumps(data)
        r.set(self.id,data)
        self.gameOver = True
    partner_data = None
    try:
      if self.partner_id != -1 and (not self.pGameOver):
        partner_data = r.get(self.partner_id)
        #print("partner id: "+str(self.partner_id)+" and pdata: "+partner_data)
        pdata = json.loads(partner_data)
        if(pdata.get('gameOver')):
          self.pGameOver = True
        self.emit('sync',{'partnerData':partner_data})
    except AttributeError:
      partner_data = r.get(self.partner_id)
      self.emit('sync',{'partnerData':partner_data})
    except TypeError:
      print "consuming typeerror"
    if(self.gameOver and self.pGameOver):
      self.emit('done')


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
            self.emit('login',{'id':self.id,'partner': data.get('partner'),'pieces':data.get('pieces'), 'timeout': 60})
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

