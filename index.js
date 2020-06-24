// Create Express Application
const express = require("express");
const app = express();
const routes = require("./routes");
const PORT = 8081;
const REMOVEDB = false;
const path = require("path");

// Initialize Database
const fileSystem = require("fs");
const sqlite3 = require("sqlite3").verbose();

const dbFile = path.join("./notifications.db");
if (REMOVEDB) fileSystem.unlinkSync(dbFile);
const dbFileExists = fileSystem.existsSync(dbFile);
const database = new sqlite3.Database(dbFile);

global.database = database;

// Create Database Tables
const SQLCreatePages =
    "CREATE TABLE Pages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, displayOrder INTEGER, deleted INTEGER DEFAULT 0);";
const SQLCreateContent =
    "CREATE TABLE Content (id INTEGER PRIMARY KEY AUTOINCREMENT, pageId INTEGER, title TEXT, body TEXT, displayTime INTEGER, displayOrder INTEGER, deleted INTEGER DEFAULT 0, FOREIGN KEY(pageId) REFERENCES Pages(id));";

database.serialize(() => {
    if (!dbFileExists) {
        database.run(SQLCreatePages);
        database.run(SQLCreateContent);
    }
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Connect routes
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Meldingen - Backend listening on port ${PORT}`);
    console.log(`Delete Database on run: ${REMOVEDB}`);
});