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



@app.route('/user_coordinates')
def getCoordinates():
    longitude = request.args.get('la', 0, type=int)
    latitude = request.args.get('lo', 0, type=int)

    user = apicalls.User_data(longitude, latitude)
    closestPlace = apicalls.closestPlace(user)[0]

    return jsonify(closestPlace)


@app.route('/detailed_suggestion')
def giveSuggestion(user):
    longitude = request.args.get('la', 0, type=int)
    latitude = request.args.get('lo', 0, type=int)
    user = apicalls.User_data(longitude, latitude)

    user.previousSuggestion = request.args.get('suggestions')

    returnObject = apicalls.closestPlace(user)

    ans=None
    for x in returnObject:
        if not x in user.previousSuggestion:
            ans = x

    if ans == None:
        ans = returnObject[0]

    return jsonify(ans)




if __name__ == "__main__":
    app.run()
