
'use strict';

const express = require('express'),
    webhook = express.Router(),
    request = require('request'),
    dotenv = require('dotenv'),
    line = require('@line/bot-sdk')
// Client = require('@line/bot-sdk').Client


const config = {
    channelAccessToken: "4mG2jaXyVc051Qvea3d/0rW2Zl/BYSHTOODFFDL/7zvd4oOleuV0vEmFmKTkr+kDPZZM4LclJgMTRllFbW8IRlZasmGHQQGgAyIoWxpFwZmBKQ4vpW6DJ8nvwG4iVNAyjTrvzyqTtbVl/SI3hi6TLgdB04t89/1O/w1cDnyilFU=",
    channelSecret: '7ccb68196e4fb80c7fa34141d703f895'
};


const userId = "Ua4f60ce918b0c04ed9167ca230848173"
const client = new line.Client(config)

webhook.post('/webhook', (req, res) => {
    // console.log(req.body);

    // client.pushMessage(userId, { type: "text", text: 'sdas' })
    var text = req.body.events[0].message.text
    var sender = req.body.events[0].source.userId
    var replyToken = req.body.events[0].replyToken
    console.log(text, sender, replyToken)
    console.log(typeof sender, typeof text)
    // console.log(req.body.events[0])
    if (text === 'สวัสดี' || text === 'Hello' || text === 'hello') {
        sendText(sender, text)
    }
    res.sendStatus(200)
})


function sendText(sender, text) {
    let data = {
        to: sender,
        messages: [
            {
                type: 'text',
                text: 'สวัสดีค่ะ เราเป็นผู้ช่วยปรึกษาด้านความรัก สำหรับหมามิ้น 💞'
            }
        ]
    }
    request({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer key Api'
        },
        url: 'https://api.line.me/v2/bot/message/push',
        method: 'POST',
        body: data,
        json: true
    }, function (err, res, body) {
        if (err) console.log('error')
        if (res) console.log('success')
        if (body) console.log(body)
    })
}




module.exports = webhook