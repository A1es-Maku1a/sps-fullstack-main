const express = require('express');
const path = require('path');
const apiRoutes = require('./api/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pro parsování JSON a URL-encoded dat
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);

// Ošetření 404 chyby pro neexistující cesty
app.use((req, res) => {
  res.status(404).send('Stránka nenalezena');
});

// Ošetření chyb
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Něco se pokazilo!');
});

// Spuštění serveru
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server běží na http://localhost:${PORT}`);
  console.log(`Pro přístup z mobilu použijte: http://192.168.0.220:${PORT}`);
});
