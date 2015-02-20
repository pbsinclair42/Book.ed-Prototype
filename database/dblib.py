import sqlite3
import apicalls
import datetime
import sched, time
datetimeformatstr = "%Y-%m-%d %H:%M:%S"
###
### for anything having to do with the database to work format the time like
### a string with the following format:
### <year>-<month>-<day> <hour>:<minute>:<second>
###
def dicttolabtuple(d):
	'''
		converts our dicts into the tuples for inserting data in the lab table
	'''
	t = (d['group'],d['location'],d['coordinates'][0] if 'coordinates' in d.keys() else 0.0 ,d['coordinates'][1] if 'coordinates' in d.keys() else 0.0, d['opening hours'] if 'opening hours' in d.keys() else '-')
	return t

def dicttorecordtuple(d):
	'''
	converts our dict into the tupples for insetring data in the records table
	'''
	t = (d['location'],d['freeComp'],d['capacityComp'],d['ratio'])
	return t
def update_labs():
	'''
		populates the lab table
	'''
	dbconnect = sqlite3.connect('records.db')
	curr = dbconnect.cursor()    #for some reason all the sql commands have to use this cursor thing
	listofdics = apicalls.listOfDic(apicalls.getTree()) #reads our data
	listoftuples = []
	for i in listofdics:
		listoftuples.append(dicttolabtuple(i)) #converts it into list of tuples (cuz tuples is what the func execute uses)
	listoftuples = list(set(listoftuples))   #removes duplicates by converting to set and back again to list (set is a data structure without duplicates)
	for t in listoftuples:
		curr.execute("INSERT INTO Lab VALUES (?,?,?,?,?)",t) #making our commands
	dbconnect.commit()	#with commit they seem to actually get executed
	dbconnect.close()

def update_records():
	dbconnect = sqlite3.connect('records.db')
	curr = dbconnect.cursor()
	listofdics = apicalls.listOfDic(apicalls.getTree())
	time = datetime.datetime(2000,1,1).now().strftime(datetimeformatstr) #saves the current time as formatted string (and is a bit of a mess because python's datetime library is a bit of a mess)
	listoftuples = []
	for i in listofdics:
		listoftuples.append( (time,) + dicttorecordtuple(i)) #adds the current time as tuple merged with the stuff from the dict as tuple
	for t in listoftuples:
		curr.execute("INSERT INTO Record VALUES (?,?,?,?,?)",t)
	dbconnect.commit()
	dbconnect.close()

def scheduled_update(s):
	update_records();
	s.enter(60*15,1,scheduled_update,(s,))
def scheduled_updates():
	s = sched.scheduler(time.time,time.sleep)
	t = datetime.datetime(2000,1,1).now()
	if t.minute < 10:
		t = t.replace(minute = 10)
	elif t.minute < 25:
		t = t.replace(minute = 25)
	elif t.minute < 40:
		t = t.replace(minute = 40)
	elif t.minute < 55:
		t = t.replace(minute = 55)
	else:
		t += datetime.timedelta(hours = 1)
		t = t.replace(minute = 0)
	t = t.replace(second = 0)
	t = t.replace(microsecond = 0)
	timediff = time.mktime(t.timetuple()) - time.mktime(t.now().timetuple())
	s.enter(timediff,1,scheduled_update,(s,))
	s.run()
def ratiosbylocandtime(loc,time):
	"""
		returns the list of all ratios at a given time of the day
		time must be string "<hours>:<minute>"
	"""
	dbconnect = sqlite3.connect("records.db")
	curr = dbconnect.cursor()
	curr.execute("SELECT ratio FROM Record WHERE time LIKE ? AND location LIKE ?",("% "+time+':%',loc))
	t = curr.fetchall() #returns the results of the query as list of tuples
	l = []
	for i in t:
		l.append(i[0])#untuple the list of tuples
	dbconnect.close()
	return l
def avgratiobylocandtime(loc,time):
	l = ratiosbylocandtime(loc,time)
	if len(l) == 0:
		return 0.0
	return sum(l)/float(len())

def ratiobytimeanddate(loc, datetime):
	dbconnect = sqlite3.connect("records.db")
	curr = dbconnect.cursor()
	curr.execute("SELECT ratio FROM Record WHERE time LIKE ? AND location LIKE ?",(datetime,loc))
	t = curr.fetchall()
	if t != []:
		i = t[0][0]
	else:
		i = 0.0
	return i

def datejstodate(datejs):
	day = datejs[:2]
	month = datejs[3:5]
	year = datejs[6:]
	return year + '-' + month + '-' + day

def dictfordate(loc, datejs):
	date = datejstodate(datejs)
	d = []
	for i in range(0,23):
		for j in [10,25,40,55]:
			d.append({
				'time': str(i)+':'+str(j)
				'ratio':ratiobytimeanddate(loc, date + ' ' +str(i).zfill(2) + ':' + str(j) + ':%')
				})
	return d

def dictforavgs(loc):
	d = []
	for i in range(0,23):
		for j in [10,25,40,55]:
			d.append({
				'time':str(i)+':'str(j)
				'ratio':avgratiobylocandtime(loc,str(i).zfill(2)+':'+str(j))
				})


#update_labs()              #call this at the start of the app
#scheduled_updates()			#updatedb.py takes care of this
