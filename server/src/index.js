require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const importLogRoute = require('./routes/importLogsRoute');
const { fetchJobsFromFeed } = require('./controllers/fetchJobs');
const feedUrls = require('./config/feedUrls')

const app = express();
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.use('/api/import-logs', importLogRoute);

//Connect to DB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});


// Cron Job - runs every 1 hour '0 * * * *'
// */3 * * * *
cron.schedule('0 0 * * *', async()=>{
  console.log('Cron running every 1 hour');
  console.log('Starting cron job import\n');

    for (const url of feedUrls) {
    const { total } = await fetchJobsFromFeed(url);
    console.log(`Jobs fetched from ${url}: ${total}`);
  }

  console.log('All feeds processed.\n');
})


