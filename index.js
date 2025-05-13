const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});

const PORT = process.env.PORT || 3000;
const TOPICs_FILE = path.join(__dirname, 'topic-api/data/data.JSON');

app.get('/topic-api/data', async (req, res) => {
    console.log('Received request with query:', req.query);
    const searchQuery = req.query.search;
    
  
    if (!searchQuery || typeof searchQuery !== 'string') {
        return res.status(400).json({ 
            error: "Missing or invalid 'search' query parameter" 
        });
    }

    try {
       
        console.log('Reading file from:', TOPICs_FILE);
        const data = await fs.readFile(TOPICs_FILE, 'utf-8');
        console.log('File content length:', data.length);
        let topics;
        
        try {
            topics = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ 
                error: "Error parsing topics data" 
            });
        }

        
        const filtered = topics.filter(topic => 
            topic.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        console.log('Filtered results:', filtered.length, 'matches');

        return res.status(200).json(filtered);

    } catch (error) {
        console.error('Error reading topics file:', error);
        return res.status(500).json({ 
            error: "Error reading topics data" 
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});