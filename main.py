__author__ = 'hanschristiangregersen'
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash
import sqlite3

# configuration

app = Flask(__name__)
app.config.from_envvar('FLASKR_SETTINGS', silent=True)


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = connect_to_database()
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()



def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exeption):
    db = getatt(g, 'db', None)
    if db is not None:
        db.close()




@app.route("/")
def hello():
    return "Hello World"


if __name__ == "__main__":
    app.run()
