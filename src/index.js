#! /usr/bin/env node

require('dotenv').config();

const { executeQuery } = require('./jira');
const { buildBlocks, sendSlackMessage } = require('./slack');

(async () => {
    try {
        const result = await executeQuery();
        const blocks = buildBlocks(result);
        await sendSlackMessage(blocks);
    } catch (err) {
        console.error(err);
    }
})();
