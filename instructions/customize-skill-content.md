# Build An Alexa High Low Game Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

Build an engaging high-low game skill. Guess a number, and Alexa will tell you whether the number she has in mind is higher or lower.

## Customize the Skill to be Yours

At this point, you should have a working copy of our Fact skill.  In order to make it your own, you will need to customize it with data and responses that you create.  Here are the things you will need to change:

1.  **New sentences to respond to your users.** There are several sentences and responses that you will want to customize for your skill.

    1. Navigate to the **Code** tab again, and expand the project folder on the left to `Skill Code/lambda/languages`.

    2. Open **[languageStrings.js](../lambda/custom/languageStrings.js)**

    3. We are going to be editing a response message for the `en` locale, so we will be focusing on this entire file. For this example, I am going to be replacing the response message when a user exits the skill from "Thanks for playing" to "Thanks for playing, looking forward to playing with you again!". To do this, let's focus on `EXIT_MESSAGE`, and replace the contents:

    Before:
    ```js
    module.exports = {
        translation: {
            SKILL_NAME: 'High Low Game',
            EXIT_MESSAGE: 'Thanks for playing!',  // <-- What we care about
            FALLBACK_MESSAGE_DURING_GAME: `I can't help you with that.  Try guessing a number between 0 and 100. `,
            FALLBACK_REPROMPT_DURING_GAME: 'Please guess a number between 0 and 100.',
            FALLBACK_MESSAGE_OUTSIDE_GAME: `I can't help you with that.  I will come up with a number between 0 and 100 and you try to guess it by saying a number in that range. Would you like to play?`,
            GUESS_CORRECT_MESSAGE: '%s is correct! Would you like to play again?',
            LAUNCH_MESSAGE: 'Welcome to High Low guessing game. You have played %s times. Would you like to play?',
            TOO_HIGH_MESSAGE: '%s is too high.',
            TOO_HIGH_REPROMPT: 'Try guessing a smaller number.',
            TOO_LOW_MESSAGE: '%s is too low.',
            TOO_LOW_REPROMPT: 'Try guessing a larger number.',
            CONTINUE_MESSAGE: 'Say yes to play or no to quit.',
            HELP_MESSAGE: 'I am thinking of a number between zero and one hundred, try to guess it and I will tell you if it is higher or lower.',
            HELP_REPROMPT: 'Try saying a number.',
            ERROR_MESSAGE: 'Sorry, an error occurred.',
            YES_MESSAGE: 'Great! Try saying a number to start the game.'
        }
    };
    ```

    After:
    ```js
    module.exports = {
        translation: {
            SKILL_NAME: 'High Low Game',
            EXIT_MESSAGE: 'Thanks for playing, looking forward to playing with you again!', // <-- CHANGED
            FALLBACK_MESSAGE_DURING_GAME: `I can't help you with that.  Try guessing a number between 0 and 100. `,
            FALLBACK_REPROMPT_DURING_GAME: 'Please guess a number between 0 and 100.',
            FALLBACK_MESSAGE_OUTSIDE_GAME: `I can't help you with that.  I will come up with a number between 0 and 100 and you try to guess it by saying a number in that range. Would you like to play?`,
            GUESS_CORRECT_MESSAGE: '%s is correct! Would you like to play again?',
            LAUNCH_MESSAGE: 'Welcome to High Low guessing game. You have played %s times. Would you like to play?',
            TOO_HIGH_MESSAGE: '%s is too high.',
            TOO_HIGH_REPROMPT: 'Try guessing a smaller number.',
            TOO_LOW_MESSAGE: '%s is too low.',
            TOO_LOW_REPROMPT: 'Try guessing a larger number.',
            CONTINUE_MESSAGE: 'Say yes to play or no to quit.',
            HELP_MESSAGE: 'I am thinking of a number between zero and one hundred, try to guess it and I will tell you if it is higher or lower.',
            HELP_REPROMPT: 'Try saying a number.',
            ERROR_MESSAGE: 'Sorry, an error occurred.',
            YES_MESSAGE: 'Great! Try saying a number to start the game.'
        }
    };
    ```

     After you're done editing all of the files necessary, as before, make sure to press **Save**, **Deploy**, and navigate back to the **Testing** tab. When you launch the skill then exit, Alexa should respond with "Thanks for playing, looking forward to playing with you again" instead.

2.  **New language.** If you are creating this skill for another language other than English, you will need to make sure Alexa's responses are also in that language.

    - For example, if you are creating your skill in German, every single response that Alexa makes has to be in German. You can't use English responses or your skill will fail certification.

3. **Once you have customized the skill's data, languages and/or sentences, return to the [Amazon Developer Portal](https://developer.amazon.com/alexa/console/ask?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Survey&sc_detail=fact-nodejs-V2_GUI-5&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Survey_fact-nodejs-V2_GUI-5_Convert_WW_beginnersdevs&sc_segment=beginnersdevs) and select your skill from the list.**

4.  **Click on "Distribution" in the top navigation to move on to the publishing and certification of your skill.**


[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/general/buttons/button_next_publication._TTH_.png)](./submit-for-certification.md)

