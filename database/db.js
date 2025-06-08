const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Vytvoření složky pro databázi, pokud neexistuje
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Cesta k databázovému souboru
const dbPath = path.join(dbDir, 'fitness.db');

// Vytvoření připojení k databázi
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Chyba při připojení k databázi:', err.message);
  } else {
    console.log('Připojeno k SQLite databázi.');
    initDb();
  }
});

// Inicializace databáze - vytvoření tabulek
function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('Chyba při inicializaci databáze:', err.message);
    } else {
      console.log('Databázové schéma bylo úspěšně vytvořeno.');
    }
  });
}

module.exports = db;

