var express = require('express');
var bodyParser = require('body-parser');

var dongleHotelRouter = require('./rizoutes/dongleHotel_router.js');

var app = express();
var port = process.env.PORT || 5050;

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/hotel', dongleHotelRouter);

app.listen(port, function() {
  console.log('thx for listening on channel', port);
});
