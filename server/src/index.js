require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const importLogRoute = require('./routes/importLogsRoute');
const { fetchJobsFromFeed } = require('./controllers/fetchJobs');

const app = express();
app.use(cors())
app.use(express.json());
//app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 5000;


app.use('/api/import-logs', importLogRoute);

//Connect to DB before starting the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

const feedUrls = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm'
];


// Cron Job - runs every 1 hour '0 * * * *'
// */3 * * * *
cron.schedule('*/100 * * * *', async()=>{
  console.log('⏰ Cron running every 1 hour');
  console.log('Starting cron job import\n');

    for (const url of feedUrls) {
    console.log(`Fetching from: ${url}`);
    const { total } = await fetchJobsFromFeed(url);
    console.log(`Jobs fetched from ${url}: ${total}`);
  }

  console.log('All feeds processed.\n');
})


