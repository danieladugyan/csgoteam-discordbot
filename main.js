const Discord = require('discord.js');
const client = new Discord.Client();

const http = require('http');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

port = process.env.PORT || 6513;

let body = '';
let playerData = "";

server = http.createServer((req, res) => {
  console.log("Server running on "+port);

  if (req.method == 'POST') {
    console.log("------------");
    console.log("POST");

    res.writeHead(200, {'Content-Type': 'text/html'});
    body = ""

    req.on('data', function(data) {
      body += data;
    });

    req.on('end', function() {
      playerData = JSON.parse(body).player;
      playerTeam = playerData.team;
      playerid = playerData.steamid;
      console.log("Receiving data from: "+playerData.name);

      discServer.fetchMember(playerList[Number(playerid)])
        .then((usr) => {
          (playerTeam == 'CT') ? usr.setVoiceChannel(channels[0]) : usr.setVoiceChannel(channels[1]);
        })
        .catch(console.error);

      console.log("------------");
      res.end('');
    });
  } else {
    console.log("Not expecting other request types...");
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    let html = '<html><body>HTTP Server at http://' + host + ':' + port + '</body></html>';
    res.end(html);
  }
});

channels = ['362310585175506944', '650308364299010087']; // [0] matchrum
playerList = {
  76561198063353595: '198471337734438912', // voltiq
  76561198233132160: '226333548863291392', // l0g3n
  76561198171588038: '225903411155959819', // spaden
  76561198073265867: '280779851181588480', // creepz
  76561198236965602: '184295071774932992', // nacho
  76561198129947173: '180081429009530880'  // fanta
}

client.once('ready', () => {
  discServer = client.guilds.first();
  console.log('Logged in, server starting!');
  server.listen(port);
});

client.login(process.env.APIKEY);
