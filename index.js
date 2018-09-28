const request = require('request');
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
  if (msg.author.bot) return;
  if (msg.content.indexOf(config.prefix) !== 0) return;
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
        request(config.searchUrl + args[1], {
          json: true
        }, (err, res, body) => {
          if (err) {
            msg.reply(err);
          } else {
            msg.reply(body);
          }
        })
      }
    }
  }
});

client.login(process.env.TOKEN)