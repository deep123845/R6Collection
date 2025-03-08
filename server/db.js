const betterSqlite3 = require('better-sqlite3');

class Database {
    constructor(dbFilePath) {
        this.db = betterSqlite3(dbFilePath);
        this.db.pragma('journal_mode = WAL');
    }

    initialize() {
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                category TEXT,
                owned BOOLEAN DEFAULT 0,
                imageUrl TEXT
            )
        `).run();
    }

    getAllItems() {
        return this.db.prepare(`SELECT * FROM items`).all();
    }

    insertItem(name, category, imageUrl) {
        this.db.prepare(`
            INSERT INTO items (name, category, imageUrl)
            VALUES (@name, @category, @imageUrl)
        `).run({ name, category, imageUrl });
    }

    setItemOwned(id, owned) {
        owned = owned ? 1 : 0;
        this.db.prepare(`
            UPDATE items
            SET owned = @owned
            WHERE id = @id
        `).run({ id, owned });
    }

    close() {
        this.db.close();
    }
}

const dbInstance = new Database('database.db');
dbInstance.initialize();
module.exports = dbInstance;
