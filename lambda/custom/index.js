'use strict';
const Alexa = require("alexa-sdk");
const appId = ''; //'amzn1.echo-sdk-ams.app.your-skill-id';

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = 'highLowGuessUsers';
    alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers, guessAttemptHandlers);
    alexa.execute();
};

const states = {
    GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
    STARTMODE: '_STARTMODE'  // Prompt the user to start or restart the game.
};

const newSessionHandlers = {
    'NewSession': function() {
        if(Object.keys(this.attributes).length === 0) {
            this.attributes['endedSessionCount'] = 0;
            this.attributes['gamesPlayed'] = 0;
        }
        this.handler.state = states.STARTMODE;
        this.response.speak('Welcome to High Low guessing game. You have played '
            + this.attributes['gamesPlayed'].toString() + ' times. would you like to play?')
            .listen('Say yes to start the game or no to quit.');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        //this.attributes['endedSessionCount'] += 1;
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    }
};

const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        const message = 'I will think of a number between zero and one hundred, try to guess and I will tell you if it' +
            ' is higher or lower. Do you want to start the game?';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function() {
        this.attributes["guessNumber"] = Math.floor(Math.random() * 100);
        this.handler.state = states.GUESSMODE;
        this.response.speak('Great! ' + 'Try saying a number to start the game.').listen('Try saying a number.');
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function() {
        console.log("NOINTENT");
        this.response.speak('Ok, see you next time!');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
      console.log("STOPINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
      console.log("CANCELINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        //this.attributes['endedSessionCount'] += 1;
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        const message = 'Say yes to continue, or no to end the game.';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    }
});

const guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },
    'NumberGuessIntent': function() {
        const guessNum = parseInt(this.event.request.intent.slots.number.value);
        const targetNum = this.attributes["guessNumber"];
        console.log('user guessed: ' + guessNum);

        if(guessNum > targetNum){
            this.emit('TooHigh', guessNum);
        } else if( guessNum < targetNum){
            this.emit('TooLow', guessNum);
        } else if (guessNum === targetNum){
            // With a callback, use the arrow function to preserve the correct 'this' context
            this.emit('JustRight', () => {
                this.response.speak(guessNum.toString() + 'is correct! Would you like to play a new game?')
                .listen('Say yes to start a new game, or no to end the game.');
                this.emit(':responseReady');
        })
        } else {
            this.emit('NotANum');
        }
    },
    'AMAZON.HelpIntent': function() {
        this.response.speak('I am thinking of a number between zero and one hundred, try to guess and I will tell you' +
            ' if it is higher or lower.')
            .listen('Try saying a number.');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        console.log("STOPINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        this.attributes['endedSessionCount'] += 1;
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        this.response.speak('Sorry, I didn\'t get that. Try saying a number.')
        .listen('Try saying a number.');
        this.emit(':responseReady');
    }
});

// These handlers are not bound to a state
const guessAttemptHandlers = {
    'TooHigh': function(val) {
        this.response.speak(val.toString() + ' is too high.')
        .listen('Try saying a smaller number.');
        this.emit(':responseReady');
    },
    'TooLow': function(val) {
        this.response.speak(val.toString() + ' is too low.')
        .listen('Try saying a larger number.');
        this.emit(':responseReady');
    },
    'JustRight': function(callback) {
        this.handler.state = states.STARTMODE;
        this.attributes['gamesPlayed']++;
        callback();
    },
    'NotANum': function() {
        this.response.speak('Sorry, I didn\'t get that. Try saying a number.')
        .listen('Try saying a number.');
        this.emit(':responseReady');
    }
};
