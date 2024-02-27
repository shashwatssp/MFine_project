const express = require('express')
const mongoose = require('mongoose');
const Medicine = require('./models/medicine_model.js');
const OpenAI = require("openai")
const app = express();
app.use(express.json());


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.send('Hello from  API');
});

mongoose.connect("mongodb+srv://shashwatshagunpandey:pvo3aKq6bYYprUmL@cluster0.bmocauf.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((error) => {
        console.log("Connection failed! Error: ", error);
    });



// First API ---------------------------------------------------------

app.post('/api/upload', async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Second API ---------------------------------------------------------
app.get('/api/search', async (req, res) => {
    try {
        var medicine_name = req.body.query;
        const medicines = await Medicine.find({

            "name": { $regex: ".*" + medicine_name + ".*", $options: "i" }

        });
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Third API ---------------------------------------------------------
const openai = new OpenAI({
    apiKey: "WILL-NOT-REVEAL"
})

app.get('/api/info', async (req, res) => {
    try {
        var medicine_name = req.body.query;
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You have to tell me in brief about the medicine which I am going to enter.' }, { role: 'user', content: medicine_name }],
            max_tokens: 100,
        });

        console.log(response.choices[0].message.content);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

