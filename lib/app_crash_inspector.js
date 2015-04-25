var http = require("http");

var if_crashed = function(url, handle_crashed, handle_clean) {
  http.get(url, function(res) {
    var data = '';
    res.setEncoding('utf-8');
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      if(/Your app is crashing|Errors prevented startup/.test(data))
        handle_crashed();
      else
        handle_clean();
    });
  }).on('error', function(err) {
    console.log("Error occurred while connecting to ",url);
    console.log(err.message);
  });
};

module.exports.if_crashed = if_crashed;
