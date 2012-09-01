var qs = require('querystring');

var parsers = {
  'application/x-www-form-urlencoded': qs.parse,
  'application/json': JSON.parse
};

function mime(req) {
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
}

function parse(req, body) {

  var parser = parsers[mime(req)];

  if (parser) {

    body = parser(body);
    return body;
  }
}


function MethodOverride(){
  return function methodOverride(req, res) {
    if (req.method === 'POST') {

      var body = '';
      req.setEncoding('utf8');

      req.on('data', function(d) {
        body += d;
      });

      req.on('end', function() {
        body = parse(req, body);

        if (body._method) {
          req.method = body._method;
        }
      });

    }
    res.emit('next');
  };
}

module.exports = MethodOverride;