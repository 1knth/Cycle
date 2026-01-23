require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

//middleware
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


//Mongodb config
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL).then(() => console.log('connected to db'))
.catch((err) => console.error('connection error:', err));

app.get('/api/transactions/add', (req, res) => {
  console.log('transaction data: ', req.body);
  res.status(200).json({
      status: "Success",
      message: "Server received the transaction!"
  });
});

require('./routes/transactionRoutes.js')(app);

