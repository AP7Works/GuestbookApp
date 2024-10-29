const express = require('express');
const fs = require('fs'); 
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/static', express.static(path.join(__dirname, 'public')));

// Temporary endpoint to list images
app.get('/list-images', (req, res) => {
    const imagesDir = path.join(__dirname, 'public', 'images');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading images directory');
        }
        res.json(files); // Return the list of files as JSON
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/guestbook', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'guestbook.html'));
});

app.get('/guestbook-data', (req, res) => {
  fs.readFile('./data/messages.json', 'utf-8', (err, data) => {
    if (err) throw err;
    const messages = JSON.parse(data);
    res.json(messages);
  });
});

app.get('/newmessage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'newmessage.html'));
});

app.post('/newmessage', (req, res) => {
  const { username, country, message } = req.body;
  const newMessage = { username, country, message, date: new Date().toISOString() };

  fs.readFile('./data/messages.json', 'utf-8', (err, data) => {
    if (err) throw err;
    const messages = JSON.parse(data);
    messages.push(newMessage);
    fs.writeFile('./data/messages.json', JSON.stringify(messages), (err) => {
      if (err) throw err;
      res.redirect('/guestbook');
    });
  });
});

app.get('/ajaxmessage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ajaxmessage.html'));
});

app.post('/ajaxmessage', (req, res) => {
    const { username, country, message } = req.body;
  
    // Server-side validation
    if (!username || !country || !message) {
      return res.status(400).json({ error: 'All fields are required!' });
    }
  
    const newMessage = { username, country, message, date: new Date().toISOString() };
  
    fs.readFile('./data/messages.json', 'utf-8', (err, data) => {
      if (err) throw err;
      const messages = JSON.parse(data);
      messages.push(newMessage);
      fs.writeFile('./data/messages.json', JSON.stringify(messages), (err) => {
        if (err) throw err;
        res.json(messages); // Send the updated messages back to the client
      });
    });
});
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
