const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Vytvoření složky pro databázi, pokud neexistuje
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('Vytvořena složka pro databázi:', dbDir);
  } catch (err) {
    console.error('Chyba při vytváření složky pro databázi:', err.message);
    process.exit(1);
  }
}

// Cesta k databázovému souboru
const dbPath = path.join(dbDir, 'fitness.db');
console.log('Cesta k databázi:', dbPath);

// Pokud soubor existuje, zkusíme ho smazat
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('Existující databázový soubor byl smazán.');
  } catch (err) {
    console.error('Chyba při mazání existujícího databázového souboru:', err.message);
  }
}

// Vytvoření připojení k databázi
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Chyba při připojení k databázi:', err.message);
    process.exit(1);
  }
  console.log('Připojeno k SQLite databázi pro seed.');
  
  // Načtení schématu a seed dat
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');
  
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Vytvoření tabulek a vložení dat
    db.serialize(() => {
      db.exec(schema, (err) => {
        if (err) {
          console.error('Chyba při vytváření schématu:', err.message);
        } else {
          console.log('Schéma databáze vytvořeno.');
          
          db.exec(seedSQL, (err) => {
            if (err) {
              console.error('Chyba při seedování databáze:', err.message);
            } else {
              console.log('Databáze byla úspěšně naplněna ukázkovými daty.');
            }
          });
        }
      });
    });
  } catch (err) {
    console.error('Chyba při čtení souborů:', err.message);
  } finally {
    // Uzavření připojení
    db.close((err) => {
      if (err) {
        console.error('Chyba při uzavírání databáze:', err.message);
      }
      console.log('Připojení k databázi uzavřeno.');
    });
  }
});

