const http = require('http');
const fs = require('fs');
const google = require('google');
const querystring = require('querystring');

const comment = require('./comment.js');

console.log("----------------------------------");
console.log("-- Malbot en cours de démarrage --");
console.log("----------------------------------");

var keywords = [];
for (var i = 2; i < process.argv.length; i++) {
  keywords.push(process.argv[i]);
}
console.log("Mots clés: " + keywords);

///////////////////////////////////////////////
//               RESULTATS GOOGLE            //
///////////////////////////////////////////////

google.resultsPerPage = 25;
google.lang = 'fr';
google.tld = 'fr';
google.nextText = 'Suivant';

links = [
  "http://madmoizerg.com/2013/11/pixelles-la-veille-jeux-video-de-novembre-par-madmoizerg/",
  "http://www.ervael.com/fr/news-jeux-video-janvier-2016/",
  "http://www.ervael.com/fr/news-jeux-video-novembre-decembre-2015/",
  "http://unijam.telecom-sudparis.eu/2015/11/23/unijam-2015-jeux-realises/"
]

var linksDone = fs.readFileSync("done.txt", {encoding: "utf8"});

linksDone = linksDone.split('\n');

var usedLink = "";

for (var i = 0; i < links.length; ++i) {
    if (linksDone.indexOf(links[i]) == -1){
      usedLink = links[i];
      break;
    }
}

if (usedLink == ""){
  console.log("Aucun site trouvé... Fin du programme");
  process.exit();
}

var id = comment.getCommentId(usedLink);

google.requestOptions = {
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en;q=0.5',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
    'DNT': 1
  }
}

// google('+"powered by wordpress"+"actualites"+"jeux video"+"Votre adresse de messagerie ne sera pas publiée"', function (err, next, links){
//   if (err) console.error(err)
//
//   for (var i = 0; i < links.length; ++i) {
//     console.log(links[i].link);
//
//     return;
//   }
// })

///////////////////////////////////////////////
//             SAUVEGARDE DU SITE            //
///////////////////////////////////////////////

console.log("");
console.log("Post sur " + usedLink);

fs.appendFile("done.txt", usedLink + "\n");
