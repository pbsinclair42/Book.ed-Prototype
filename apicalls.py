__author__ = 'hanschristus'

import requests
from xml.etree import ElementTree
import math, time




class User_data:
    def __init__(self, latitude=0, longitude=0):
        self.la = latitude
        self.lo = longitude


# global var buildings: list of dicts; building name, coordinates,
# and opening hours
buildings = [
 {'coordinates': (55.946103, -3.18656),
  'name': 'Alison House',
  'opening hours': '08:00AM - 10:00PM'},
 {'coordinates': (55.944385, -3.186807),
  'name': 'Appleton Tower',
  'opening hours': '08:00AM - 09:00PM'},
 {'coordinates': (55.943079, -3.187593),
  'name': 'Business School',
  'opening hours': '07:30AM - 10:30PM'},
 {'coordinates': (55.921461, -3.171116),
  'name': 'Darwin',
  'opening hours': '07:45AM - 06:30PM'},
 {'coordinates': (55.948268, -3.183565),
  'name': 'Holyrood and High School',
  'opening hours': '24hr swipe card'},
 {'coordinates': (55.938631, -3.169601),
  'name': 'Holland House',
  'opening hours': '24hr swipe card'},
 {'coordinates': (55.944376, -3.189648),
  'name': 'Hugh Robson',
  'opening hours': '24hr swipe card'},
 {'coordinates': (55.921658, -3.174223),
  'name': 'JCMB',
  'opening hours': '08.00AM - 09:00PM'},
 {'coordinates': (55.923437, -3.175012),
  'name': 'KB Centre',
  'opening hours': '24hr swipe card'},
 {'coordinates': (55.942796, -3.188995),
  'name': 'Main Library',
  'opening hours': '07:30AM - 02:30AM'},
 {'coordinates': (55.950123, -3.179691),
  'name': 'Moray House',
  'opening hours': '07:30AM - 06:30PM'},
 {'coordinates': (55.922869, -3.175002),
  'name': 'Murray Library',
  'opening hours': '08:30AM - 11:00PM'},
 {'coordinates': (55.944951, -3.188628),
  'name': 'Teviot House',
  'opening hours': '09:00AM - 03:00AM'}]



featuresBuilding = [{'building': 'Alison House',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Alison House',
  'roomName': 'Alison House'},
 {'building': 'Appleton Tower',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Appleton Tower Foyer - Cafe',
  'roomName': 'Foyer Cafe'},
 {'building': 'Appleton Tower',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Appleton Tower Level 1 (Mezzanine)',
  'roomName': 'Level 1'},
 {'building': 'Teviot',
  'hasGroupSpace': 0,
  'hasPrinter': 0,
  'hasWhiteboard': 0,
  'id': 'Central Teviot House - Cafe',
  'roomName': 'Teviot Study'},
 {'building': 'Hugh Robson',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Hugh Robson Bldg Basement A',
  'roomName': 'Basement A'},
 {'building': 'Hugh Robson',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Hugh Robson Bldg Basement B',
  'roomName': 'Basement B'},
 {'building': 'Main Library',
  'hasGroupSpace': 0,
  'hasPrinter': 0,
  'hasWhiteboard': 0,
  'id': 'Central Main Library - Cafe',
  'roomName': 'Cafe labs'},
 {'building': 'Main Library',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 1,
  'id': 'Central Main Library Ground',
  'roomName': 'Ground floor'},
 {'building': 'Main Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Main Library Ground - Quick Use',
  'roomName': 'Quick use labs'},
 {'building': 'Main Library',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 1,
  'id': 'Central Main Library Level 1',
  'roomName': 'Level 1'},
 {'building': 'Main Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Main Library Level 2',
  'roomName': 'Level 2'},
 {'building': 'Main Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Main Library Level 3',
  'roomName': 'Level 3'},
 {'building': 'Main Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Central Main Library Level 4',
  'roomName': 'Level 4'},
 {'building': 'Business School',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 1,
  'id': 'Business School Business School - HUB RC',
  'roomName': 'Hub'},
 {'building': 'Business School',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 1,
  'id': 'Business School Business School - MBA Suite',
  'roomName': 'MBA Suite'},
 {'building': 'Business School',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Business School Business School - PG Labs',
  'roomName': 'PG Labs'},
 {'building': 'Business School',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Business School Business School - Synd Rooms',
  'roomName': 'Synd Rooms'},
 {'building': 'Business School',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 1,
  'id': 'Business School Business School - Teach Lab',
  'roomName': 'Teach Lab'},
 {'building': 'Business School',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Business School Business School - UG Lab',
  'roomName': 'UG Lab'},
 {'building': 'High School Yards',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Holyrood and High School Yards High School Yards Lab',
  'roomName': 'HSY Labs'},
 {'building': 'Moray House Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Holyrood and High School Yards Moray House Library Ground Floor',
  'roomName': 'Ground Floor'},
 {'building': 'Moray House Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Holyrood and High School Yards Moray House Library Level 1',
  'roomName': 'Level 1'},
 {'building': 'Holland House',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'Accommodation Services Holland House - MicroLab',
  'roomName': 'MicroLab'},
 {'building': 'Holland House',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 1,
  'id': 'Accommodation Services Holland House - Study Pods',
  'roomName': 'Study Pods'},
 {'building': 'KB Centre Library',
  'hasGroupSpace': 1,
  'hasPrinter': 0,
  'hasWhiteboard': 1,
  'id': 'KB Labs KB Centre Level 1',
  'roomName': 'Level 1'},
 {'building': 'KB Centre Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs KB Centre Level 2 - Main',
  'roomName': 'Level 2 Main'},
 {'building': 'KB Centre Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs KB Centre Level 2 - Side 16 Seat',
  'roomName': 'Level 2 Wee Side'},
 {'building': 'KB Centre Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs KB Centre Level 2 - Side 25 Seat',
  'roomName': 'Level 2 Big Side'},
 {'building': 'KB Centre Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs KB Centre Level 3',
  'roomName': 'Level 3'},
 {'building': 'Murray Library',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs Murray Library Ground - Cafe',
  'roomName': 'Cafe Labs'},
 {'building': 'Murray Library',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs Murray Library Level 1',
  'roomName': 'Level 1'},
 {'building': 'Murray Library',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs Murray Library Level 1 - Quick Use',
  'roomName': 'Quick use labs'},
 {'building': 'Murray Library',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs Murray Library Level 2',
  'roomName': 'Level 2'},
 {'building': 'JCMB',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs JCMB - Cafe',
  'roomName': 'Cafe labs'},
 {'building': 'JCMB',
  'hasGroupSpace': 0,
  'hasPrinter': 1,
  'hasWhiteboard': 0,
  'id': 'KB Labs JCMB L and T Cluster',
  'roomName': 'Room 3210'},
 {'building': 'JCMB',
  'hasGroupSpace': 1,
  'hasPrinter': 1,
  'hasWhiteboard': 1,
  'id': 'KB Labs Darwin L and T Cluster',
  'roomName': 'L&T Cluster'}]



