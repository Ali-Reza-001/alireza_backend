
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'data', 'logs.jsonl');

const logs = async (req, res, next) => {
    const rawData = await fs.readFileSync(logFilePath, 'utf-8');
    const data = rawData.trim().split(/(?<=})\s+/).map((line) => JSON.parse(line));
    res.send(data);

    next();
};

module.exports = logs;