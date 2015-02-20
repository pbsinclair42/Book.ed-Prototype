create table Lab (
	gr text,
	location text,
	latitude real,
	longtitude real,
	openinghours text,
	primary key (location)
);
create table Record (
	time text,
	location text,
	freeComp int,
	capacityComp int,
	ratio real,
	primary key (time,location)
	foreign key (location) references Lab(location)
);
