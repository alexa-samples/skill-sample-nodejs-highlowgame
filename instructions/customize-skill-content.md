# Build An Alexa High Low Game Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

## Customize the Skill to be Yours

At this point, you should have a working copy of our High Low Game skill.  There isn't too much you can customize with this game without changing the game, so think about how you might make your game and if this sample's framework could help with that.  So that you can see how changes you make can come to life, here are a few things you can do in order to customize it:

1.  **Update your sample utterances.** There are some sample utterances for NumberGuessIntent.  You need to update this list of utterances for a more robust voice experience.
> Remember that if you are creating this skill for another language other than English, your sample utterances need to be written in that language, not English.

1. Click the **Save** button when you have completed.

1.  **New sentences to respond to your users.** There are several sentences and responses that you will want to customize for your skill.

    1.  **Go back to your copy of [index.js](../lambda/custom/index.js).

    2.  Look for code like this: `.speak('Welcome to High Low guessing game...` and `.reprompt(...`.  These are the strings that hold phrases for Alexa to respond with.  Customize them to make the skill varied and conversational.

    3.  Continue through **index.js** until you reach the bottom of the file.  This will ensure that you cover each of the Alexa responses that you need to update.

1.  **New language.** If you are creating this skill for another language other than English, you will need to make sure Alexa's responses are also in that language.

    *  For example, if you are creating your skill in German, every single response that Alexa makes has to be in German.  You can't use English responses or your skill will fail certification.

1.  Once you have made the updates listed on this page, you can click **Next** to move on to Publishing and Certification of your skill.

[![Next Publication](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_publication._TTH_.png)](./submit-for-certification.md)
