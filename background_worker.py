import time
import redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)
ps = r.pubsub()

while(True):
    print "waking up"
    id1 = brpop('players',5)
    if id1 is not None:
        id2 = brpop('brpop',5)
        if(id2 != None):
            r.set('pairs_'+id1,id2)
            r.set('pairs_'+id2,id1)
            ps.publish(id1,id2) 
            ps.publish(id2,id1)
        else:
            ps.publish(id1,-1)
    if r.llen('players') == 0:
        time.sleep(2)
