require('babel/register');
var http = require('http');

try {
  var fs = require('fs');
  var pathToken = process.env.SLACK_POKER_BOT_TOKEN;
  var token = pathToken || fs.readFileSync('token.txt', 'utf8').trim();
  var herokuTimeout = process.env.GLOBAL_TIMEOUT;
  var globalTimeout = herokuTimeout || fs.exists('timeout.txt', function (exists) {
        if (exists){
          return fs.readFileSync('timeout.txt', 'utf8').trim();
        }
      });
} catch (error) {
  console.log("Your API token should be placed in a 'token.txt' file, which is missing.");
  return;
}

var Bot = require('./bot');
var bot = new Bot(token, globalTimeout);
bot.login();

// Heroku requires the process to bind to this port within 60 seconds or it is killed 
http.createServer(function(req, res) {
  res.end('SLACK_POKER_BOT');
}).listen(process.env.PORT || 5000)
