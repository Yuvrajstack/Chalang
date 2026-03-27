const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let opportunities = []; // in-memory database

// GET all opportunities
app.get('/opportunities', (req, res) => {
    res.json(opportunities);
});

// ADD opportunity
app.post('/opportunities', (req, res) => {
    const { title, description, link } = req.body;

    const newOpportunity = {
        id: Date.now(),
        title,
        description,
        link
    };

    opportunities.push(newOpportunity);
    res.json(newOpportunity);
});

// DELETE opportunity
app.delete('/opportunities/:id', (req, res) => {
    const id = parseInt(req.params.id);
    opportunities = opportunities.filter(op => op.id !== id);
    res.json({ message: "Deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});