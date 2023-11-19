const express = require('express');
const mongoose=require('mongoose');
const path=require('path');
const Sign = require('./models/User.js');
const app = express();
const cors = require('cors'); 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(__dirname + '/../frontend/public'));
app.use(express.static(path.join(__dirname, '../frontend/src')));
app.use(cors());


const PORT=5500;
mongoose.connect("mongodb://127.0.0.1:27017/Chords",{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
})
.catch((err)=>console.log(err));




app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send('Empty credentials');
        return;
    }

    const existingUser = await Sign.findOne({ username });
    if (existingUser) {
        res.status(400).send('Username already in use');
    } else {
        const newSign = new Sign({ username, password });
        try {
            await newSign.save();
            res.status(201).send('User registered successfully!');
            
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).send('Registration failed');
        }
}
});
app.post('/saveAccessToken', async (req, res) => {
    const { username, accessToken } = req.body;
    console.log('Received data:', username, accessToken); // Log the data for debugging

    try {
        await Sign.updateOne({ username }, { spotifyAccessToken: accessToken });

        res.status(200).send('Access token saved successfully');
    } catch (error) {
        console.error('Error saving access token:', error);
        res.status(500).send('Internal server error');
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await Sign.findOne({ username });

    if (existingUser) {
        if (existingUser.password === password) {
            res.status(200).send('Login successful');
        } else {
            res.status(400).send('Incorrect password');

        }
    } else {
        res.status(404).send('User does not exist');
    }
});