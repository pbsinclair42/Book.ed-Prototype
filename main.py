__author__ = 'hanschristiangregersen'
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash
import sqlite3

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


class User_data:
    def __init__(self, longitude=0, latitude=0):
        self.lo = longitude
        self.la = latitude


    def extract_location(self):
        return self.lo, self.la



@app.route("/", methods=['POST', 'GET'])
def index():
    longitude = request.args.get('lo', 0, type=int)
    latitude = request.args.get('la', 0, type=int)

    return render_template('index.html')


if __name__ == "__main__":
    app.run()