def getTree():
    """
    make api call to myed for xml on PC availability
    :return: tree
    """
    r = requests.get(url='http://labmonitor.ucs.ed.ac.uk/myed/index.cfm?fuseaction=xml')

    xmltree = ElementTree.fromstring(r.content)

    return xmltree


def listOfDic(tree):
    """
    takes a ElementTree and returns a list of dict of ratio and location
    :param tree:
    :return list of dict {ratio with 3 digits, location}:
    """

    # rooms is a list of dicts, each dict describes one room
    # dict entries are the same as the XML `room' element attributes:
    # free, seats, location, rid, group, closuremsg, info
    # 
    # root.findall("room") method returns a list of all root's children
    # whose tag is "room" -- which is precisely what we what

    s = []
    for child in tree:
        if 'location' in child.keys():

            dict = {
                'group': child.attrib['group'],
                'location': child.attrib['location'],
                'ratio': round( float(child.attrib['free']) / float(child.attrib['seats']), 3),
                'freeComp': child.attrib['free'],
                'capacityComp': child.attrib['seats']
             }

            for b in buildings:
                if b['name'] in dict['location']:
                    dict['coordinates'] = b['coordinates']
                    dict['opening hours'] = b['opening hours']
                    break

            for f in featuresBuilding:
                if f['id'] in dict['location']:
                    dict['building'] = f['building']
                    dict['hasPrinter'] = f['hasPrinter']
                    dict['hasGroupSpace'] = f['hasGroupSpace']
                    dict['hasWhiteboard'] = f['hasWhiteboard']
                    dict['roomName'] = f['roomName']
            s.append(dict)

    return s




def euclideanDistance(user, room):
    """
    return room with distance attribute with respect to user.
    :param room (dictionary of room attributes):
    :return: the euclidean distance as an attributes in the
    """
    if 'coordinates' in room.keys():
        distance = math.sqrt(((user.la - room['coordinates'][0])**2) + ((user.lo - room['coordinates'][1])**2))
        room['distance'] = distance
    else:
        room['distance'] = 999999999
    return room


def ratingDistQSort(user, list):
    ans = []
    for x in list:
        ans.append(euclideanDistance(user, x))

    ans = sorted(ans, key=lambda k: k['distance'])
    return ans


