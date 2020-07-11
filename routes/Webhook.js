
const express = require('express'),
    webhook = express.Router(),
    request = require('request'),
    line = require('@line/bot-sdk'),
    Home = require('../model/Home'),
    findDistance = require('../model/findDistance')






const config = {
    channelAccessToken: "KF435sOwdUpGPvW5jHapfL3VKuV4qmCyN9sNrWC+JXWAt/Mcf2BBxkR3cq0+Lo4fPZZM4LclJgMTRllFbW8IRlZasmGHQQGgAyIoWxpFwZkmCpaqcOF3GAuDXbEazU1wrr1651JhcwG1nOHdxZlvygdB04t89/1O/w1cDnyilFU=",
    channelSecret: 'cc851872c4bf659d2bed0d0a8fee7f19'
}

const client = new line.Client(config)


var value = ""

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
                case 'image':
                    return handleImage(message, event.replyToken);
                case 'video':
                    return handleVideo(message, event.replyToken);
                case 'audio':
                    return handleAudio(message, event.replyToken);
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

            if (data) {
                return client.replyMessage(event.replyToken,
                    {
                        type: 'text',
                        text: "ส่ง location ที่คุณต้องการค้นหา",
                        quickReply: {
                            items: [
                                {
                                    "type": "action", // ④
                                    "action": {
                                        "type": "location",
                                        "label": "Send location"
                                    }
                                }
                            ]
                        }
                    }
                )
            }


        case 'beacon':
            return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    }

}

const replyText = (token, texts) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
        token,
        {
            type: 'text',
            text: "ระบุข้อมความไม่ถูกต้อง",
            quickReply: {
                items: [
                    {
                        type: "action", // ③
                        // imageUrl: "https://example.com/sushi.png",
                        action: {
                            type: "message",
                            label: "testlocal",
                            text: `${value}`
                        }
                    },
                    {
                        "type": "action", // ④
                        "action": {
                            "type": "location",
                            "label": "Send location"
                        }
                    }
                ]
            }
        });
};


const handleText = async (message, replyToken, source) => {
    // const text = await aimlInterpreter.findAnswerInLoadedAIMLFiles(message, (answer, wildCardArray, input) => {
    //     console.log(answer);
    //     // return answer
    // })



    const buttonsImageURL = 'https://ak.picdn.net/shutterstock/videos/12523241/thumb/1.jpg'

    switch (message.text) {
        case 'ค้นหา':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a carousel template",
                    "template": {
                        "type": "carousel",
                        "actions": [],
                        "columns": [
                            {
                                "thumbnailImageUrl": "https://i.pinimg.com/564x/30/c6/7c/30c67c7ff258d37360d35585265badc0.jpg",
                                "text": "บ้าน",
                                "actions": [
                                    {
                                        "type": "message",
                                        "label": "ซื้อบ้าน",
                                        "text": "ซื้อบ้าน"
                                    },
                                    {
                                        "type": "message",
                                        "label": "เช่าบ้าน",
                                        "text": "เช่าบ้าน"
                                    }
                                ]
                            },
                            {
                                "thumbnailImageUrl": "https://i.pinimg.com/564x/43/75/6d/43756d6c0e4b6cab5a4681c4b807529f.jpg",
                                "text": "คอนโด",
                                "actions": [
                                    {
                                        "type": "message",
                                        "label": "ซื้อคอนโด",
                                        "text": "ซื้อคอนโด"
                                    },
                                    {
                                        "type": "message",
                                        "label": "เช่าคอนโด",
                                        "text": "เช่าคอนโด"
                                    }
                                ]
                            }
                        ]
                    }
                }
            )
        case "ซื้อบ้าน":
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 2 ล้านบาท",
                                "data": "saleHome2m"
                            },
                            {
                                "type": "postback",
                                "label": "2 ล้านบาท - 5 ล้านบาท",
                                "data": "saleHome2m5m"
                            },
                            {
                                "type": "postback",
                                "label": "5 ล้านบาท - 10 ล้านบาท",
                                "data": "saleHome5m10m"
                            },
                            {
                                "type": "postback",
                                "label": "10 ล้านบาทขึ้นไป",
                                "data": "saleHome10m"
                            }
                        ],
                        "title": "ซื้อบ้าน",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )
        case 'เช่าบ้าน':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 5,000 บาท",
                                "data": "rentHome5"
                            },
                            {
                                "type": "postback",
                                "label": "5,001 - 10,000 บาท",
                                "data": "rentHome510"
                            },
                            {
                                "type": "postback",
                                "label": "10,001 - 30,000 บาท",
                                "data": "rentHome1030"
                            },
                            {
                                "type": "postback",
                                "label": "30,001 บาทขึ้นไป",
                                "data": "rentHome3"
                            }
                        ],
                        "title": "เช่าบ้าน",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )
        case 'ซื้อคอนโด':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 2 ล้านบาท",
                                "data": "saleCondo2m"
                            },
                            {
                                "type": "postback",
                                "label": "2 ล้านบาท - 5 ล้านบาท",
                                "data": "saleCondo2m5m"
                            },
                            {
                                "type": "postback",
                                "label": "5 ล้านบาท - 10 ล้านบาท",
                                "data": "saleCondo5m10m"
                            },
                            {
                                "type": "postback",
                                "label": "10 ล้านบาทขึ้นไป",
                                "data": "saleCondo10m"
                            }
                        ],
                        "title": "ซื้อคอนโด",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )
        case 'เช่าคอนโด':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 5,000 บาท",
                                "data": "rentCondo5"
                            },
                            {
                                "type": "postback",
                                "label": "5,001 - 10,000 บาท",
                                "data": "rentCondo510"
                            },
                            {
                                "type": "postback",
                                "label": "10,001 - 30,000 บาท",
                                "data": "rentCondo1030"
                            },
                            {
                                "type": "postback",
                                "label": "30,001 บาทขึ้นไป",
                                "data": "rentCondo3"
                            }
                        ],
                        "title": "เช่าคอนโด",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )

        default:
            console.log(`Echo message to ${replyToken}: ${message.text}`);
            return replyText(replyToken, message.text);
    }

}

