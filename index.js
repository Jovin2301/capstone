const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const token =process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

const app=express().use(body_parser.json());


app.listen(process.env.PORT, ()=>{
    console.log("HELLLLLOOOO JOVINNNN");
    console.log("creating webhook");
});

//to verify the callback url from dashboard side => cloud api side
app.get("/webhook", (req,res)=>{
    let mode= req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    
    if (mode && token){
        if (mode === "subcribe" && token === mytoken){
            res.status(200).send(challenge);
        }
        else{
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
                           body:"Hellooo jovinn"+msg_body
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


