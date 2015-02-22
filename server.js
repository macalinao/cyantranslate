var express = require('express');
var request = require('superagent');
var parseString = require('xml2js').parseString;
var translate = require('yandex-translate');

var app = express();

app.get('/book', function(req, res) {
  request.get('http://api.harpercollins.com/api/v3/hcapim').query({
    apiname: 'catalog',
    format: 'JSON',
    title: req.query.title,
    apikey: process.env.HC_KEY
  }).end(function(err, data) {
    var isbn = data.body.Product_Group[0].Products[0].ISBN;
    request.get('http://api.harpercollins.com/api/v3/hcapim').query({
      apiname: 'ProductInfo',
      format: 'XML',
      isbn: isbn,
      apikey: process.env.HC_KEY
    }).end(function(e, d2) {
      parseString(d2.text, {
        explicitArray: false
      }, function(e2, rs) {
        res.json(rs.OpenBook_API.Product_Detail);
      });
    });
  });
});

app.get('/translate', function(req, res) {
  translate.detect(req.query.text, {
    key: process.env.YANDEX_KEY
  }, function(err, r) {
    translate(req.query.text, {
      from: req.query.from || r.lang || 'es',
      to: req.query.to || 'en',
      key: process.env.YANDEX_KEY
    }, function(err, t) {
      res.json({
        result: (t.text || [])[0]
      });
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
