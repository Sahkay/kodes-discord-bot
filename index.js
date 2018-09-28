const axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = {
  prefix: '!',
  bddatabaseUrl: 'https://bddatabase.net/',
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
        axios.get(config.searchUrl + args[1]).then(response => {
          console.log(response.data);
          console.log(typeof response.data);
          let results = JSON.parse(response.data.trim());
          let message = "If your desired item is not below please refine your search:\n";
          console.log(results);
          results = results.slice(0, 10);
          results.forEach(function(value, index) {
            message += "id: " + value.value + " name: " + value.name + "\n";
          })
          msg.channel.send(message);
        }).catch(error => {
          console.log(error);
        })
      }
    }
  }
});

client.login(process.env.TOKEN)