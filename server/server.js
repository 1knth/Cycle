require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Mongodb config
const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  console.error("No DB_URL found in .env file");
}

mongoose.connect(DB_URL)
  .then(() => {
    console.log('mongodb is connected');
  })
  .catch((err) => {
    console.error('mongodb connection error:', err);
  });

require('./routes/transaction.routes.js')(app);
require('./routes/auth.routes.js')(app);
require('./routes/link.routes.js')(app);
require('./routes/user.routes.js')(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\n`);
});
