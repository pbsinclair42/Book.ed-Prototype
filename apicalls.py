__author__ = 'hanschristus'

import requests
from xml.etree import ElementTree


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
  'name': 'High School Yards Labs',
  'opening hours': '24hr swipe card'},
 {'coordinates': (55.938631, -3.169601),
  'name': 'Holland House',
  'opening hours': '24hr swipe card'},
 {'coordinates': (55.944376, -3.189648),
  'name': 'Hugh Robson',
  'opening hours': '24hr swipe card'},
 {'coordinates': (55.921658, -3.174223),
  'name': 'JCMB',
  'opening hours': '08.00AM - 21.00PM'},
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
  'opening hours': '??'}]


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
    root = tree.getroot()
    rooms = [room.attrib for room in root.findall("room")]

    # compute free seats percentage and add coordinates
    for room in rooms:
        ratio = float(room["free"]) / room["seats"]
        room["ratio"] = round(r, 2)

        for b in buildings:
            if b['name'] in room["location"]:
                room["coordinates"] = b['coordinates']
                room['opening hours'] = b['opening hours']
                break

    return rooms

    ## old code
    # 
    # s = []
    # for child in tree:
    #     if 'location' in child.keys():

    #         dict = {
    #         'group': child.attrib['group'],
    #         'location': child.attrib['location'],
    #         'ratio': round( float(child.attrib['free']) / float(child.attrib['seats']), 3),
    #         'freeComp': child.attrib['free'],
    #         'capacityComp': child.attrib['seats']
    #         }
    #         if 'Holland House' in dict['location']:
    #             dict['geo'] = #insert longitude and latitude

    #         s.append(dict)
    # return s


# """ capacity, opening times, address, stuff like board piano. """


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



# test calls:


xmltree = getTree()

list = listOfDic(xmltree)
print 'list of dictionaries: \n', list

orderedList = ratingQSort(list)
print 'ordered list: \n', orderedList

# return ordered list of places in central.
central= groupSearch(orderedList)
print 'list of dictionaries in Central:\n', central




