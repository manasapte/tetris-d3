from flask import Flask, render_template, request, session, abort, jsonify
import json

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/tetris.html')
def index():
    return render_template('tetris.html') 

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8000)
