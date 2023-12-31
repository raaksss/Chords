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

async function fetchProfile(token) {
    try {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!result.ok) {
            const errorText = await result.text();
            console.error('Error Response Body:', errorText);

            // Check if the response is valid JSON
            try {
                JSON.parse(errorText);
            } catch (jsonError) {
                console.error('JSON Parsing Error:', jsonError);
            }

            throw new Error(`Failed to fetch profile. Status: ${result.status}`);
        }

        return await result.json();
    } catch (error) {
        console.error('Error fetching Spotify profile:', error.message);
        throw error; // Propagate the error to the calling function
    }
}

const validateSpotifyToken = async (req, res) => {
    const { username } = req.body;
    console.log(username)

    try {
        const user = await Sign.findOne({ username });
        console.log(user)
        if (user && user.spotifyAccessToken) {
            const accessToken = user.spotifyAccessToken;
            console.log('Access Token:', accessToken); // Move this line here
            const profile = await fetchProfile(accessToken);
            console.log('Sending response:', { profile, accessToken, username });
            res.status(200).json({ profile, accessToken, username });
        } else {
            res.status(401).send('Invalid Spotify access token');
        }
    } catch (error) {
        console.error('Error during token validation:', error);

        // Log the specific error message
        console.error('Error Message:', error.message);

        // Handle different error scenarios
        if (error.name === 'SyntaxError') {
            res.status(500).send('Error parsing Spotify API response');
        } else {
            res.status(500).send('Error during token validation');
        }
    }
};
const PORT=5000;
mongoose.connect("mongodb://127.0.0.1:27017/Chords",{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
})
.catch((err)=>console.log(err));

app.post('/validateSpotifyToken', validateSpotifyToken);

app.post('/signup', async (req, res) => {
    const { username, password, spotifyAccessToken } = req.body;

    if (!username || !password || !spotifyAccessToken) {
        res.status(400).send('Empty credentials');
        return;
    }

    const existingUser = await Sign.findOne({ username });
    if (existingUser) {
        res.status(400).send('Username already in use');
    } else {
        const newSign = new Sign({ username, password, spotifyAccessToken });
        try {
            await newSign.save();
            res.status(201).send('User registered successfully!');
            
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).send('Registration failed');
        }
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