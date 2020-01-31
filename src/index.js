#! /usr/bin/env node

require('dotenv').config();

const { executeQuery } = require('./jira');
const { buildBlocks, sendSlackMessage } = require('./slack');

(async () => {
    try {
        const result = await executeQuery();
        if (result.total > 0) {
            const blocks = buildBlocks(result);
            await sendSlackMessage(blocks);
        } else {
            console.log('No issues in query result');
        }
    } catch (err) {
        console.error(err);
    }
})();