def ratingQSort(list):
    """
    :param listOfDic:
    :return: sorted list according to ratio.
    """
    less = []
    pivotList = []
    more = []

    if len(list) <= 1:
        return list
    else:
        pivot = list[0]['ratio']
        for i in list:
            if i['ratio'] > pivot:
                less.append(i)
            elif i['ratio'] < pivot:
                more.append(i)
            else:
                pivotList.append(i)
        less = ratingQSort(less)
        more = ratingQSort(more)
        return less + pivotList + more






def groupSearch(list, group='Central'):
    """
    :param: ordered list,
    :return: ordered list of dictionaries
    """
    ans = []
    for y in list:
        if y['group'] == group:
            ans.append(y)
    return ans




def closestPlace(user):
    """
    returns an ordered list of the closest places to user.
    :param user:
    :return: list of close places
    """
    list = listOfDic(getTree())
    orderedList = ratingDistQSort(user, list)
    return orderedList
    
def quietPlace():
    """
    returns an ordered list of the most quiet places based on PC ratio.
    :param :
    :return: ordered list dictionaries
    """
    list = listOfDic(getTree())
    orderedList = ratingQSort(list)
    return orderedList


def quietPlaceList(list):
    """
    given a list of dictionaries, function returns ordered list of dictionaries w.r.t. ratio
    :param ordered list:
    :return: ordered list
    """
    ordList = ratingQSort(list)
    return ordList

    # not done yet!



def stillOpen(list):
    """
    given a list of places, returns locations that are open now.
    :param list:
    :return: list
    """
    c = time
    l = []
    for x in list:
        if x['opening hours'] == '24hr swipe card':
            l.append(x)
        else:

            print x['opening hours'][10:-5]
            closeTime = int(x['opening hours'][10:-5])

            print 'open time', (x['opening hours'][:2])
            openTime = int(x['opening hours'][:2])


            print 'opening house[15:]', x['opening hours'][15:]
            if x['opening hours'][15:] == 'PM':
                closeTime += 12


            print 'opening house[5:7]', x['opening hours'][5:7]
            if x['opening hours'][5:7] == 'PM':
                openTime += 12

            print 'closeTime:', closeTime
            print 'openTime', openTime

            print 'c.asctime()', c.asctime()[11:13]
            if int(c.asctime()[11:13]) > openTime and int(c.asctime()[11:13]) < closeTime:
                l.append(x)

    return l




def returnBestPlaces(quiet, close, user):
    if quiet == 1 and close == 0:
        bestPlaces = apicalls.quietPlace()
    elif quiet==1 and close==1:
        tenClosest = closestPlace(user)[0:10]
        bestPlaces = quietPlaceList(tenClosest)
    else:
        bestPlaces = closestPlace(user)

    return bestPlaces
    
    
def libraryPercentageUsage():
  l = listOfDic(getTree())
  d = {}
  for i in l:
    if i["location"] == "Central Main Library Level 1":
      d['1'] = (1 - i['ratio'])*100
    if i['location'] == "Central Main Library Level 2":
      d['2'] = (1 - i['ratio'])*100
    if i['location'] == "Central Main Library Level 3":
      d['3'] = (1 - i['ratio'])*100
    if i['location'] == "Central Main Library Level 4":
      d['4'] = (1 - i['ratio'])*100
    if i['location'] == "Central Main Library Ground":
      d['g'] = (1 - i['ratio'])*100
      d['g_pcnum'] = float(i['capacityComp'])
    if i['location'] == "Central Main Library Ground - Quick Use":
      d['gq'] = (1 - i['ratio'])*100
      d['gq_pcnum'] = float(i['capacityComp'])
    if i['location'] == 'Central Main Library - Cafe':
      d['gc']= (1-i['ratio'])*100
      d['gc_pcnum'] = float(i['capacityComp'])
 # print type(d['g_pcnum'])
  ground_weighted_avg = (d['g']*d['g_pcnum']+d['gq']*d['gq_pcnum']+d['gc']*d['gc_pcnum'] )/(d['g_pcnum']+d['gc_pcnum']+d['gq_pcnum'])
  r = {
    '1':d['1'],
    '2':d['2'],
    '3':d['3'],
    '4':d['4'],
    'g':ground_weighted_avg
  };
  return r



# test calls:

#
# user = User_data(55.946103, -3.18656)
#
#
#
#xmltree = getTree()

#list = listOfDic(xmltree)
#print 'list of dictionaries: \n', list
#
# distanceList = ratingDistQSort(user, list)
#
# print 'ordered list w.r.t. distance \n', distanceList
#
#orderedList = ratingQSort(list)
#print 'ordered list: \n', orderedList
#
# # return ordered list of places in central.
# central= groupSearch(orderedList)
# print 'list of dictionaries in Central:\n', central
#
# print 'closestPlace(): ', closestPlace(user)


#
#
#

