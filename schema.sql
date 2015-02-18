drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  location text not null,
  ratio real,
  groups text not null,
  freeComp integer,
  capacityComp integer
);