import express from 'express';
import * as dotenv from "dotenv";
import cors from "cors";
import { OpenAIApi,Configuration  } from "openai";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send({
        message:"Welcome to BlackGPT"
    });
});

app.post("/", async(req, res) => {
    try{
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.4,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot : response.data.choices[0].text
        })
    }catch(err){
       console.log(err.response.statusText);
       res.status(500).send(err.response.statusText);
    }
})


app.listen(5000,console.log("running server on port 5000"));