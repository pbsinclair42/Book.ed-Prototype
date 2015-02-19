__author__ = 'hanschristiangregersen'
from flask import Flask, request, session, g, redirect, url_for, \
    abort, render_template, flash, jsonify
import sqlite3
import apicalls
import json, ast

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
    longitude = request.args.get('la', 0, type=float)
    latitude = request.args.get('lo', 0, type=float)

    user = apicalls.User_data(longitude, latitude)
    closestPlace = apicalls.closestPlace(user)[0]

    return jsonify(closestPlace)


@app.route('/detailed_suggestion')
def detailed_suggestion():
    longitude = request.args.get('la', 0, type=float)
    latitude = request.args.get('lo', 0, type=float)
    quiet = request.args.get('quiet', type=bool)


    user = apicalls.User_data(longitude, latitude)

    user.previousSuggestions = json.loads(request.args.get('suggestions'))
    user.previousSuggestions = ast.literal_eval(json.dumps(user.previousSuggestions))


    if quiet:
        bestPlaces = apicalls.quietPlace(user)
    else:
        bestPlaces = closestPlaces = apicalls.closestPlace(user)


    ans = None

    if user.previousSuggestions:
        print 'user.previousSuggestions', user.previousSuggestions

        notVisited = True

        for x in bestPlaces:
            for y in user.previousSuggestions:
                print 'x[location]', x['location'], 'y[location]', y['location']
                if x['location'] == y['location']:
                    print "x['location'] == y['location']", x['location'] == y['location']
                    notVisited = False
                    break
            if notVisited:
                ans = x
                break
            notVisited = True

    if ans == None:
        print 'ans==none is true'
        ans = bestPlaces[0]

    return jsonify(ans)


@app.route('/main')
def rMain():
    return render_template('main.html')
    
    
@app.route('/get_usage')
def getUsage():
    return jsonify(apicalls.libraryPercentageUsage())




if __name__ == "__main__":
    app.run()
