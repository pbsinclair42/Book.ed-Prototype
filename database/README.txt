Just a couple of short notes on my work on databases.

1. all my work is in the database folder

2. if you look at schema.sql, you'll see I've created three tables: Building, ComputerLab, Record

3. I've already createed an empty database >> booked.db

4. in booked.py, there is
(a) some initiation flask code
(b) under the header "make database", code which manipulates the database

4. the code for manipulating the database consists of three main functions: make_buildings, make_labs, record_current_usage, and a few helper functions

5. make_buildings and make_labs are intended to be called only once; information about buildings and labs is static after all

6. on the contrary, record_current_usage is intended to be called every x mins; every calls adds new entries to the Record table

7. on running python booked.py, the script should connect to the database and call the three functions

8. while connection to the database succeeds, adding datato the tables fails; the error is

sqlite3.IntegrityError: UNIQUE constraint failed: Building.name

9. so apparently (and hopefully) Python code is working up to this point, but there is a problem with SQL

10. Building.name is the primary key, and as such it should indeed be unique

11. but the names of the buidings are unique! plz check buildings and building_names variables

12. I have a few hypotheses as to why we get the error
(a) there is indeed a duplicate name in the list of buildings, but I'm quite sure there is none!
(b) the primary key in the Building table is a textual field name -- maybe that's the cause of the error? maybe we should switch to an integer id? but why should text be a bad identifier?
(c) finally, and perhaps most likely, the cause of the error might be our ignorance of flask. I use db.execute and db.commit methods to try to update the database -- maybe I use them in the wrong way?

13. to sum up, I'll be very very grateful if you help me find the bug -- this will probably require a good deal of reading about flask and sql