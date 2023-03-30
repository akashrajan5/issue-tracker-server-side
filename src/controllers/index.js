const { login } = require('./authController');
const { createIssue } = require('./issueController');
const { createProject } = require('./projectController');

module.exports = {
    login: login,
    project: createProject,
    issue: createIssue
};