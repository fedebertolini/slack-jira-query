const axios = require('axios');

const {
    SLACK_WEBHOOK,
    SLACK_CHANNEL,
    SLACK_EMOJI,
    JIRA_QUERY_NAME,
    JIRA_HOST,
    JIRA_QUERY,
    MAX_ISSUES,
} = process.env;

const sendSlackMessage = (blocks) => {
    if (SLACK_WEBHOOK && SLACK_CHANNEL) {
        return axios.post(SLACK_WEBHOOK, {
            username: 'JIRA',
            icon_emoji: SLACK_EMOJI || ':robot_face:',
            channel: SLACK_CHANNEL,
            text: '',
            blocks,
        });
    }
};

const getDividerBlock = () => ({
    type: 'divider',
});

const getHeaderBlock = () => ({
    type: 'section',
    text: {
        type: 'mrkdwn',
        text: `*${JIRA_QUERY_NAME}*`,
    },
});

const getMaxIssues = () => {
    if (MAX_ISSUES && MAX_ISSUES <= 20) {
        return MAX_ISSUES;
    }
    return 5;
};

const getShownIssuesContextBlock = (totalIssues, maxIssues) => ({
    type: 'context',
    elements: [
        {
            type: 'mrkdwn',
            text: `:warning: showing *${maxIssues}* of a total of *${totalIssues}* tickets`,
        },
    ],
});

const getIssueUrl = (issueKey) => `${JIRA_HOST}/browse/${issueKey}`;

const getIssueBlock = (issue) => {
    const link = `<${getIssueUrl(issue.key)}|${issue.key}>`;
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `[${link}] *${issue.fields.summary}*\n`,
        },
    };
};

const getUnixTimestamp = (date) => Math.round(date.getTime() / 1000);

const getIssueContextBlock = (issue) => {
    const createdTs = getUnixTimestamp(new Date(issue.fields.created));
    const updatedTs = getUnixTimestamp(new Date(issue.fields.updated));
    const assignedTo = issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned';

    return {
        type: 'context',
        elements: [
            {
                type: 'mrkdwn',
                text: `Status: *${issue.fields.status.name}*`,
            },
            {
                type: 'mrkdwn',
                text: `Created: *<!date^${createdTs}^{date_short_pretty}| >*`,
            },
            {
                type: 'mrkdwn',
                text: `Updated: *<!date^${updatedTs}^{date_short_pretty}| >*`,
            },
            {
                type: 'mrkdwn',
                text: `Assigned to: *${assignedTo}*`,
            },
        ],
    };
};

const getViewAllUrl = () => `${JIRA_HOST}/issues/?jql=${encodeURIComponent(JIRA_QUERY)}`;

const getViewAllBlock = () => ({
    type: 'actions',
    elements: [
        {
            type: 'button',
            text: {
                type: 'plain_text',
                text: 'View All',
            },
            url: getViewAllUrl(),
        },
    ],
});

const buildBlocks = ({ total, issues }) => {
    const blocks = [getHeaderBlock()];
    const maxIssues = getMaxIssues();

    if (total > maxIssues) {
        blocks.push(getShownIssuesContextBlock(total, maxIssues));
    }

    for (let i = 0; i < Math.min(maxIssues, issues.length); i++) {
        const issue = issues[i];

        blocks.push(getDividerBlock());
        blocks.push(getIssueBlock(issue));
        blocks.push(getIssueContextBlock(issue));
    }

    if (total > maxIssues) {
        blocks.push(getViewAllBlock());
    }

    return blocks;
};

module.exports = { sendSlackMessage, buildBlocks };
