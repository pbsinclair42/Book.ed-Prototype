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
    #retrieve arguments from get_request
    suggestions = request.args.get('suggestions')
    longitude = request.args.get('la', 0, type=float)
    latitude = request.args.get('lo', 0, type=float)
    quiet = request.args.get('quiet', 0, type=int)
    close = request.args.get('close', 0, type=int)
    printer = request.args.get('printer', 0, type=int)
    group = request.args.get('group', 0, type=int)
    whiteboard = request.args.get('whiteboard', 0, type=int)
    daller = request.args.get('in')
    

    #Test Prints
    print 'quiet', quiet
    print 'close', close


    #Create user with given coordinates
    user = apicalls.User_data(longitude, latitude)
    # Create user field of previous suggestions and convert to python dictionary
    user.previousSuggestions = json.loads(suggestions)
    user.previousSuggestions = json.dumps(user.previousSuggestions).replace("false", "False").replace("true", "True")
    user.previousSuggestions = ast.literal_eval(user.previousSuggestions)

    #Test Print
    print user.previousSuggestions

    #Return a list of the best places best on given parameters
    bestPlaces = apicalls.returnBestPlaces(quiet, close, user)
    print bestPlaces


    ans = None
    if user.previousSuggestions:
        print 'user.previousSuggestions', user.previousSuggestions

        notVisited = True


        # answer is the best ranked of bestPlaces that has not been seen before

        for x in apicalls.stillOpen(bestPlaces): #should only query over places that are currenly open
            for y in user.previousSuggestions:
                #print 'x[location]', x['location'], 'y[location]', y['location']
                if x['location'] == y['location']:
                    #print "x['location'] == y['location']", x['location'] == y['location']
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


@app.route('/main.html')
def rMain():
    return render_template('main.html')
    
    
@app.route('/get_usage')
def getUsage():
    return jsonify(apicalls.libraryPercentageUsage())
    
@app.route('/get_avg_for2dates')
def getAvg2Dates():
    return jsonify(apicalls.libraryPercentageUsage())

@app.route('/visualisation.html')
def getVis():
    return render_template('visualisation.html')






if __name__ == "__main__":
    app.run()

