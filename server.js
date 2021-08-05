const path = require('path');
const fs = require('fs');

const express = require('express');

const jsNotes = 
[
  // {
  //     title:"Test Title",
  //     text:"Test text"
  // }
];

const PORT = process.env.PORT || 3001;
const app = express();
// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Use apiRoutes
// app.use('/api', apiRoutes);
// app.use('/', htmlRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  
  fs.readFile("./db/db.json", "utf8", function(error, jsNotes) {

    if (error) {
      return console.log(error);
    }
    
    console.log(JSON.parse(jsNotes));
    return res.json(JSON.parse(jsNotes));  
    });
  
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
