const express = require('express');
const router = express.Router();
const project = require('../controllers/projectController');

router.get('/list-all-project', project.listAllProject);

router.post('/create-project', project.createProject);

router.get('/project-id', project.projectById);

router.post('/close-project', project.closeProject);

router.post('/search-project', project.searchProject);


module.exports = router;