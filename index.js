const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;//prasath_token

app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];


    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }

});

app.post("/webhook",(req,res)=>{ //i want some 

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body);

               axios({
                   method:"POST",
                   url:"https://graph.facebook.com/v19.0/"+phon_no_id+"/messages?access_token="+token,
                   data:{
                       messaging_product:"whatsapp",
                       to:from,
                       text:{
                           body:"Hi.. I'm Jovin, your message is "+msg_body
                       }
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

               });

               res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }

    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");
// require('dotenv').config();

// const token = process.env.TOKEN;
// const mytoken = process.env.MYTOKEN;

// const app = express().use(bodyParser.json());

// app.listen(process.env.PORT, () => {
//     console.log("Server started on port", process.env.PORT);
//     console.log("Creating webhook");
// });

// // Route for verifying webhook
// app.get("/webhook", (req, res) => {
//     const mode = req.query["hub.mode"];
//     const challenge = req.query["hub.challenge"];
//     const verifyToken = req.query["hub.verify_token"];

//     if (mode && verifyToken) {
//         if (mode === "subscribe" && verifyToken === mytoken) {
//             console.log("Webhook verified successfully");
//             res.status(200).send(challenge);
//         } else {
//             console.error("Failed to verify webhook: Invalid token");
//             res.sendStatus(403);
//         }
//     } else {
//         console.error("Failed to verify webhook: Missing parameters");
//         res.sendStatus(400);
//     }
// });

// // Route for receiving webhook events
// app.post("/webhook", (req, res) => {
//     console.log("Received webhook event:");
//     console.log(req.body, "hello");

//     const { entry } = req.body;
//     if (!entry || !entry[0] || !entry[0].changes || !entry[0].changes[0]) {
//         console.error("Invalid webhook event format");
//         return res.sendStatus(400);
//     }

//     const change = entry[0].changes[0];
//     if (!change.value || !change.value.messages || !change.value.messages[0]) {
//         console.error("No message found in webhook event");
//         return res.sendStatus(404);
//     }

//     const { metadata, messages } = change.value;
//     const { phone_number_id } = metadata;
//     const { from, text } = messages[0];
    
//     console.log("Phone number ID:", phone_number_id);
//     console.log("Sender:", from);
//     console.log("Message: h2", text.body);
//     //https://graph.facebook.com/v19.0/me/messages?access_token=${token}`
//     //`https://graph.facebook.com/v19.0/${phone_number_id}/messages?access_token=${token}`
      

//     axios.post(`https://graph.facebook.com/v19.0/${phone_number_id}/messages?access_token=${token}`, {
//         messaging_product: "whatsapp",
//         to: from,
//         text: { body: "Hello jovin"+ text.body }
//     })
//     .then(response => {
//         console.log("Message sent successfully");
//         res.sendStatus(200);
//     })
//     .catch(error => {
//         console.error("Failed to send message:", error.message);
//         res.sendStatus(500);
//     });
// });

// // Default route
// app.get("/", (req, res) => {
//     res.status(200).send("Hello, this is the webhook setup");
// });

