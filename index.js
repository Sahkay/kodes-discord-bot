var express = require('express')
var app = express()
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login("NDkyODU0Mzk0OTI5MjgzMDcy.DoceAg.t6N7FHeP1EBy3_sDHMEyCk3x5Vw")

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})