const express = require('express'),
    webhook = express.Router(),
    request = require('request'),
    line = require('@line/bot-sdk'),
    dotenv = require('dotenv')
// { WebhookClient } = require('dialogflow-fulfillment')

dotenv.config()

const config = {
    channelAccessToken: "wlxE7/lfcNiwvAK9oFreNxJgXKOiB5kuZWP2TLEfnXHkKoPNtezU2OtEIWadLVPThHVBGPTT1BDmGs+4hNwmrSm4DoYX3LpBrri4XcUViJdf+dnN+aMzjfmpdeJZS1Da+k90DBgcIS1UIFl5U9wnFgdB04t89/1O/w1cDnyilFU=",
    channelSecret: "9ef9d4f5793de7306f5604e333ffb175"
}

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 8MFrHOrFuz4Im5fLucGL28AL2AYLzKEggXW3tkGtBWqh+4hQ5aND9VMDxSkWwK+UhHVBGPTT1BDmGs+4hNwmrSm4DoYX3LpBrri4XcUViJcoZvEKkI5oz/Wq1vSCkpEsJLYEPlFIPBBKSxhEd7s9rQdB04t89/1O/w1cDnyilFU='
}

const client = new line.Client(config)

webhook.post('/callback', line.middleware(config), (req, res) => {

    console.log(req.body.events[0]);

    let events = req.body.events[0]
    reply(events)


})

const replyText = (token, texts) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
        token,
        texts.map((text) => ({ type: 'text', text }))
    );
};

const reply = (event) => {

    // if (events.replyToken && events.replyToken.match(/^(.)\1*$/)) {
    //     return console.log("Test hook recieved: " + JSON.stringify(events.message));
    // }


    // var body

    // body = JSON.stringify({
    //     replyToken: events.replyToken,
    //     messages: [{
    //         type: 'text',
    //         text: 'Hello'
    //     },
    //     {
    //         type: 'text',
    //         text: 'H'
    //     }]
    // })

    // request.post({
    //     url: 'https://api.line.me/v2/bot/message/reply',
    //     headers: headers,
    //     body: body
    // }, (err, res, body) => {
    //     console.log('status = ' + res.statusCode);
    // });
    const replyToken = event.replyToken
    console.log(replyToken);

    switch (event.type) {
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, replyToken, event.source);
                case 'location':
                    return handleLocation(message, event.replyToken);
                case 'sticker':
                    return handleSticker(message, event.replyToken);
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }

        default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
}


function handleText(message, replyToken, source) {
    // const buttonsImageURL = `${baseURL}/static/buttons/1040.jpg`;

    switch (message.text) {
        case 'profile':
            if (source.userId) {
                return client.getProfile(source.userId)
                    .then((profile) => replyText(
                        replyToken,
                        [
                            `Display name: ${profile.displayName}`,
                            `Status message: ${profile.statusMessage}`,
                        ]
                    ));
            } else {
                return replyText(replyToken, 'Bot can\'t use profile API without user ID');
            }
        case 'buttons':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Buttons alt text',
                    template: {
                        type: 'buttons',
                        // thumbnailImageUrl: buttonsImageURL,
                        title: 'My button sample',
                        text: 'Hello, my button',
                        actions: [
                            { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                            { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                            { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                            { label: 'Say message', type: 'message', text: 'Rice=米' },
                        ],
                    },
                }
            );
        case 'confirm':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Confirm alt text',
                    template: {
                        type: 'confirm',
                        text: 'Do it?',
                        actions: [
                            { label: 'Yes', type: 'message', text: 'Yes!' },
                            { label: 'No', type: 'message', text: 'No!' },
                        ],
                    },
                }
            )
        case 'carousel':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Carousel alt text',
                    template: {
                        type: 'carousel',
                        columns: [
                            {
                                // thumbnailImageUrl: buttonsImageURL,
                                title: 'hoge',
                                text: 'fuga',
                                actions: [
                                    { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                                    { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                                ],
                            },
                            {
                                // thumbnailImageUrl: buttonsImageURL,
                                title: 'hoge',
                                text: 'fuga',
                                actions: [
                                    { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                                    { label: 'Say message', type: 'message', text: 'Rice=米' },
                                ],
                            },
                        ],
                    },
                }
            );
        case 'image carousel':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Image carousel alt text',
                    template: {
                        type: 'image_carousel',
                        columns: [
                            {
                                imageUrl: buttonsImageURL,
                                action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
                            },
                            {
                                imageUrl: buttonsImageURL,
                                action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                            },
                            {
                                imageUrl: buttonsImageURL,
                                action: { label: 'Say message', type: 'message', text: 'Rice=米' },
                            },
                            {
                                imageUrl: buttonsImageURL,
                                action: {
                                    label: 'datetime',
                                    type: 'datetimepicker',
                                    data: 'DATETIME',
                                    mode: 'datetime',
                                },
                            },
                        ]
                    },
                }
            );
        case 'datetime':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Datetime pickers alt text',
                    template: {
                        type: 'buttons',
                        text: 'Select date / time !',
                        actions: [
                            { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
                            { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
                            { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
                        ],
                    },
                }
            );
        case 'imagemap':
            return client.replyMessage(
                replyToken,
                {
                    type: 'imagemap',
                    // baseUrl: `${baseURL}/static/rich`,
                    altText: 'Imagemap alt text',
                    baseSize: { width: 1040, height: 1040 },
                    actions: [
                        { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
                        { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
                        { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
                        { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
                    ],
                    video: {
                        // originalContentUrl: `${baseURL}/static/imagemap/video.mp4`,
                        // previewImageUrl: `${baseURL}/static/imagemap/preview.jpg`,
                        area: {
                            x: 280,
                            y: 385,
                            width: 480,
                            height: 270,
                        },
                        externalLink: {
                            linkUri: 'https://line.me',
                            label: 'LINE'
                        }
                    },
                }
            );
        case 'bye':
            switch (source.type) {
                case 'user':
                    return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
                case 'group':
                    return replyText(replyToken, 'Leaving group')
                        .then(() => client.leaveGroup(source.groupId));
                case 'room':
                    return replyText(replyToken, 'Leaving room')
                        .then(() => client.leaveRoom(source.roomId));
            }
        default:
            console.log(`Echo message to ${replyToken}: ${message.text}`);
            return replyText(replyToken, message.text);
    }
}

function handleLocation(message, replyToken) {
    return client.replyMessage(
        replyToken,
        {
            type: 'location',
            title: message.title,
            address: message.address,
            latitude: message.latitude,
            longitude: message.longitude,
        }
    );
}

function handleSticker(message, replyToken) {
    return client.replyMessage(
        replyToken,
        {
            type: 'sticker',
            packageId: message.packageId,
            stickerId: message.stickerId,
        }
    );
}






module.exports = webhook