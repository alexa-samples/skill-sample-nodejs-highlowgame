# Build An Alexa High Low Game Skill
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png" />

## Setup w/ ASK CLI

### About
This readme assumes you have your developer environment ready to go and that you have some familiarity with CLI (Command Line Interface) Tools, [AWS](https://aws.amazon.com/), and the [ASK Developer Portal](https://developer.amazon.com/alexa-skills-kit?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Content&sc_detail=high-low-game-nodejs-V2_CLI-1&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Content_high-low-game-nodejs-V2_CLI-1_Convert_WW_beginnersdevs&sc_segment=beginnersdevs). If not, [click here](./setup-vui-alexa-hosted.md) for a more detailed walkthrough.

### Pre-requisites

* Node.js (> v8)
* Register for an [AWS Account](https://aws.amazon.com/)
* Register for an [Amazon Developer Account](https://developer.amazon.com?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Content&sc_detail=high-low-game-nodejs-V2_CLI-1&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Content_high-low-game-nodejs-V2_CLI-1_Convert_WW_beginnersdevs&sc_segment=beginnersdevs)
* Install and Setup [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Content&sc_detail=high-low-game-nodejs-V2_CLI-1&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Content_high-low-game-nodejs-V2_CLI-1_Convert_WW_beginnersdevs&sc_segment=beginnersdevs)

### Installation
1. **Make sure** you are running the latest version of the CLI

	```bash
	npm update -g ask-cli
	```

2. **Clone** the repository.

	```bash
	ask new --url https://github.com/alexa/skill-sample-nodejs-highlowgame.git --skill-name high-low-game
	```

### Deployment

ASK CLI **will create the skill and the lambda function for you**. The Lambda function will be created in ```us-east-1 (Northern Virginia)``` by default.

1. Navigate to the project's root directory. you should see a file named 'skill.json' there.
1. Deploy the skill and the lambda function in one step by running the following command:
	```bash
	ask deploy
	```
1. Once deployed, additional permissions need to be added to the AWS IAM role being used by the function since it is persisting data in Amazon DynamoDB. Locate the execution role used by the skill's Lambda function in the AWS IAM Console.
    1. Open the AWS Console: https://console.aws.amazon.com/iam
    1. Click on **Roles**.
    1. Type (at least part of) the name of your skill in the search box. (Replace spaces with dashes.)
    1. Click the role that corresponds to your skill's function.
		> Note: If you can't find the correct role, first locate your skill's function in [AWS Lambda](https://console.aws.amazon.com/lambda). Scroll down to the section labeled **Execution Role** and find the role name there.
1. On the right side of the **Permissions** tab, click **+ Add inline policy**.
1. Click the **JSON** tab.
1. Select the existing JSON and replace it with the following policy document.  This policy grants access to the role to (1) create the needed table and (2) read/write items to the table.  It is restricted to this for just a table named 'High-Low-Game'.
    ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "DynamoDBTableCreationAndAccess",
                "Effect": "Allow",
                "Action": [
                    "dynamodb:CreateTable",
                    "dynamodb:PutItem",
                    "dynamodb:GetItem",
                    "dynamodb:UpdateItem"
                ],
                "Resource": "arn:aws:dynamodb:*:*:table/High-Low-Game"
            }
        ]
    }
    ```
		> Note: The table name as specified in the sample code is `High-Low-Game`.  If you want to use a different name, change it in the policy and in the sample code.  The name doesn't matter as long as they match.
1. Click **Review Policy**.
1. Enter `DynamoDBTableAccess` as the **Name**.
1. Click **Create Policy**.

### Testing

1. To test, you need to login to Alexa Developer Console, and **enable the "Test" switch on your skill from the "Test" Tab**.

2. Simulate verbal interaction with your skill through the command line (this might take a few moments) using the following example:

	```bash
	 ask simulate -l en-GB -t "start high low game"

	 ✓ Simulation created for simulation id: 4a7a9ed8-94b2-40c0-b3bd-fb63d9887fa7
	◡ Waiting for simulation response{
	  "status": "SUCCESSFUL",
	  ...
	 ```

3. Once the "Test" switch is enabled, your skill can be tested on devices associated with the developer account as well. Speak to Alexa from any enabled device, from your browser at [echosim.io](https://echosim.io/welcome), or through your Amazon Mobile App and say :

	```text
	Alexa, start high low game
	```
## Customization

1. ```./skill.json```

   Change the skill name, example phrase, icons, testing instructions etc ...

   Remember than many information are locale-specific and must be changed for each locale (en-GB and en-US)

   See the Skill [Manifest Documentation](https://developer.amazon.com/docs/smapi/skill-manifest.html?&sc_category=Owned&sc_channel=RD&sc_campaign=Evangelism2018&sc_publisher=github&sc_content=Survey&sc_detail=high-low-game-nodejs-V2_CLI-3&sc_funnel=Convert&sc_country=WW&sc_medium=Owned_RD_Evangelism2018_github_Survey_high-low-game-nodejs-V2_CLI-3_Convert_WW_beginnersdevs&sc_segment=beginnersdevs) for more information.

2. ```./lambda/custom/index.js```

   Modify messages, and data from the source code to customize the skill.

3. ```./models/*.json```

	Change the model definition to replace the invocation name and the sample phrase for each intent.  Repeat the operation for each locale you are planning to support.

4. Remember to re-deploy your skill and lambda function for your changes to take effect.
