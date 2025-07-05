const express = require('express');
const router = express.Router();
const ImportLog = require('../models/importLogModel');

router.get('/', async(req, res)=>{
    const logs = await ImportLog.find().sort({importDateTime: -1});
    res.json(logs);
})

module.exports = router;