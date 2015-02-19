import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from contextlib import closing

# database making imports
from requests import get
from xml.etree import ElementTree
from dateutil.parser import parse as parse_time
from datetime import timedelta, datetime


# configuration
DATABASE = './booked.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
                db.close()


# make database

# global var buildings: list of dicts; building name, coordinates,
# and opening hours

buildings = [
 {'coordinates': (55.946103, -3.18656),
  'name': 'Alison House',
  'opening hours': '08:00AM - 10:00PM',
  'group': "Central"},
 {'coordinates': (55.944385, -3.186807),
  'name': 'Appleton Tower',
  'opening hours': '08:00AM - 09:00PM',
  'group': "Central"},
 {'coordinates': (55.943079, -3.187593),
  'name': 'Business School',
  'opening hours': '07:30AM - 10:30PM',
  'group': "Central"},
 {'coordinates': (55.921461, -3.171116),
  'name': 'Darwin',
  'opening hours': '07:45AM - 06:30PM',
  'group': "KB Labs"},
 {'coordinates': (55.948268, -3.183565),
  'name': 'High School Yards Labs',
  'opening hours': '24hr swipe card',
  'group': "Holyrood and High School Yards"},
 {'coordinates': (55.938631, -3.169601),
  'name': 'Holland House',
  'opening hours': '24hr swipe card',
  'group': "Accommodation Services"},
 {'coordinates': (55.944376, -3.189648),
  'name': 'Hugh Robson',
  'opening hours': '24hr swipe card',
  'group': "Central"},
 {'coordinates': (55.921658, -3.174223),
  'name': 'JCMB',
  'opening hours': '08.00AM - 21.00PM',
  'group': "KB Labs"},
 {'coordinates': (55.923437, -3.175012),
  'name': 'KB Centre',
  'opening hours': '24hr swipe card',
  'group': "KB Labs"},
 {'coordinates': (55.942796, -3.188995),
  'name': 'Main Library',
  'opening hours': '07:30AM - 02:30AM',
  'group': "Central"},
 {'coordinates': (55.950123, -3.179691),
  'name': 'Moray House',
  'opening hours': '07:30AM - 06:30PM',
  'group': "Holyrood and High School Yards"},
 {'coordinates': (55.922869, -3.175002),
  'name': 'Murray Library',
  'opening hours': '08:30AM - 11:00PM',
  'group': "KB Labs"},
 {'coordinates': (55.944951, -3.188628),
  'name': 'Teviot House',
  'opening hours': '??',
  'group': "Central"}]


building_names = ['Alison House', 'Appleton Tower', 'Business School', 'Darwin',
    'High School Yards Labs', 'Holland House', 'Hugh Robson', 'JCMB',
    'KB Centre', 'Main Library', 'Moray House', 'Murray Library', 'Teviot House']


# g.db.execute('insert into entries (title, text) values (?, ?)',
                 # [request.form['title'], request.form['text']])

def make_buildings(db, buildings):
    '''
    Populate the Building table with data from the buildings dictionary.
    param: dict, entries with name, group, coordinates, opening hours
    '''
    for b in buildings:
        db.execute('''insert into Building (name, group_, latitude, 
            longtitude, openingHours) values (?, ?, ?, ?, ?)''',
            building_dict2list(b))
    db.commit()


def building_dict2list(d):
    '''
    Convert a building dict to a heterogeneous list which can be passed
    as the second argument to g.db.execute('insert...', _)
    '''
    return [
        d['name'], 
        d['group'], 
        float(d['coordinates'][0]), 
        float(d['coordinates'][1]),
        d['opening hours']
    ]


def get_usage_xml_root():
    '''Returns the tree of the labmonitor XML.'''
    r = get(url='http://labmonitor.ucs.ed.ac.uk/myed/index.cfm?fuseaction=xml')
    return ElementTree.fromstring(r.content)


def make_labs(db):
    '''
    Populate the ComputerLab table with data from the labmonitor XML.
    Before calling the function the Building table must be complete;
    if a lab cannot be matched with a building, 
    '''
    root = get_usage_xml_root()
    rooms = [room.attrib for room in root.findall("room")]

    for r in rooms:
        db.execute('''insert into ComputerLab (name, id, seats, building)
            values (?, ?, ?, ?)''',
            room2list_make_labs(r))
    db.commit()


def room2list_make_labs(r):
    '''
    Convert a room dict to a heterogeneous list which can be passed
    as the second argument to g.db.execute('insert...', _) in the context 
    of adding entries to the ComputerLab table.
    '''
    # first determine the building
    for b in building_names:
        if b in r['location']:
            building = b
            break
    else:
        raise DatabaseError(format('No building can be matched with the lab {}; ',
            r['location']) ++ 'ensure the Building table contains information' ++
            'about all building.')

    return [
        r['location'],
        r['rid'],
        int(r['seats']),
        building
    ]


def record_current_usage(db):
    '''Writes information about current usage to the Record table.'''
    root = get_usage_xml_root()
    time_string = root.find('last-updated').text
    time = convert_time(time_string)
    rooms = [room.attrib for room in root.findall("room")]

    for r in rooms:
        db.execute('''insert into Record (time, labId, free) values (?, ?, ?)''',
            [time, r['rid'], int(r['free'])])
    db.commit()


def convert_time(time_string):
    '''
    Converts the input time from a string to an integer. The string should be 
    of the format Thursday 19 February 2015 at 02:36. The integer is the number 
    of seconds since 1970-01-01 00:00:00 UTC. This is the format required by
    the database.
    '''
    ref_time = datetime(1970, 1, 1)
    xml_time = parse_time(time_string)
    time_diff = xml_time - ref_time
    return time_diff.total_seconds()



if __name__ == '__main__':
    # app.run()
    db = connect_db()
    make_buildings(db, buildings)
    make_labs(db)
    record_current_usage(db)



