const { QueryTypes } = require("sequelize");
const db = require("../config/sqlConfig");


const createProject = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { projectname, description } = req.body;
        const nameExists = await db.sequelize.query('SELECT * FROM projects_list WHERE project_name = ?',
            {
                replacements: [projectname],
                type: QueryTypes.SELECT
            }
        );
        if (nameExists.length > 0) throw { custom: true, status: 409, error: { message: "Project name already exists" } };
        const [results, metadata] = await db.sequelize.query("INSERT INTO projects_list (project_name, description) VALUES (?, ?)",
            {
                raw: true,
                replacements: [projectname, description],
                type: QueryTypes.INSERT,
                transaction: t
            });
        if (metadata === 1) await t.commit();
        res.status(201).json({ status: 201, projectId: results, name: projectname });
    } catch (err) {
        await t.rollback();
        console.log(err);
        "custom" in err ? res.status(err.status).json(err) : res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

const listAllProject = async (req, res) => {
    try {
        const projectList = await db.sequelize.query('SELECT projects_list.id, project_name, description, status, (select count(*) from issue_list where projects_list.id = issue_list.project_id AND issue_list.status = "new" ) AS issue_count FROM issuetracker.projects_list',
            {
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        console.log(projectList);
        res.status(200).json({ status: 200, data: projectList });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

const projectById = async (req, res) => {
    try {
        const { projectid } = req.body;
        const project = await db.sequelize.query('SELECT * FROM projects_list WHERE id = ?',
            {
                raw: true,
                replacements: [projectid],
                type: QueryTypes.SELECT
            }
        );
        console.log(project);
        res.status(200).json({ status: 200, data: project });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

const closeProject = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { projectid } = req.body;
        const issueExists = await db.sequelize.query('SELECT count(*) AS count FROM issuetracker.issue_list where status = "new" AND project_id = ?',
            {
                replacements: [projectid],
                type: QueryTypes.SELECT
            }
        );
        if (issueExists[0].count > 0) throw { custom: true, status: 409, error: { message: "Cannot close the project due to existing issues" } };
        const [results, metadata] = await db.sequelize.query('UPDATE projects_list SET status = "closed" WHERE id = ?',
            {
                raw: true,
                replacements: [projectid],
                type: QueryTypes.UPDATE
            }
        );
        if (metadata !== 1) {
            throw { custom: true, status: 400, error: { message: "Issue error" } };
        } else {
            await t.commit();
        }
        res.status(200).json({ status: 200, data: results });
    } catch (err) {
        await t.rollback();
        "custom" in err ? res.status(err.status).json(err) : res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

const searchProject = async (req, res) => {
    const { searchString } = req.body;
    try {
        const projectList = await db.sequelize.query('SELECT projects_list.id, project_name, description, status, (select count(*) from issue_list where projects_list.id = issue_list.project_id AND issue_list.status = "new" ) AS issue_count FROM issuetracker.projects_list where projects_list.project_name like :searchStr',
            {
                replacements: { searchStr: searchString + "%" },
                raw: true,
                type: QueryTypes.SELECT
            }
        );
        console.log(projectList);
        res.status(200).json({ status: 200, data: projectList });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

module.exports = {
    createProject,
    listAllProject,
    projectById,
    closeProject,
    searchProject
};