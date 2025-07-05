const axios = require('axios');
const xml2js = require('xml2js');
const { Queue } = require('bullmq');

const redisConfig = {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    },

};


const jobQueue = new Queue('job-import-queue', redisConfig);


const fetchJobsFromFeed = async (url) => {
    try {
        const response = await axios.get(url);
        const json = await xml2js.parseStringPromise(response.data, { explicitArray: false });
        const jobItems = json?.rss?.channel?.item || [];

        const jobs = Array.isArray(jobItems) ? jobItems : [jobItems];

        for (const job of jobs) {
            const jobData = {
                guid: job.guid || job.link,
                title: job.title,
                company: job['job:company'] || '',
                location: job['job:location'] || '',
                description: job.description,
                pubDate: new Date(job.pubDate),
                link: job.link,
                source: url,
            }

            await jobQueue.add('importJob', jobData);
        }

        return { total: jobs.length };
    } catch (error) {
        console.error(`Error fetching from ${url}`, error.message);
        return { total: 0 };
    }
}

module.exports = { fetchJobsFromFeed };