const { QueryTypes } = require("sequelize");
const db = require("../config/sqlConfig");


const createIssue = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { projectid, trackertype, description } = req.body;
        console.log(projectid, trackertype, description);
        const [results, metadata] = await db.sequelize.query("INSERT INTO issue_list (project_id, tracker, description) VALUES (?, ?, ?)",
            {
                raw: true,
                replacements: [projectid, trackertype, description],
                type: QueryTypes.INSERT,
                transaction: t
            });
        if (metadata === 1) await t.commit();
        console.log(results);
        res.status(201).json({ status: 201, issueid: results, trackertype: trackertype });
    } catch (err) {
        await t.rollback();
        console.log(err.response);
        "custom" in err ? res.status(err.status).json(err) : res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

const listIssue = async (req, res) => {
    try {
        const { projectid } = req.body;
        const issueList = await db.sequelize.query('SELECT * FROM issue_list WHERE project_id = ?',
            {
                raw: true,
                replacements: [projectid],
                type: QueryTypes.SELECT
            }
        );
        console.log(issueList);
        res.status(200).json({ status: 200, data: issueList });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

const closeIssue = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { issueId, projectid } = req.body;
        const [results, metadata] = await db.sequelize.query('UPDATE issue_list SET status = "closed" WHERE id = ? AND project_id = ?',
            {
                raw: true,
                replacements: [issueId, projectid],
                type: QueryTypes.UPDATE
            }
        );
        if (metadata !== 1) {
            throw { status: 400, error: { message: "Issue error" } };
        } else {
            await t.commit();
        }
        res.status(200).json({ status: 200, data: results });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ status: 500, message: err.message, error: { ...err } });
    }
};

module.exports = {
    createIssue,
    listIssue,
    closeIssue
};