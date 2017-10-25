
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

dongleRouter.get('/week', function(req, res) {
  pool.connect(function(errorConnectingToDb, db, done) {
    if(errorConnectingToDb) {
      console.log('Error connecting', errorConnectingToDb);
      res.sendStatus(500);
    } else {
      //we connected to DB
      var queryText = 'SELECT * FROM "taskstodo" WHERE ("due" >= $1 AND "due" <= $2 AND "complete"=false);';
      db.query(queryText, [startOfWeek, endOfWeek], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Error making query', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
}); //END GET ROUTE

module.exports = dongleRouter;
