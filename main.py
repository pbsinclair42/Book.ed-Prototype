__author__ = 'hanschristiangregersen'
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify
import sqlite3
import apicalls

# configuration
DATABASE = '/Users/hanschristiangregersen/PycharmProjects/ILWHack2015/stat.db'
DEBUG = True
SECRET_KEY = 'key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()




@app.route('/')
    def index():
        return render_template('index.html')



@app.route('/user_coordinates', methods=['POST', 'GET'])
def getCoordinates():
    longitude = request.args.get('la', 0, type=int)
    latitude = request.args.get('lo', 0, type=int)

    user = User_data(longitude, latitude)

    flash('ok, it worked')



    return render_template('index.html')


if __name__ == "__main__":
    app.run()
