const Discord = require('discord.js');
const client = new Discord.Client();
const config = {
  prefix: '!',
  searchUrl: 'https://bddatabase.net/ac.php?l=us&term='
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === 'ping') {
    msg.reply('pong');
  } else if (command === 'bdo' && args.length > 0) {
    let type = args[0];
    if (args[0] === "search" || args[0] === "s") {
      if (args.length < 2) {
        msg.reply("Missing item name argument.")
      } else {
        let request = new XMLHTTPRequest();
        request.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            if (response["Status"] === "Success") {
              msg.reply(JSON.stringify(response, null, 2));
            } else {
              msg.reply(this.responseText);
            }
          }
        }
        request.open("GET", config.searchUrl + args[1]);
        request.send();
      }
    }
  }
});

client.login(process.env.TOKEN)