const content = require('express').Router();

const SQLSelectAllContent = "SELECT Content.id, Content.pageId, Content.title, Content.body, Content.displayTime, Content.displayOrder, Pages.name AS PageName FROM Content LEFT OUTER JOIN Pages ON (Pages.id = Content.pageId) WHERE Content.deleted = 0 AND Pages.deleted = 0 ORDER BY Pages.displayOrder, Content.displayOrder;";

// Get
content.get('/', (req, res) => {
    database.all(SQLSelectAllContent, (err, rows) => {
        if (err) {
            res.status(400).json({
                error: `Error running Select Query: ${err}`
            });
            return;
        }

        res.status(200).json(rows);
    })
});

module.exports = content;