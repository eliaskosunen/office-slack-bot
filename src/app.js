'use strict';

const Botkit = require('botkit');
const Config = require('./configuration');

// If constants not found from environment variables, try to get it from keys.js file
const BOT_TOKEN = process.env.BOT_TOKEN || Config.botToken;
const HOME_CHANNEL_ID = process.env.CHANNEL_ID || Config.homeChannelId;
const WEBHOOK_URL = process.env.WEBHOOK_URL || Config.webhookUrl;

const myBot = require('./bot');
const DickbuttService = require('./dickbuttService');

const controller = Botkit.slackbot({
    debug: false
});

const botInstance = controller.spawn({
    token: BOT_TOKEN
}).startRTM();

const userConfig = {
    user: Config.slackAdminUserId
};

controller.on('message_received', (bot, message) => {
    const giphyCallback = (bot) => {
        bot.api.chat.postMessage({
            text: "/giphy dickbutt"
        });
    };
    const attachmentCallback = (bot) => {
        bot.api.chat.postMessage({
            attachments: [{
                image_url: "http://i.imgur.com/ORhXMf2.png"
            }]
        });
    };
    const textCallback = (bot) => {
        bot.api.chat.postMessage({
            text: "kokpers"
        });
    };
    const dickbutt = new DickbuttService(Config.fridayFun, () => {
        textCallback(bot);
    });
});

controller.on(['direct_message', 'direct_mention'], (bot, message) => {
    bot.api.users.info({ user: message.user }, (error, response) => {
        if (Config.allowGuestsToUse || (!response.user.is_restricted && !response.user.is_ultra_restricted)) {
            const caller = { name: response.user.real_name, email: response.user.profile.email };
            myBot.handle(message.text, caller).then(response => {
                if (response)
                    bot.reply(message, response);
            });
        } else {
            bot.reply(message, 'No rights to chat with Bot');
        }
    });
});

controller.on('rtm_close', () => {
    // Just exit. Forver or something similar will restart this
    process.exit();
});

myBot.setNotifyFunc((output) => {
    botInstance.startPrivateConversation(userConfig, (err, conversation) => {
        conversation.say(output);
    });
});

process.on('uncaughtException', (exception) => {
    console.log(exception);
    botInstance.startPrivateConversation(userConfig, (err, conversation) => {
        conversation.say(exception.stack);
        // Wait before exit so bot has time to send the last message
        setTimeout(() => process.exit(), 5000);
    });
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    botInstance.startPrivateConversation(userConfig, (err, conversation) => {
        conversation.say('Unhandled Rejection at Promise ' + reason.message);
    });
});
