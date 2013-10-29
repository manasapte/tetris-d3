import time
import redis
import json
import numpy as NP

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
            pieces = NP.random.randint(0,7,1000).tolist()
            r.publish(id1[1],json.dumps({'partner':id2[1],'pieces':pieces})) 
            r.publish(id2[1],json.dumps({'partner':id1[1],'pieces':pieces}))
        else:
            r.publish(id1[1],json.dumps({'partner':-1,'pieces':[]}))
