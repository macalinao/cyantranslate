var express = require('express');
var translate = require('yandex-translate');

var app = express();

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
