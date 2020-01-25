require('dotenv').config();

const { executeQuery } = require('./jira');
const { sendSlackMessage } = require('./slack');
const { JIRA_QUERY_NAME, JIRA_HOST } = process.env;

const getIssueUrl = issueKey => `${JIRA_HOST}/browse/${issueKey}`;

(async () => {
    try {
        const result = await executeQuery();
        let message = `JIRA query executed: ${JIRA_QUERY_NAME}\n`;
        message += `Total number of issues: ${result.total}\n\n`;
        result.issues.forEach(issue => {
            const link = `<${getIssueUrl(issue.key)}|${issue.key}>`;
            message += `${link} | ${issue.status} | ${issue.summary}\n`;
        });

        await sendSlackMessage(message);
    } catch (err) {
        console.error(err);
    }
})();
