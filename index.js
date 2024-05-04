const express = require("express");
const body_parser = require("body-parser");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

const app=express().use(body_parser.json());


app.listen(8000 || process.env.PORT, ()=>{
    console.log("HELLLLLOOOO JOVINNNN");
    console.log("creating webhook");
});

//to verify the callback url from dasboard side => cloud api side
app.get("/webhook", (req, res)=>{
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

app.post("/webhook", (req,res)=>{
    let body_para = req.body;

    console.log(JSON.stringify(body_para, null, 2));

    if (body_para.object){
        if(body_para.entry && 
            body_para.entry[0].changes && 
            body_para.entry[0].changes[0].value.messages &&
            body_para.entry[0].changes[0].value.messages[0] 
            ){
                let phone_num_id = body.entry[0].changes[0].value.metadata.phone_number_id; //getting the phonee_number_id
                let from = body.entry[0].changes[0].value.messages[0].from;
                let msg_body = body.entry[0].changes[0].value.messages[0].text.body;
                
                axios({
                    method: "POST",
                    url: "https://graph.facebook.com/v19.0/"+phone_num_id+"/messages?access_token="+token, 
                    data:{
                        messaging_product:"whatsapp",
                        to:from,
                        text:{
                            body:"HELLLLO JOVIN"
                        }   
                    },
                    headers:{
                        "Content-Type":"application/json"
                    }
                });
                res.sendStatus(200);
            }
            else{
                res.sendStatus(404); //not found
            }       
        } 
    }
)
