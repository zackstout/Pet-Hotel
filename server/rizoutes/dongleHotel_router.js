
//dependencies:
var express = require('express');
var dongleRouter = express.Router();
var pg = require('pg');
var moment = require('moment');


var config = {
  database: 'deneb',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};
var pool = new pg.Pool(config);

//get route for owners:
dongleRouter.get('/owners', function(req, res) {
  pool.connect(function(err, db, done) {
    if(err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      //we connected to DB
      var queryText = 'SELECT * FROM "hotel_owners";';
      db.query(queryText, [], function(err, result){
        done();
        if(err) {
          console.log('Error making query', err);
          res.sendStatus(500);
        } else {
          // console.log(result.rows);
          res.send(result.rows);
          console.log(result.rows);
        }
      });
    }
  });
}); //END GET ROUTE

//get route for pets (added ordering):
//had to alter the select query to avoid overwriting pet's id:
dongleRouter.get('/pets', function(req, res) {
  pool.connect(function(err, db, done) {
    if(err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      //we connected to DB
      // var queryText = 'SELECT * FROM "hotel_pets" JOIN "hotel_owners" ON "hotel_pets"."owner_id" = "hotel_owners"."id" ORDER BY "hotel_pets"."id";';
      var queryText = 'SELECT "hotel_pets"."id" as id, "hotel_owners"."id" as owner_id, "name", "breed", "color", "checked_in", "first_name", "last_name" FROM "hotel_pets" JOIN "hotel_owners" ON "hotel_pets"."owner_id" = "hotel_owners"."id" ORDER BY "hotel_pets"."id";';
      db.query(queryText, [], function(err, result){
        done();
        if(err) {
          console.log('Error making query', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
          console.log(result.rows);
        }
      });
    }
  });
}); //END GET ROUTE

//post route for owners:
dongleRouter.post('/owners', function(req, res){
  var owner = req.body;
  console.log(owner);
  pool.connect(function (err, db, done) {
    if (err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "hotel_owners" ("first_name", "last_name") VALUES ($1, $2);';
      db.query(queryText, [owner.first_name, owner.last_name], function (err, result) {
        done(); // pool +1
        if (err) {
          console.log('Error making query', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
}); //END POST ROUTE

//post route for pets:
dongleRouter.post('/pets', function(req, res){
  var pet = req.body;
  console.log("pet lookin like", pet);
  pool.connect(function (err, db, done) {
    if (err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "hotel_pets" ("owner_id", "name", "breed", "color", "checked_in") VALUES ($1, $2, $3, $4, $5);';
      db.query(queryText, [pet.ownerIdIn, pet.petNameIn, pet.petBreedIn, pet.petColorIn, false], function (err, result) {
        done(); // pool +1
        if (err) {
          console.log('Error making query', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
}); //END POST ROUTE

//delete button:
dongleRouter.delete('/:id', function(req, res){
  var petId = req.params.id;
  console.log(petId);
  // res.sendStatus(200);
  pool.connect(function (errorConnectingToDb, db, done) {
    if (errorConnectingToDb) {
      console.log('Error connecting', errorConnectingToDb);
      res.sendStatus(500);
    } else {
      // We connected to the db!!!!! pool -1
      var queryText = 'DELETE FROM "pets" WHERE "id"=$1;';
      db.query(queryText, [petId], function (errorMakingQuery, result) {
        // We have received an error or result at this point
        done(); // pool +1
        if (errorMakingQuery) {
          console.log('Error making query', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      }); // END QUERY
    }
  }); // END POOL
}); //END DELETE ROUTE

//update button:
dongleRouter.put('/:id', function(req,res){
  var editId = req.params.id;
  console.log(editId);
  //res.sendStatus(200);
  pool.connect(function (errorConnectingToDb, db, done) {
    if (errorConnectingToDb) {
      console.log('Error connecting', errorConnectingToDb);
      res.sendStatus(500);
    } else {
      // We connected to the db!!!!! pool -1
      var queryText = 'UPDATE "hotel_pets" SET "name" = $1, "breed" = $2, "color" = $3 WHERE "id" = $4;';
      db.query(queryText, [req.body.petNameIn, req.body.petBreedIn, req.body.petColorIn, editId], function (errorMakingQuery, result) {
        // We have received an error or result at this point
        done(); // pool +1
        if (errorMakingQuery) {
          console.log('Error making query', errorMakingQuery);
          res.sendStatus(500);
        } else {
          // Send back success!
          res.sendStatus(201);
        }
      }); // END QUERY
    }
  }); // END POOL
}); //END PUT ROUTE

//checkIn button post route:
dongleRouter.post('/visits', function(req,res){
  var thisPet = req.body;
  pool.connect(function (errorConnectingToDb, db, done) {
    if (errorConnectingToDb) {
      console.log('Error connecting', errorConnectingToDb);
      res.sendStatus(500);
    } else {
      var today = moment().add(0, 'days').format('L');
      var queryText = 'INSERT INTO "hotel_visits" ("pet_id", "check-in") VALUES ($1, $2)';
      db.query(queryText, [thisPet.id, today], function (errorMakingQuery, result) {
        // We have received an error or result at this point
        done(); // pool +1
        if (errorMakingQuery) {
          console.log('Error making query', errorMakingQuery);
          res.sendStatus(500);
        } else {
          // Send back success!
          res.sendStatus(201);
        }
      }); // END QUERY
    }
  }); // END POOL
}); //END POST ROUTE

//checkIn button put route:
//problem: somehow violating foreign key constraint in visits table...
dongleRouter.put('/pets/:id', function(req,res){
  var petId = req.params.id;
  // console.log(petId);
  var pet = req.body;
  console.log(pet);
  //res.sendStatus(200);
  pool.connect(function (err, db, done) {
    if (err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      // We connected to the db!!!!! pool -1
      var boolean = false;
      if (pet.checked_in) {
        boolean = true;
      }
      var queryText = 'UPDATE "hotel_pets" SET "checked_in" = $1 WHERE "id" = $2';
      db.query(queryText, [boolean, petId], function (err, result) {
        // We have received an error or result at this point
        done(); // pool +1
        if (err) {
          console.log('Error making query', err);
          res.sendStatus(500);
        } else {
          // Send back success!
          res.sendStatus(201);
        }
      }); // END QUERY
    }
  }); // END POOL
}); //END PUT ROUTE

module.exports = dongleRouter;
