const pages = require('express').Router({
    mergeParams: true
});
const content = require('./content');

const SQLSelectAllPages = "SELECT id, name, displayOrder FROM Pages WHERE deleted = 0 ORDER BY displayOrder;";
const SQLInsertPage = "INSERT INTO Pages (name, displayOrder) VALUES (?, ?);";
const SQLUpdatePage = "UPDATE Pages SET name = ? WHERE id = ?;";
const SQLDeletePage = "UPDATE Pages SET deleted = 1 WHERE id = ?;";

pages.use('/:pageId/content', content);

// Get
pages.get('/', (req, res) => {
    database.all(SQLSelectAllPages, (err, rows) => {
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
pages.post('/', (req, res) => {
    let name = req.body.name;
    let displayOrder = req.body.displayOrder;

    if (!name) {
        res.status(400).json({
            error: "Naam is verplicht!"
        });
        return;
    }

    if (!displayOrder) {
        res.status(400).json({
            error: "Volgorde is verplicht!"
        });
        return;
    }

    database.run(SQLInsertPage, [name, displayOrder], (err) => {
        if (err) {
            res.status(400).json({
                error: `Error running insert: ${err}`
            });
            return;
        }

        res.status(201).json({
            success: `Pagina "${name}" is aangemaakt!`
        });
    });
});

// Put
pages.put('/:pageId', (req, res) => {
    let pageId = parseInt(req.params.pageId);
    let name = req.body.name;

    if (!pageId) {
        res.status(400).json({
            error: "Parameter pageId is verplicht!"
        });
        return;
    }

    if (!name) {
        res.status(400).json({
            error: "Naam is verplicht!"
        });
        return;
    }

    database.run(SQLUpdatePage, [name, pageId], (err) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            return;
        }

        res.status(200).json({
            success: `Pagina "${name}" is aangepast.`
        });
    })
})

// Delete
pages.delete('/:pageId', (req, res) => {
    let pageId = parseInt(req.params.pageId);

    if (!pageId) {
        res.status(400).json({
            error: "Parameter pageId is verplicht!"
        });
        return;
    }

    database.run(SQLDeletePage, [pageId], (err) => {
        if (err) {
            res.status(400).json({
                error: err
            });
            return;
        }

        res.status(200).json({
            success: `Pagina is verwijderd.`
        });
    });
});

module.exports = pages;