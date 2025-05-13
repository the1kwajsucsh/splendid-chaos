require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const musicRoutes = require('./routes/music');

const app = express();
app.use(express.json()); // Parses incoming JSON requests
app.use(cors());

const PORT = process.env.PORT || 5000;

// Use the music routes
app.use('/music', musicRoutes);

// Root route
app.use('/', (req, res) => {
  res.send('Server is running.');
});

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));