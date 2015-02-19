import apicalls
def cmpbylocation(user):
	def euclidian_distance(x , y):
		return ((x[0]-y[0])**2 +(x[1]-y[1])**2)**(0.5)
	def closer(x,y):
		if not 'coordinates' in x.keys():
			return 1
		elif not 'coordinates' in y.keys():
			return -1
		return int(euclidian_distance(user,x['coordinates'])-euclidian_distance(user,y['coordinates']))
	return closer

def cmpbyrank(user):
	def rankcmp(x,y):
		return int(float(x['rank'])<float('y.rank'))
	return rankcmp

def  sorter(locs,user, comparfunc):
	l=locs
	l=sorted(locs,cmp=comparfunc(user));
	return l

def sortByRank(locs,user):
	return sorter(locs,user,cmpbyrank)
def sortByLocation(locs,user):
	return sorter(locs,user,cmpbylocation)
#ld = apicalls.listOfDic(apicalls.getTree())
#print type(cmpbylocation((0.0,0.0)))
#ld = sorter(ld,(0.0,0.0),cmpbylocation)
#def euclidian_distance(x , y):
#		return ((x[0]-y[0])**2 +(x[1]-y[1])**2)**(0.5)
#for i in ld:
#	print i
#	if 'coordinates' in i:
#		print euclidian_distance((0.0,0.0),i['coordinates'])
