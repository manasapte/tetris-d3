import time
import redis
r = redis.StrictRedis(host='localhost', port=6379, db=0)
ps = r.pubsub()

while(True):
    print "waking up"
    id1 = r.brpop('players',3)
    if id1 is not None:
        id2 = r.brpop('players',3)
        if(id2 != None):
            r.set('pairs_'+id1[1],id2[1])
            r.set('pairs_'+id2[1],id1[1])
            r.publish(id1[1],id2[1]) 
            r.publish(id2[1],id1[1])
        else:
            r.publish(id1[1],-1)
