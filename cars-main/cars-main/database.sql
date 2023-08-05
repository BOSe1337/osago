create TABLE users(
  id SERIAL PRIMARY KEY,
  role INTEGER,
  token VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255) unique,
  hash_pwd VARCHAR(255)
);
create TABLE models(
  id SERIAL PRIMARY KEY,
  mark VARCHAR(255),
  model VARCHAR(255)
);
create TABLE carCats(
  value VARCHAR(10) PRIMARY KEY,
  catName VARCHAR(255)
);
create TABLE IDTypes(
  value varchar(10) PRIMARY KEY,
  label VARCHAR(10)
);
create TABLE persons(
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(30),
  secondName VARCHAR(35),
  lastName VARCHAR(30),
  birthDate DATE,
  passportSer VARCHAR(4),
  passportNum VARCHAR(6),
  passportDate DATE,
  address VARCHAR(255)
);
create table services(
  id SERIAL primary key,
  type VARCHAR(10)
);
create TABLE clients(
  id SERIAL PRIMARY KEY,
  strahovatel INTEGER,
  sobstvennik INTEGER,
  carCat varchar(10),
  number VARCHAR(13),
  model INTEGER,
  power INTEGER,
  idType varchar(10),
  idCode  VARCHAR(255),
  driverData VARCHAR(255)[],
  phone varchar(30),
  email varchar(30),
  service integer,
  price integer,
  date date,
  time varchar(30),
  callType varchar(20),
  msg varchar(255),
  FOREIGN KEY (strahovatel) REFERENCES persons (id),
  FOREIGN KEY (sobstvennik) REFERENCES persons (id),
  FOREIGN KEY (model) REFERENCES models (id),
  FOREIGN KEY (carCat) REFERENCES carCats (value),
  FOREIGN KEY (service) REFERENCES services (id),
  FOREIGN KEY (idType) REFERENCES idtypes (value),
);


create table docs(
  id SERIAL PRIMARY KEY,
  userId integer,
  path varchar(255),
  FOREIGN key (userid) REFERENCES users (id)
);
-- IMPORT CARS

copy models(mark,model) 
from 'C:\csv.csv' 
delimiter ';' 
csv header;

-- Все марки машин

select 
distinct on (mark)
mark
from models;

grant all privileges on all tables in schema public to cars;



create view adminTable 
as select 
clients.id,persons.firstname,persons.secondname,persons.lastname,persons.birthdate,persons.passportser,
persons.passportnum,persons.passportdate,persons.address,persons.aparts,strahovatels.firstname as Stfirstname,
strahovatels.secondname as Stsecondname,
strahovatels.lastname as Stlastname,strahovatels.birthdate as stbirthdate,
strahovatels.passportser as stpassportser,strahovatels.passportnum as stpassportnum,
strahovatels.passportdate as stpassportdate,strahovatels.address as staddress,strahovatels.aparts as staparts,carcats.*,
clients.number,models.mark,models.model,clients.power,clients.idcode,
clients.driverdata,clients.phone,clients.email,clients.price,services.type,idtypes.label as idtype,idtypes.value as idvalue,clients.time, clients.callType,clients.msg
from persons, persons as strahovatels, clients
left join services 
on services.id = clients.service
left join carcats
on carcats.value = clients.carCat
left join idtypes
on idtypes.value = clients.idtype
left join models
on models.id = clients.model
where persons.id=clients.sobstvennik
and strahovatels.id=clients.strahovatel;


create view exportData
as select
persons.firstname,persons.secondname,persons.lastname,clients.phone,
clients.email,services.type,to_char(clients.date::DATE, 'dd.mm.yyyy') as date
from persons,clients,services
where persons.id=clients.sobstvennik
and services.id = clients.service;

insert into carcats values ('V','В - автомобиль');
insert into carcats values ('A','A - мотоцикл');

insert into idtypes values ('vin','VIN');
insert into idtypes values ('body','Кузов');
insert into idtypes values ('shassi','Шасси');

insert into services(type) values ('Осаго');
insert into services(type) values ('Каско');
insert into services(type) values ('Техосмотр');
insert into services(type) values ('Консульт');
