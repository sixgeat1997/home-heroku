// const express = require('express'),
//     webhook = express.Router(),
//     request = require('request'),
//     // { WebhookClient } = require('dialogflow-fulfillment')


// webhook.route('/webhook')
//     .get((req, res) => {
//         res.send("1234")

//     })
//     .post((req, res) => {
//         const agent = new WebhookClient({
//             request: req,
//             response: res
//         });

//         console.log('agentVersion: ' + agent.agentVersion);
//         console.log('intent: ' + agent.intent);
//         console.log('locale: ' + agent.locale);
//         console.log('query: ', agent.query);
//         console.log('session: ', agent.session);

//         function location(agent) {
//             agent.add('Welcome to Thailand.');
//         }

//         // Run the proper function handler based on the matched Dialogflow intent name
//         let intentMap = new Map();
//         intentMap.set('Location', location);  // "Location" is once Intent Name of Dialogflow Agent
//         agent.handleRequest(intentMap);
//     })




// module.exports = webhook