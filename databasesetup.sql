
CREATE TABLE "hotel_owners" (
"id" serial PRIMARY KEY,
"first_name" varchar(60) NOT NULL,
"last_name" varchar(60) NOT NULL
);

INSERT INTO "hotel_owners" ("first_name", "last_name")
VALUES ('Michael', 'Vick');

CREATE TABLE "hotel_pets" (
"id" serial PRIMARY KEY,
"owner_id" INT REFERENCES "hotel_owners",
"name" varchar(40),
"breed" varchar(40),
"color" varchar(40),
"checked_in" BOOLEAN
);

INSERT INTO "hotel_pets" ("owner_id", "name", "breed", "color")
VALUES (1, 'Chuckles', 'pug', 'tan');

CREATE TABLE "hotel_visits" (
"id" serial PRIMARY KEY,
"pet_id" INT REFERENCES "hotel_pets",
"check-in" date,
"check-out" date
);
INSERT INTO "hotel_visits" ("check-in", "check-out")
VALUES ('1-2-2016', '1-5-2017');