const handleLocation = async (message, replyToken) => {
    console.log(value);
    console.log(message);
    const homes = await Home.find()

    var GPS = function (lat, lnt) {
        this.latitude = lat || 0;
        this.longitude = lnt || 0;
    };

    const newHome = homes.filter((item) => {
        var gps1 = new GPS(+latitude, +longitude);
        var gps2 = new GPS(+item.latitude, +item.longitude);


        distance = findDistance(gps1, gps2)
        distance = distance - 10980000
        console.log(distance);

        if (distance < 5000)
            return item
        // nearby.push(item)
    })

    console.log(newHome);

    if (value == 'saleHome2m') {
        var thishome = findHome(0, 2000000, house, sale)
    } else if (value == 'saleHome2m5m') {

    } else if (value == 'saleHome5m10m') {

    } else if (value == 'saleHome10m') {

    }




}

const findHome = async (fprice, eprice, category, type) => {

    const price = homes.filter(item => {
        if (item.price >= +fprice && item.price <= +eprice)
            return item
    })
    console.log(price);

    const ttype = price.filter(item => {
        if (item.type == type)
            return item
    })
    console.log(ttype);

    const okhome = ttype.filter(item => {
        if (item.category == category)
            return item
    })


}

const handleSticker = (message, replyToken) => {

}

const handleAudio = (message, replyToken) => {

}

function handleImage(message, replyToken) {
    let getContent;
    if (message.contentProvider.type === "line") {
        const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.jpg`);
        const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);

        getContent = downloadContent(message.id, downloadPath)
            .then((downloadPath) => {
                // ImageMagick is needed here to run 'convert'
                // Please consider about security and performance by yourself
                cp.execSync(`convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`);

                return {
                    originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
                    previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
                };
            });
    } else if (message.contentProvider.type === "external") {
        getContent = Promise.resolve(message.contentProvider);
    }

    return getContent
        .then(({ originalContentUrl, previewImageUrl }) => {
            return client.replyMessage(
                replyToken,
                {
                    type: 'image',
                    originalContentUrl,
                    previewImageUrl,
                }
            );
        });
}


function downloadContent(messageId, downloadPath) {
    return client.getMessageContent(messageId)
        .then((stream) => new Promise((resolve, reject) => {
            const writable = fs.createWriteStream(downloadPath);
            stream.pipe(writable);
            stream.on('end', () => resolve(downloadPath));
            stream.on('error', reject);
        }));
}


module.exports = webhook