const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
var tracery = require('tracery-grammar');
//npm install lodash
const _ = require('lodash')

const fs = require('fs');
const activitiesRaw = fs.readFileSync('activities.json');
const activitiesParsed = JSON.parse(activitiesRaw);

const adverbsRaw = fs.readFileSync('adverbs.json');
const adverbsParsed = JSON.parse(adverbsRaw);

const fortuneTellingRaw = fs.readFileSync('fortuneTelling.json');
const fortuneTellingParsed = JSON.parse(fortuneTellingRaw);

const moodsRaw = fs.readFileSync('moods.json');
const moodsParsed = JSON.parse(moodsRaw);

const netflixCategoriesRaw = fs.readFileSync('netflixCategories.json');
const netflixCategoriesParsed = JSON.parse(netflixCategoriesRaw);

const verbsRaw = fs.readFileSync('verbs.json');
const verbsParsed = JSON.parse(verbsRaw);

const app = dialogflow();

let outputP;
var adverb = {};
var verbs = [];
var netflixCategories = {};
// var fortune = {};
var fortuneSentences =[];
var activity = {};
var activity_in_sentence = [];
var moods = {};


const fortuneFunction = () => {
    fortuneTellingParsed.tarot_interpretations.forEach(interpretation => {
    fortuneSentences.push(interpretation.meanings.light);
    return fortuneSentences;
    console.log(fortuneSentences);
});

}

let fortuneWork = fortuneFunction();

var grammarSource = {
  'origin': ['Working yayyy #fortune#'],
  // 'story': ['#number# #plural_nouns# that #adverb_in_sentence# #verbsPast# #fortuneSentences#',
  //          'Here is why #activity_in_sentence# #will# make you feel #moods#'
  //          ],

  // 'story':['I am feeling #fortuneSentences#'],
  // 'origin': ['I am #number# #netflixCategories#'],
  // 'story': ['#number# #plural_nouns# that #adverb_in_sentence# #verbsPast# #fortuneSentences#',
  //          'Here is why #activity_in_sentence# #will# make you feel #moods#'
  //          ],

  'number':['10','14','12','3','8','6','15','5'],
  'plural_nouns':['gifs','clips','sets','pairs','sentences','articles','tricks','Youtube videos'],  //10
  'netflixCategories': netflixCategoriesParsed.categories,
  'verbsPast' :verbs,
 	'adverb': adverbsParsed.adverbs,
  'fortune': fortuneWork,
  'will':['could','would','will','can'],
  'activity_in_sentence':activity_in_sentence,
  'moods': moodsParsed.moods
};



const generateString = () => {



    //fortune telling
    // for(var i = 0; i<fortuneTellingParsed.tarot_interpretations.length; i++){
    //   for(var j = 0; j<fortuneTellingParsed.tarot_interpretations[i].meanings.light.length; j++){
    //   	fortuneSentences.push(fortuneTelling.tarot_interpretations[i].meanings.light[j]);
    //   	 // print(fortuneTelling.tarot_interpretations[i].meanings.light[j]);
    //     return fortuneSentences;
    //   }
    // }

  /*
  //verbs
  for(var i = 0; i< verbsPast.verbs.length; i++){
   verbs.push(verbsPast.verbs[i].past);
    grammarSource.verbsPast = verbs;
  }




  //activity
  for(var i = 0; i < activity.categories.length; i++){
    for(var j = 0; j < activity.categories[i].examples.length; j++){
   	 activity_in_sentence.push(activity.categories[i].examples[j]);
    	grammarSource.activity_in_sentence = activity_in_sentence;
    }
  }
  */

  var grammar = tracery.createGrammar(grammarSource);
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten("#origin#");
}


app.intent('Default Welcome Intent', conv => {
  conv.ask('Hello, Welcome to Feed me the buzz. I can tell you the next Buzzfeed article you should read based on your interest in the 10 articles I present to you. Shall we start?');
});

app.intent('Get article', conv => {
  conv.ask(' Shall we start?');
});


app.intent('Get article - yes', conv => {
  let randomString = generateString();
  conv.ask(`Here is the first one! ${randomString}`);
});

app.intent('Get article - no', conv => {
  conv.close('No worries! Have a good day');
});






exports.feedMeTheBuzz = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
