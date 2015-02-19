-- create table Building (
-- 	name text not null,
-- 	id text primary key,
-- 	group text,
-- 	latitude real not null,
-- 	longtitude real not null,
-- 	openingHours text
-- );

create table Building (
	name text not null,
	group_ text,
	latitude real not null,
	longtitude real not null,
	openingHours text,
	primary key (name)
);

create table ComputerLab (
	name text not null,
	id text primary key,
	seats integer not null,
	building text not null,
	facilities text,
	foreign key (building) references Building(name)
);

create table Record (
	time integer not null,
	labId text not null,
	free integer not null,
	primary key (time, labId),
	foreign key (labId) references ComputerLab(id)
);
