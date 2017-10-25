
//dependencies:
var express = require('express');
var dongleRouter = express.Router();
var pg = require('pg');

var config = {
  database: 'deneb',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};
var pool = new pg.Pool(config);

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
          console.log(result.rows);
          res.send(result.rows);
        }
      });
    }
  });
}); //END GET ROUTE

dongleRouter.get('/pets', function(req, res) {
  pool.connect(function(err, db, done) {
    if(err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      //we connected to DB
      var queryText = 'SELECT * FROM "hotel_pets" JOIN "hotel_owners" ON "hotel_pets"."owner_id" = "hotel_owners"."id";';
      db.query(queryText, [], function(err, result){
        done();
        if(err) {
          console.log('Error making query', err);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
}); //END GET ROUTE

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

dongleRouter.post('/pets', function(req, res){
  var pet = req.body;
  console.log("pet lookin like", pet);
  pool.connect(function (err, db, done) {
    if (err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "hotel_pets" ("name", "breed", "color", "checked_in") VALUES ($1, $2, $3, $4);';
      db.query(queryText, [pet.petNameIn, pet.petBreedIn, pet.petColorIn, false], function (err, result) {
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

//EXTRA BUTTONS ROUTES:
dongleRouter.delete('/:id', function(req, res){
  var petId = req.params.id;
  console.log(taskId);
  // res.sendStatus(200);
  pool.connect(function (errorConnectingToDb, db, done) {
    if (errorConnectingToDb) {
      console.log('Error connecting', errorConnectingToDb);
      res.sendStatus(500);
    } else {
      // We connected to the db!!!!! pool -1
      var queryText = 'DELETE FROM "taskstodo" WHERE "id"=$1;';
      db.query(queryText, [taskId], function (errorMakingQuery, result) {
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

dongleRouter.put('/:id', function(req,res){
  var taskId = req.params.id;
  console.log(taskId);
  //res.sendStatus(200);
  pool.connect(function (errorConnectingToDb, db, done) {
    if (errorConnectingToDb) {
      console.log('Error connecting', errorConnectingToDb);
      res.sendStatus(500);
    } else {
      // We connected to the db!!!!! pool -1
      var queryText = 'UPDATE "taskstodo" SET "complete" = true WHERE "id" = $1;';
      db.query(queryText, [taskId], function (errorMakingQuery, result) {
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

module.exports = dongleRouter;
