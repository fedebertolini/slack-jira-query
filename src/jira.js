const axios = require('axios');

const { JIRA_API_KEY, JIRA_QUERY, JIRA_USERNAME, JIRA_HOST } = process.env;

const executeQuery = async () => {
    const result = await axios({
        url: `${JIRA_HOST}/rest/api/2/search`,
        method: 'GET',
        params: {
            jql: JIRA_QUERY,
        },
        auth: {
            username: JIRA_USERNAME,
            password: JIRA_API_KEY,
        },
    });

    return result.data;
};

module.exports = { executeQuery };
