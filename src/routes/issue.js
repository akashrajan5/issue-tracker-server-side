const express = require('express');
const router = express.Router();
const issue = require('../controllers/issueController');

router.post('/create-issue', issue.createIssue);

router.post('/list-issue', issue.listIssue);

router.post('/close-issue', issue.closeIssue);

module.exports = router;