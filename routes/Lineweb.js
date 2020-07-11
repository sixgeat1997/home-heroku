const express = require('express'),
    webhook = express.Router(),
    request = require('request'),
    line = require('@line/bot-sdk')




const config = {
    channelAccessToken: "KF435sOwdUpGPvW5jHapfL3VKuV4qmCyN9sNrWC+JXWAt/Mcf2BBxkR3cq0+Lo4fPZZM4LclJgMTRllFbW8IRlZasmGHQQGgAyIoWxpFwZkmCpaqcOF3GAuDXbEazU1wrr1651JhcwG1nOHdxZlvygdB04t89/1O/w1cDnyilFU=",
    channelSecret: 'cc851872c4bf659d2bed0d0a8fee7f19'
}

const client = new line.Client(config)


const value = ""

webhook.post('/webhook', line.middleware(config), async (req, res) => {

    res.send(req.body)

    Promise.all(req.body.events.map(handleReply))
        .then(() => res.end())
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });

})

const handleReply = (event) => {

    if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
        return console.log("Test hook recieved: " + JSON.stringify(event.message));
    }
    console.log(event);

    switch (event.type) {
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source);
                case 'location':
                    return handleLocation(message, event.replyToken);
                case 'sticker':
                    return handleSticker(message, event.replyToken);
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
        case 'postback':
            let data = event.postback.data;
            console.log(data);
            const buttonsImageURL = 'https://ak.picdn.net/shutterstock/videos/12523241/thumb/1.jpg'
            value = data
            switch (data) {

                case 'saleHome2m':
                   
                default:
                    break;
            }

        case 'beacon':
            return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    }

}