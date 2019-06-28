#  Build An Alexa High Low Game Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

This Alexa sample skill is a template for a basic high-low game skill. Guess a number, and Alexa will tell you whether the number she has in mind is higher or lower.

## Skill Architecture
Each skill consists of two basic parts, a front end and a back end.
The front end is the voice interface, or VUI.
The voice interface is configured through the voice interaction model.
The back end is where the logic of your skill resides.

> Note: The High Low Game uses persistent attributes.  When you create an Alexa-hosted skill, the persistence layer the sample code uses is Amazon S3.  No configuration or additional setup is required to use the S3 bucket provided with an Alexa-hosted skill.  When you create an AWS-hosted skill, the persistence layer the sample code uses is Amazon DynamoDB.  The tutorial will walk you through any additional steps required to setup and access DynamoDB.

## Three Options for Skill Setup
There are a number of different ways for you to setup your skill, depending on your experience and what tools you have available.

 * If this is your first skill, choose the [Alexa-Hosted backend instructions](./instructions/setup-vui-alexa-hosted.md) to get started quickly.
 * If you want to manage the backend resources in your own AWS account, you can follow the [AWS-Hosted instructions](./instructions/setup-vui-aws-hosted.md).
 * Developers with the ASK Command Line Interface configured may follow the [ASK CLI instructions](./instructions/cli.md).

---

## Additional Resources

### Community
* [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/165/index.html) - Join the conversation!
* [Hackster.io](https://www.hackster.io/amazon-alexa) - See what others are building with Alexa.

### Tutorials & Guides
* [Voice Design Guide](https://developer.amazon.com/designing-for-voice/) - A great resource for learning conversational and voice user interface design.
* [Codecademy: Learn Alexa](https://www.codecademy.com/learn/learn-alexa) - Learn how to build an Alexa Skill from within your browser with this beginner friendly tutorial on Codecademy!

### Documentation
* [Alexa Skills Kit SDK for Node.js](https://alexa.design/node-sdk-docs)
* [Alexa Skills Kit Documentation](https://developer.amazon.com/docs/ask-overviews/build-skills-with-the-alexa-skills-kit.html)
