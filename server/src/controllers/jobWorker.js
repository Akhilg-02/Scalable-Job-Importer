require('dotenv').config();
const mongoose = require('mongoose');
const { Worker } = require('bullmq');
const Job = require('../models/jobModel');
const ImportLog = require('../models/importLogModel');

const redisConfig = {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    },

};

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Worker Db connected with Redis"));

let importStats = {};

const worker = new Worker('job-import-queue', async job => {
    const data = job.data;
    const fileName = data.source;

    if (!importStats[fileName]) {
        importStats[fileName] = {
            fileName,
            total: 0,
            new: 0,
            updated: 0,
            failed: 0,
            failedJobs: [],
        }
    }

    importStats[fileName].total++;


    try {

        const jobData = {
            ...data,
            guid: typeof data.guid === 'object' ? data.guid._ : data.guid,
        };

        const existing = await Job.findOne({ guid: jobData.guid });

        if (existing) {
            await Job.updateOne({ guid: jobData.guid }, jobData);
            importStats[fileName].updated++;
        } else {
            await Job.create(jobData);
            importStats[fileName].new++;
        }

        //---------------------------------------------------------
        // const existing = await Job.findOne({ guid: data.guid });

        // if (existing) {
        //     await Job.updateOne({ guid: data.guid }, data);
        //     importStats[fileName].updated++;
        // }
        // else {
        //     await Job.create(data);
        //     importStats[fileName].new++;
        // }
    } catch (error) {
        importStats[fileName].failed++;
        importStats[fileName].failedJobs.push({
            // guid: typeof data.guid === 'object' ? JSON.stringify(data.guid) : data.guid || 'N/A',
            guid: typeof data.guid === 'object' ? data.guid._ : data.guid || 'N/A',
            reason: error.message
        });

    }


}, redisConfig);


worker.on('completed', async () => {
    for (const log of Object.values(importStats)) {
        await ImportLog.create(log);
    }
    importStats = {};
})