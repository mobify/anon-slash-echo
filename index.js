var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var PORT = 3000;
var VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send('hello world');
});

var sendDelayedResponse = function(responseUrl, message) {
    var options = {
        uri: responseUrl,
        method: 'POST',
        json: message
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('Anon message sent!');
        }
    });
};

app.post('/anon', function(req, res) {
    // Un-verified request
    if (req.body.token !== VERIFY_TOKEN) {
        console.log('Cannot verify request');
        return;
    }

    var message = {
        response_type: 'in_channel',
        text: req.body.text
    };

    // This message is only visible to user who sent it
    res.send('Heard you loud and clear boss 👍');

    sendDelayedResponse(req.body.response_url, message);
});

app.listen(PORT, function () {
    console.log('Magic happens on port ' + PORT);
});
