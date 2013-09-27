from flask import Flask, render_template, request, session, abort, jsonify
import json

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/tetris')
def index():
    return render_template('tetris.html') 

@app.route('/socket.io/<path:rest>')
def push_stream(rest):
    try:
        socketio_manage(request.environ, {'/gamedata': GamesNamespace}, request)
    except:
        app.logger.error("Exception while handling socketio connection",
                     exc_info=True)
