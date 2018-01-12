'use strict';
const Alexa = require("alexa-sdk");
const appId = ''; //'amzn1.echo-sdk-ams.app.your-skill-id';

//    Modify these strings and messages to change the behavior of your Lambda function
const languageStrings = {
    'en': {
        'translation': {
            'WELCOME'                   : 'Welcome to High Low guessing game. You have played {{count}} times. Would you like to play?',
            'WELCOME_REPROMPT'          : 'Say yes to start the game or no to quit.',
            'STOP'                      : 'Goodbye!',
            'HELP'                      : 'I will think of a number between zero and one hundred, '
                                          + 'try to guess and I will tell you if it is higher or lower. '
                                          + 'Do you want to start the game?',
            'HELP_REPROMPT'             : 'Try saying a number.',
            'START_YES'                 : 'Great! Try saying a number to start the game.',
            'START_YES_REPROMPT'        : 'Try saying a number.', 
            'START_NO'                  : 'Ok, see you next time!',
            'START_UNHANDLED'           : 'Say yes to continue, or no to end the game.',
            'GUESS_UNHANDLED'           : 'Sorry, I didn\'t get that. Try saying a number.',
            'GUESS_UNHANDLED_REPROMPT'  : 'Try saying a number.',
            'GUESS_LOW'                 : '{{guess}} is too low.',
            'GUESS_LOW_REPROMPT'        : 'Try saying a larger number.',
            'GUESS_HIGH'                : '{{guess}} is too high.',
            'GUESS_HIGH_REPROMPT'       : 'Try saying a smaller number.',            
            'GUESS_CORRECT'             : '{{guess}} is correct! Would you like to play a new game?',
            'GUESS_CORRECT_REPROMPT'    : 'Say yes to start a new game, or no to end the game.'
        }
    },
    'de-DE': { 
        'translation' : { 
            'WELCOME'                   : 'Willkommen beim Größer-Kleiner-Spiel. Du hast schon {{count}} mal gespielt. Möchtest du spielen?',
            'WELCOME_REPROMPT'          : 'Sage Ja, um das Spiel zu starten, oder Nein, um es zu beenden.',
            'STOP'                      : 'Auf Wiedersehen!',
            'HELP'                      : 'Ich denke mir eine Zahl zwischen Null und Hundert aus, '
                                          + 'versuche diese zu raten und ich sage dir, ob du drüber oder drunter liegst. '
                                          + 'Möchtest du das Spiel starten?',
            'HELP_REPROMPT'             : 'Sage eine Zahl.',
            'START_YES'                 : 'Klasse! Sage eine Zahl, um das Spiel zu starten.',
            'START_YES_REPROMPT'        : 'Sage eine Zahl.', 
            'START_NO'                  : 'Gut, bis zum nächsten Mal!',
            'START_UNHANDLED'           : 'Sage Ja, um weiter zu machen, oder Nein, um das Spiel zu beenden.',
            'GUESS_UNHANDLED'           : 'Entschuldige, das habe ich nicht verstanden. Bitte sage eine Zahl.',
            'GUESS_UNHANDLED_REPROMPT'  : 'Sage eine Zahl.',
            'GUESS_LOW'                 : '{{guess}} ist zu niedrig.',
            'GUESS_LOW_REPROMPT'        : 'Versuche eine größere Zahl.',
            'GUESS_HIGH'                : '{{guess}} ist zu hoch.',
            'GUESS_HIGH_REPROMPT'       : 'Versuche eine kleinere Zahl.',            
            'GUESS_CORRECT'             : '{{guess}} ist richtig! Möchtest du es noch einmal versuchen?',
            'GUESS_CORRECT_REPROMPT'    : 'Sage Ja, um weiter zu machen, oder Nein, um das Spiel zu beenden.'
        } 
    }
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = 'highLowGuessUsers';
    alexa.resources = languageStrings;
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
        // this.response.speak('Welcome to High Low guessing game. You have played '
        //    + this.attributes['gamesPlayed'].toString() + ' times. would you like to play?')
        this.response.speak(this.t('WELCOME', {count: this.attributes['gamesPlayed'].toString()}))
            .listen(this.t('WELCOME_REPROMPT'));
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        //this.attributes['endedSessionCount'] += 1;
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    }
};

const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function() {
        this.attributes["guessNumber"] = Math.floor(Math.random() * 100);
        this.handler.state = states.GUESSMODE;
        this.response.speak(this.t('START_YES')).listen(this.t('START_YES_REPROMPT'));
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function() {
        console.log("NOINTENT");
        this.response.speak(his.t('START_NO'));
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        console.log("STOPINTENT");
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        //this.attributes['endedSessionCount'] += 1;
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        this.response.speak(this.t('START_UNHANDLED')).listen(this.t('START_UNHANDLED'));
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
                this.response.speak(this.t('GUESS_CORRECT', {guess: guessNum.toString()}))
                    .listen(this.t('GUESS_CORRECT_REPROMPT'));
                this.emit(':responseReady');
        })
        } else {
            this.emit('NotANum');
        }
    },
    'AMAZON.HelpIntent': function() {
        this.response.speak(this.t('HELP'))
            .listen(this.t('HELP_REPROMPT'));
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        console.log("STOPINTENT");
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        this.attributes['endedSessionCount'] += 1;
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        this.response.speak(this.t('GUESS_UNHANDLED'))
            .listen(this.t('GUESS_UNHANDLED_REPROMPT'));
        this.emit(':responseReady');
    }
});

// These handlers are not bound to a state
const guessAttemptHandlers = {
    'TooHigh': function(val) {
        this.response.speak(this.t('GUESS_HIGH', {guess: val.toString()}))
            .listen(this.t('GUESS_HIGH_REPROMPT'));
        this.emit(':responseReady');
    },
    'TooLow': function(val) {
        this.response.speak(this.t('GUESS_LOW', {guess: val.toString()}))
            .listen(this.t('GUESS_LOW_REPROMPT'));
        this.emit(':responseReady');
    },
    'JustRight': function(callback) {
        this.handler.state = states.STARTMODE;
        this.attributes['gamesPlayed']++;
        callback();
    },
    'NotANum': function() {
        this.response.speak(this.t('GUESS_UNHANDLED'))
            .listen(this.t('GUESS_UNHANDLED_REPROMPT'));
        this.emit(':responseReady');
    }
};