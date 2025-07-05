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

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Worker Db connected with Redis"))
.catch(err => console.error("Db connection with Redis error:", err));

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
            const hasChanged =
                existing.title !== jobData.title ||
                existing.company !== jobData.company ||
                existing.location !== jobData.location ||
                existing.description !== jobData.description;

            if (hasChanged) {
                await Job.updateOne({ guid: jobData.guid }, jobData);
                importStats[fileName].updated++;
            }
        } else {
            await Job.create(jobData);
            importStats[fileName].new++;
        }

    } catch (error) {
        importStats[fileName].failed++;
        importStats[fileName].failedJobs.push({
            guid: typeof data.guid === 'object' ? data.guid._ : data.guid || 'N/A',
            reason: error.message
        });
    }


}, redisConfig);


// Log results only once after all jobs in the queue are processed
worker.on('drained', async () => {
    console.log("📦 Queue drained — writing import logs...");

    for (const log of Object.values(importStats)) {
        log.importedAt = new Date(); // Optional timestamp for frontend use
        await ImportLog.create(log);
    }

    importStats = {};
    console.log("✅ All logs saved.");
});

// worker.on('completed', async () => {
//     for (const log of Object.values(importStats)) {
//         await ImportLog.create(log);
//     }
//     importStats = {};
// })