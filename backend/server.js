const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import CORS
const app = express();
const PORT = 3000;

// Middleware to parse JSON from requests
app.use(cors());
app.use(express.json());

//Endpoint to add mood and date
app.post('/moods',(req,res) => {
    const {mood,date,time} = req.body;
    console.log(req.body);
    console.log('Received mood date time:',mood,date,time);
    
    if (!mood || !date){
        return res.status(400).json({error:"Mood or date missing"});
    }
    // Read existing moods from file
    let moods = {};
    if (fs.existsSync('moods.json')){
        moods = JSON.parse(fs.readFileSync('moods.json'))
    }
    
    // If date exists add to today's date
    if (moods[date]){
        moods[date].push({mood,time});
    } else { //add new entry for new date
        moods[date] = [{mood,time}];
    }

    // Save back to moods.json
    fs.writeFileSync('moods.json',JSON.stringify(moods,null,2));

    res.json({message: 'Your mood is saved with me'})
});

// Endpoint to get moods grouped by date
app.get('/moods',(req,res) => {
    let moods = {};
    if (fs.existsSync('moods.json')){
        moods = JSON.parse(fs.readFileSync('moods.json'));
    }
    res.json(moods); // Send stored moods as a response
});

app.listen(PORT,() => {
    console.log('Server running on http://localhost:${PORT}');
});