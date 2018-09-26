/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */

const Alexa = require('ask-sdk');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');


const LaunchRequest = {
  canHandle(handlerInput) {
    // launch requests as well as any new session, as games are not saved in progress, which makes
    // no one shots a reasonable idea except for help, and the welcome message provides some help.
    return handlerInput.requestEnvelope.session.new || handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const attributes = await attributesManager.getPersistentAttributes() || {};
    if (Object.keys(attributes).length === 0) {
      attributes.endedSessionCount = 0;
      attributes.gamesPlayed = 0;
      attributes.gameState = 'ENDED';
    }

    attributesManager.setSessionAttributes(attributes);

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speechOutput = requestAttributes.t('LAUNCH_FIRST') + attributes.gamesPlayed.toString() + requestAttributes.t('LAUNCH_SECOND');
    const reprompt = requestAttributes.t('LAUNCH_REPROMPT');
    return responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('EXIT_MESSAGE'))
      .getResponse();
  },
};

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const HelpIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('HELP_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const YesIntent = {
  canHandle(handlerInput) {
    // only start a new game if yes is said when not playing a game.
    let isCurrentlyPlaying = false;
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    sessionAttributes.gameState = 'STARTED';
    sessionAttributes.guessNumber = Math.floor(Math.random() * 101);

    return handlerInput.responseBuilder
      .speak(requestAttributes.t('YES_MESSAGE'))
      .reprompt(requestAttributes.t('HELP_REPROMPT'))
      .getResponse();
  },
};

const NoIntent = {
  canHandle(handlerInput) {
    // only treat no as an exit when outside a game
    let isCurrentlyPlaying = false;
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;
    const sessionAttributes = attributesManager.getSessionAttributes();
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    sessionAttributes.endedSessionCount += 1;
    sessionAttributes.gameState = 'ENDED';
    attributesManager.setPersistentAttributes(sessionAttributes);

    await attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(requestAttributes.t('STOP_MESSAGE'))
      .getResponse();

  },
};

const UnhandledIntent = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak(requestAttributes.t('UNHANDLED_RESPONSE'))
      .reprompt(requestAttributes.t('UNHANDLED_RESPONSE'))
      .getResponse();
  },
};

const NumberGuessIntent = {
  canHandle(handlerInput) {
    // handle numbers only during a game
    let isCurrentlyPlaying = false;
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return isCurrentlyPlaying && request.type === 'IntentRequest' && request.intent.name === 'NumberGuessIntent';
  },
  async handle(handlerInput) {
    const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;

    const guessNum = parseInt(requestEnvelope.request.intent.slots.number.value, 10);
    const sessionAttributes = attributesManager.getSessionAttributes();
    const targetNum = sessionAttributes.guessNumber;
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();


    if (guessNum > targetNum) {
      return handlerInput.responseBuilder
        .speak(guessNum.toString() + requestAttributes.t('TOO_HIGH_MESSAGE'))
        .reprompt(requestAttributes.t('TOO_HIGH_REPROMPT'))
        .getResponse();
    } else if (guessNum < targetNum) {
      return handlerInput.responseBuilder
        .speak(guessNum.toString() + requestAttributes.t('TOO_LOW_MESSAGE'))
        .reprompt(requestAttributes.t('TOO_LOW_REPROMPT'))
        .getResponse();
    } else if (guessNum === targetNum) {
      sessionAttributes.gamesPlayed += 1;
      sessionAttributes.gameState = 'ENDED';
      attributesManager.setPersistentAttributes(sessionAttributes);
      await attributesManager.savePersistentAttributes();
      return handlerInput.responseBuilder
        .speak(guessNum.toString() + requestAttributes.t('GUESS_CORRECT_MESSAGE'))
        .reprompt(requestAttributes.t('GUESS_CORRECT_REPROMPT'))
        .getResponse();
    }
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE_DURING_GAME'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT_DURING_GAME'))
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR_MESSAGE'))
      .reprompt(requestAttributes.t('ERROR_MESSAGE'))
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    // handle fallback intent, yes and no when playing a game
    // for yes and no, will only get here if and not caught by the normal intent handler
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.FallbackIntent' ||
       request.intent.name === 'AMAZON.YesIntent' ||
       request.intent.name === 'AMAZON.NoIntent');
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
      // currently playing

      return handlerInput.responseBuilder
        .speak(requestAttributes.t('FALLBACK_MESSAGE_DURING_GAME'))
        .reprompt(requestAttributes.t('FALLBACK_REPROMPT_DURING_GAME'))
        .getResponse();
    }

    // not playing
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE_OUTSIDE_GAME'))
      .reprompt(requestAttributes.t('FALLBACK_REPROMPT_OUTSIDE_GAME'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings,
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values,
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequest,
    ExitHandler,
    SessionEndedRequest,
    HelpIntent,
    YesIntent,
    NoIntent,
    NumberGuessIntent,
    FallbackHandler,
    UnhandledIntent,
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withTableName('High-Low-Game')
  .withAutoCreateTable(true)
  .lambda();

// translations

const enData = {
  translation: {
    SKILL_NAME: 'High Low Game',
    EXIT_MESSAGE: 'Thanks for playing!',
    FALLBACK_MESSAGE_DURING_GAME: `The High Low Game skill can't help you with that.  Try guessing a number between 0 and 100. `,
    FALLBACK_REPROMPT_DURING_GAME: 'Please guess a number between 0 and 100.',
    FALLBACK_MESSAGE_OUTSIDE_GAME: `The High Low Game skill can't help you with that.  It will come up with a number between 0 and 100 and you try to guess it by saying a number in that range. Would you like to play?`,
    FALLBACK_REPROMPT_OUTSIDE_GAME: 'Say yes to start the game or no to quit.',
    GUESS_CORRECT_MESSAGE: ' is correct! Would you like to play a new game?',
    GUESS_CORRECT_REPROMPT: 'Say yes to start a new game, or no to end the game.',
    LAUNCH_FIRST: 'Welcome to High Low guessing game. You have played ',
    LAUNCH_SECOND: ' times. would you like to play?',
    LAUNCH_REPROMPT: 'Say yes to start the game or no to quit.',
    TOO_HIGH_MESSAGE: ' is too high.',
    TOO_HIGH_REPROMPT: 'Try guessing a smaller number.',
    TOO_LOW_MESSAGE: ' is too low.',
    TOO_LOW_REPROMPT: 'Try guessing a larger number.',
    HELP_MESSAGE: 'I am thinking of a number between zero and one hundred, try to guess it and I will tell you if it is higher or lower.',
    HELP_REPROMPT: 'Try saying a number.',
    ERROR_MESSAGE: 'Sorry, an error occurred.',
    UNHANDLED_RESPONSE: 'Say yes to continue, or no to end the game.',
    YES_MESSAGE: 'Great! Try saying a number to start the game.',
    STOP_MESSAGE: 'Ok, see you next time!'
  },
};

const enauData = {
  translation: {
    SKILL_NAME: 'Austrailian High Low Game',
  },
};

const encaData = {
  translation: {
    SKILL_NAME: 'Canadian High Low Game',
  },
};

const engbData = {
  translation: {
    SKILL_NAME: 'British High Low Game',
  },
};

const eninData = {
  translation: {
    SKILL_NAME: 'Indian High Low Game',
  },
};

const enusData = {
  translation: {
    SKILL_NAME: 'American High Low Game',
  },
};

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  'en': enData,
  'en-AU': enauData,
  'en-CA': encaData,
  'en-GB': engbData,
  'en-IN': eninData,
  'en-US': enusData
};
