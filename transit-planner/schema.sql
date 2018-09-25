DROP DATABASE IF EXISTS transit_planner;

CREATE DATABASE transit_planner;

USE transit_planner;

CREATE TABLE stations (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  is_favorite boolean NOT NULL default 0,
  PRIMARY KEY (id)
);

CREATE TABLE stops (
  id int NOT NULL AUTO_INCREMENT,
  line_id int NOT NULL,
  station_id int NOT NULL,
  is_transfer boolean NOT NULL default 0,
  PRIMARY KEY (id)
);

-- til lines is a reserved word in mysql
CREATE TABLE service_lines (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  color char(6) NOT NULL,
  origin_id int NOT NULL,
  destination_id int NOT NULL,
  PRIMARY KEY (id)
);


/*  Execute this file from the command line by typing:
 *    mysql -u <USER> < schema.sql
 *    OR
 *    mysql -u <USER> -p < schema.sql
 *  For example, on a pairing station, it'll be 
 *    mysql -u student -p < schema.sql
 *  and then you'll have to enter the password, student
 *  On your personal computer, if you haven't set up
 *  a password, it'll be 
 *    mysql -u root < schema.sql
 *
 *  If you need assistance with this step,
 *  please talk to a proctor.
*/


-- stations
INSERT into stations (name) VALUES ("12th St/Oakland City Center");
INSERT into stations (name) VALUES ("16th St/Mission");
INSERT into stations (name) VALUES ("19th St/Oakland");
INSERT into stations (name) VALUES ("24th St/Mission");
INSERT into stations (name) VALUES ("Ashby");
INSERT into stations (name) VALUES ("Balboa Park");
INSERT into stations (name) VALUES ("Bay Fair");
INSERT into stations (name) VALUES ("Castro Valley");
INSERT into stations (name) VALUES ("Civic Center");
INSERT into stations (name) VALUES ("Coliseum");
INSERT into stations (name) VALUES ("Colma");
INSERT into stations (name) VALUES ("Concord");
INSERT into stations (name) VALUES ("Daly City");
INSERT into stations (name) VALUES ("Downtown Berkeley");
INSERT into stations (name) VALUES ("Dublin/Pleasanton");
INSERT into stations (name) VALUES ("El Cerrito del Norte");
INSERT into stations (name) VALUES ("El Cerrito Plaza");
INSERT into stations (name) VALUES ("Embarcadero");
INSERT into stations (name) VALUES ("Fremont");
INSERT into stations (name) VALUES ("Fruitvale");
INSERT into stations (name) VALUES ("Glen Park");
INSERT into stations (name) VALUES ("Hayward");
INSERT into stations (name) VALUES ("Lafayette");
INSERT into stations (name) VALUES ("Lake Merritt");
INSERT into stations (name) VALUES ("MacArthur");
INSERT into stations (name) VALUES ("Millbrae");
INSERT into stations (name) VALUES ("Montgomery St.");
INSERT into stations (name) VALUES ("North Berkeley");
INSERT into stations (name) VALUES ("North Concord/Martinez");
INSERT into stations (name) VALUES ("Orinda");
INSERT into stations (name) VALUES ("Pittsburg/Bay Point");
INSERT into stations (name) VALUES ("Pleasant Hill/Contra Costa Centre");
INSERT into stations (name) VALUES ("Powell St.");
INSERT into stations (name) VALUES ("Richmond");
INSERT into stations (name) VALUES ("Rockridge");
INSERT into stations (name) VALUES ("San Bruno");
INSERT into stations (name) VALUES ("San Francisco International Airport");
INSERT into stations (name) VALUES ("San Leandro");
INSERT into stations (name) VALUES ("South Hayward");
INSERT into stations (name) VALUES ("South San Francisco");
INSERT into stations (name) VALUES ("Union City");
INSERT into stations (name) VALUES ("Walnut Creek");
INSERT into stations (name) VALUES ("Warm Springs/South Fremont");
INSERT into stations (name) VALUES ("West Dublin/Pleasanton");
INSERT into stations (name) VALUES ("West Oakland");

-- service_lines
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Red: towards Richmond", "e11a57", 26, 34);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Red: towards Millbrae", "e11a57", 34, 26);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Yellow: towards Pittsburg/Bay Point", "fdf057", 26, 31);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Yellow: towards Millbrae", "fdf057", 31, 26);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Blue: towards Daly City", "2aabe2", 15, 13);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Blue: towards Dublin/Pleasanton", "2aabe2", 13, 15);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Green: towards Warm Springs", "4fb848", 13, 43);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Green: towards Daly City", "4fb848", 43, 13);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Orange: towards Richmond", "f9a11d", 43, 34);
INSERT into service_lines (name, color, origin_id, destination_id) VALUES ("Orange: towards Warm Springs", "f9a11d", 34, 43);

-- stops
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 26, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 37, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 36, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 40, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 11, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 1, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 3, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 25, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 5, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 14, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 28, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 17, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 16, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (1, 34, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 34, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 16, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 17, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 28, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 14, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 5, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 25, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 3, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 1, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 11, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 40, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 36, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 37, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (2, 26, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 26, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 37, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 36, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 40, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 11, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 1, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 3, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 25, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 35, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 30, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 25, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 42, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 32, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 12, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 29, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (3, 31, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 31, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 29, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 12, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 32, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 42, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 25, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 30, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 35, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 25, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 3, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 1, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 11, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 40, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 36, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 37, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (4, 26, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 15, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 44, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 8, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 7, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 38, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 10, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 20, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 24, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (5, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 24, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 20, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 10, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 38, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 7, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 8, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 44, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (6, 15, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 24, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 20, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 10, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 38, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 7, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 22, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 39, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 41, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 19, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (7, 43, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 43, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 19, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 41, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 39, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 22, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 7, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 38, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 10, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 20, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 24, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 45, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 18, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 27, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 33, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 9, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 2, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 4, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 21, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 6, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (8, 13, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 34, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 16, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 17, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 28, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 14, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 5, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 25, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 3, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 1, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 24, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 20, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 10, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 38, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 7, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 22, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 39, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 41, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 19, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (9, 43, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 43, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 19, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 41, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 39, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 22, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 7, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 38, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 10, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 20, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 24, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 1, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 3, 1);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 25, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 5, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 14, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 28, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 17, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 16, 0);
INSERT into stops (line_id, station_id, is_transfer) VALUES (10, 34, 0);

