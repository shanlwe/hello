const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import CORS
const app = express();
const PORT = 3000;

// Middleware to parse JSON from requests
app.use(cors());
app.use(express.json());

//Endpoint to save moods
app.post('/moods',(req,res) => {
    const newMood = req.body.mood;

    // Read existing moods
    let moods = [];
    if (fs.existsSync('moods.json')){
        moods = JSON.parse(fs.readFileSync('moods.json'))
    }

    // Add new mood
    moods.push(newMood);

    // Save back to moods.json
    fs.writeFileSync('moods.json',JSON.stringify(moods,null,2));

    res.send({message: 'Your mood is saved with me'})
});

// Endpoint to get moods 
app.get('/moods',(req,res) => {
    let moods = [];
    if (fs.existsSync('moods.json')){
        moods = JSON.parse(fs.readFileSync('moods.json'));
    }
    res.json(moods); // Send stored moods as a response
});

app.listen(PORT,() => {
    console.log('Server running on http://localhost:${PORT}');
});