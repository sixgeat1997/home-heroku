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
    console.log('POST: /');
    console.log('Body: ', req.body);
    //Create an instance
    const agent = new WebhookClient({
        request: req,
        response: res
    });
    //Test get value of WebhookClient
    console.log('agent ' + agent);
    console.log('agentVersion: ' + agent.agentVersion);
    console.log('intent: ' + agent.intent);
    console.log('locale: ' + agent.locale);
    console.log('query: ', agent.query);
    console.log('session: ', agent.session);
    console.log('req body qy'+ req.body.queryResult);
    console.log('req body '+ req.body);
    //Function Location
    function randomNumber(agent) {
        let startNumber = req.body.queryResult.parameters.startNumber
        let endNumber = req.body.queryResult.parameters.endNumber

        let result = parseInt(Math.random() * (endNumber - startNumber) + startNumber);

        agent.add(`Random number between ${startNumber} and ${endNumber} is ${result}`);
    }
    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Number', randomNumber);  // "Location" is once Intent Name of Dialogflow Agent
    agent.handleRequest(intentMap);
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