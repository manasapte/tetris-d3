from flask import Flask, render_template, request, session, abort, jsonify
import json

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    return render_template('tetris.html') 

def run():
    app.run(host="0.0.0.0")
