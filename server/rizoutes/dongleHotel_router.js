
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

dongleRouter.get('/', function(req, res) {
  pool.connect(function(err, db, done) {
    if(err) {
      console.log('Error connecting', err);
      res.sendStatus(500);
    } else {
      //we connected to DB
      var queryText = 'SELECT * FROM "taskstodo" WHERE ("due" >= $1 AND "due" <= $2 AND "complete"=false);';
      db.query(queryText, [startOfWeek, endOfWeek], function(err, result){
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

module.exports = dongleRouter;
