__author__ = 'hanschristus'

import requests
from xml.etree import ElementTree

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
            if 'Holland House' in dict['location']:
                dict['geo'] = #insert longitude and latitude



            s.append(dict)
    return s


""" capacity, opening times, address, stuff like board piano. """


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




