import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { config } from 'dotenv'

config()

const API_KEY = process.env.API_KEY
const app = express()

app.use(cors())
app.use(express.json())

app.post('/completions', async(req,res)=>{
    const options = {
        method : "POST",
        headers : {
            "Authorization":`Bearer ${API_KEY}`,
            "Content-Type" : "application/json"
        },
        body :  JSON.stringify({
            model : "gpt-3.5-turbo",
            messages : [{role : "user", content:req.body.message}],
           max_tokens : 100, 
        })
    }
    try{
       const response = await fetch('https://api.openai.com/v1/chat/completions', options)
       const data = await response.json()
       res.send(data)
    }
    catch(err){
        console.error(err)
    }
})


app.listen(3000, ()=>{console.log("listening!")})