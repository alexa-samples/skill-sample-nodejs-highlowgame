# Build An Alexa High Low Game Skill
[![Voice User Interface](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/1-locked._TTH_.png)](https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/1-voice-user-interface.md)[![Lambda Function](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/2-locked._TTH_.png)](https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/2-lambda-function.md)[![Connect VUI to Code](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/3-locked._TTH_.png)](https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/3-connect-vui-to-code.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/4-locked._TTH_.png)](https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/4-testing.md)[![Customization](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/5-on._TTH_.png)](https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/5-customization.md)[![Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/navigation/6-off._TTH_.png)](https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/6-publication.md)

## Customize the Skill to be Yours

At this point, you should have a working copy of our High Low Game skill.  In order to make it your own, you will need to customize it with some responses that you create.  Here are the things you will need to change:

1.  **Update your sample utterances.** There is some sample utterances for NumberGuessIntent.  You need to update this list of utterances to for a robust voice experience.

        *  **Remember that if you are creating this skill for another language other than English, your sample utterances need to be written in that language, not English.

    5.  **Click the "Save" button when you have completed.**

        <img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/highlowgame/5-2-5-save-button._TTH_.png" />

3.  **New sentences to respond to your users.** There are several sentences and responses that you will want to customize for your skill.

    1.  **Go back to your copy of [index.js]((https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/lambda/src/index.js)).**

    2.  **Look for lines like this: this.response.speak('Welcome to High Low guessing game. You have played '."** These are strings that hold phrases for Alexa to respond with.  Customize them to make it as varied and conversational as time allows.

    3.  **Continue through index.js until you reach the bottom of the file.**  This will ensure that you cover each of the Alexa responses that you need to update.

4.  **New language.** If you are creating this skill for another language other than English, you will need to make sure Alexa's responses are also in that language.

    *  For example, if you are creating your skill in German, every single response that Alexa makes has to be in German.  You can't use English responses or your skill will fail certification.

5.  **Once you have made the updates listed on this page, you can click "Next" to move on to Publishing and Certification of your skill.**

    <a href="https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/6-publication.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/3-7-next-button._TTH_.png" /></a>

<br/><br/>
<a href="https://github.com/alexa/skill-sample-nodejs-highlowgame/blob/master/instructions/6-publication.md"><img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_publication._TTH_.png" /></a>

<img height="1" width="1" src="https://www.facebook.com/tr?id=1847448698846169&ev=PageView&noscript=1"/>
