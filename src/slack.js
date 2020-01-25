const axios = require('axios');

const { SLACK_WEBHOOK, SLACK_CHANNEL, SLACK_EMOJI } = process.env;

const sendSlackMessage = message => {
    if (SLACK_WEBHOOK && SLACK_CHANNEL) {
        return axios.post(SLACK_WEBHOOK, {
            username: 'JIRA',
            icon_emoji: SLACK_EMOJI || ':robot_face:',
            channel: SLACK_CHANNEL,
            text: message,
        });
    }
};

module.exports = { sendSlackMessage };
