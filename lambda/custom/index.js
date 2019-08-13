// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Amazon Software License
// http://aws.amazon.com/asl/

/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
const Alexa = require('ask-sdk');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter'); // included in ask-sdk
const ddbTableName = 'High-Low-Game';
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const languageStrings = {
  'en': require('./languages/en'),
  'es': require('./languages/es')
}

const LaunchRequest = {
  canHandle(handlerInput) {
    // launch requests as well as any new session, as games are not saved in progress, which makes
    // no one shots a reasonable idea except for help, and the welcome message provides some help.
    return Alexa.isNewSession(handlerInput.requestEnvelope) 
      || Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const attributes = await attributesManager.getPersistentAttributes() || {};

    if (Object.keys(attributes).length === 0) {
      attributes.endedSessionCount = 0;
      attributes.gamesPlayed = 0;
      attributes.gameState = 'ENDED';
    }

    attributesManager.setSessionAttributes(attributes);

    const gamesPlayed = attributes.gamesPlayed.toString()
    const speechOutput = requestAttributes.t('LAUNCH_MESSAGE', gamesPlayed);
    const reprompt = requestAttributes.t('CONTINUE_MESSAGE');

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
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
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const HelpIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
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
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
      sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying 
      && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

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
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
      sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying 
      && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    sessionAttributes.endedSessionCount += 1;
    sessionAttributes.gameState = 'ENDED';
    attributesManager.setPersistentAttributes(sessionAttributes);

    await attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(requestAttributes.t('EXIT_MESSAGE'))
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
      .speak(requestAttributes.t('CONTINUE_MESSAGE'))
      .reprompt(requestAttributes.t('CONTINUE_MESSAGE'))
      .getResponse();
  },
};

const NumberGuessIntent = {
  canHandle(handlerInput) {
    // handle numbers only during a game
    let isCurrentlyPlaying = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
      sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return isCurrentlyPlaying 
      && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumberGuessIntent';
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const guessNum = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, 'number'), 10);
    const targetNum = sessionAttributes.guessNumber;
    
    if (guessNum > targetNum) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('TOO_HIGH_MESSAGE', guessNum.toString()))
        .reprompt(requestAttributes.t('TOO_HIGH_REPROMPT'))
        .getResponse();
    } else if (guessNum < targetNum) {
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('TOO_LOW_MESSAGE', guessNum.toString()))
        .reprompt(requestAttributes.t('TOO_LOW_REPROMPT'))
        .getResponse();
    } else if (guessNum === targetNum) {
      sessionAttributes.gamesPlayed += 1;
      sessionAttributes.gameState = 'ENDED';
      attributesManager.setPersistentAttributes(sessionAttributes);
      await attributesManager.savePersistentAttributes();
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('GUESS_CORRECT_MESSAGE', guessNum.toString()))
        .reprompt(requestAttributes.t('CONTINUE_MESSAGE'))
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
  canHandle(handlerInput) {
    // handle fallback intent, yes and no when playing a game
    // for yes and no, will only get here if and not caught by the normal intent handler
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent' 
      || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
      || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState && sessionAttributes.gameState === 'STARTED') {
      // currently playing
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('FALLBACK_MESSAGE_DURING_GAME'))
        .reprompt(requestAttributes.t('FALLBACK_REPROMPT_DURING_GAME'))
        .getResponse();
    }

    // not playing
    return handlerInput.responseBuilder
      .speak(requestAttributes.t('FALLBACK_MESSAGE_OUTSIDE_GAME'))
      .reprompt(requestAttributes.t('CONTINUE_MESSAGE'))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: Alexa.getLocale(handlerInput.requestEnvelope),
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

function getPersistenceAdapter(tableName) {
  // Determines persistence adapter to be used based on environment
  // Note: tableName is only used for DynamoDB Persistence Adapter
  if (process.env.S3_PERSISTENCE_BUCKET) {
    // in Alexa Hosted Environment
    // eslint-disable-next-line global-require
    const s3Adapter = require('ask-sdk-s3-persistence-adapter');
    return new s3Adapter.S3PersistenceAdapter({
      bucketName: process.env.S3_PERSISTENCE_BUCKET,
    });
  }

  // Not in Alexa Hosted Environment
  return new ddbAdapter.DynamoDbPersistenceAdapter({
    tableName: tableName,
    createTable: true,
  });
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .withPersistenceAdapter(getPersistenceAdapter(ddbTableName))
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
  .lambda();
