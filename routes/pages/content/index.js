const content = require('express').Router({
    mergeParams: true
});

const SQLSelectAllContent = "SELECT id, title, body, displayTime FROM Content WHERE pageId = <PAGEID> AND deleted = 0 ORDER BY displayOrder;";
const SQLInsertContent = "INSERT INTO Content (pageId, title, body, displayTime, displayOrder) VALUES (?, ?, ?, ?, ?);";
const SQLUpdateContent = "UPDATE Content SET title = ?, body = ?, displayTime = ? WHERE id = ?;";
const SQLDeleteContent = "UPDATE Content SET deleted = 1 WHERE id = ?;";

// Get
content.get('/', (req, res) => {
    let pageId = parseInt(req.params.pageId);
    let _SQLSelectAllContent = SQLSelectAllContent.replace("<PAGEID>", pageId);

    database.all(_SQLSelectAllContent, (err, rows) => {
        if (err) {
            res.status(400).json({
                error: `Error running Select Query: ${err}`
            });
            return;
        }

        res.status(200).json(rows);
    })
});

// Post
content.post('/', (req, res) => {
    let pageId = parseInt(req.params.pageId);
    let title = req.body.title;
    let body = req.body.body;
    let displayTime = parseInt(req.body.displayTime) || 5000;
    let displayOrder = parseInt(req.body.displayOrder);

    if (!body) {
        res.status(400).json({
            error: "Inhoud is verplicht!"
        });
        return;
    }

    if (!displayOrder) {
        res.status(400).json({
            error: "Volgorde is verplicht!"
        });
        return;
    }

    database.run(SQLInsertContent, [pageId, title, body, displayTime, displayOrder], (err) => {
        if (err) {
            res.status(400).json({
                error: `Error running insert: ${err}`
            });
            return;
        }

        res.status(201).json({
            success: `Content is aangemaakt!`
        });
    });
});

// Put
content.put('/:contentId', (req, res) => {
    let contentId = parseInt(req.params.contentId);
    let title = req.body.title;
    let body = req.body.body;
    let displayTime = parseInt(req.body.displayTime) || 5000;

    if (!body) {
        res.status(400).json({
            error: "Inhoud is verplicht!"
        });
        return;
    }

    database.run(SQLUpdateContent, [title, body, displayTime, contentId], (err) => {
        if (err) {
            res.status(400).json({
                error: `Error running update: ${err}`
            });
            return;
        }

        res.status(201).json({
            success: `Content is aangepast!`
        });
    });
});

// Delete
content.delete('/:contentId', (req, res) => {
    let contentId = parseInt(req.params.contentId);

    if (!contentId) {
        res.status(400).json({
            error: "Parameter contentId is verplicht!"
        });
        return;
    }

    database.run(SQLDeleteContent, [contentId], (err) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            return;
        }

        res.status(200).json({
            success: `Content is verwijderd.`
        });
    });
});

module.exports = content;