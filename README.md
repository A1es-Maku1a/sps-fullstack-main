<<<<<<< HEAD
# Správa Fitness Centra

Webová aplikace pro správu členů fitness centra, cvičebních plánů a jejich přiřazení.

## Funkce

- **Správa členů** - přidávání, úprava a mazání členů
- **Správa cvičebních plánů** - vytváření a správa různých typů cvičebních plánů
- **Přiřazení plánů** - přiřazování cvičebních plánů konkrétním členům

## Technologie

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Databáze**: SQLite3

## Instalace a spuštění

1. **Klonování repozitáře**
   ```bash
   git clone <repository-url>
   cd sps-fullstack-main
   ```

2. **Instalace závislostí**
   ```bash
   npm install
   ```

3. **Inicializace databáze s ukázkovými daty**
   ```bash
   npm run seed
   ```

4. **Spuštění aplikace**
   ```bash
   npm start
   ```

5. **Otevření v prohlížeči**
   ```
   http://localhost:3000
   ```

## Struktura projektu

```
├── api/                 # API endpointy
├── database/           # Databázové skripty a konfigurace
├── public/             # Statické soubory (HTML, CSS, JS)
├── server.js           # Hlavní server soubor
├── package.json        # NPM konfigurace
└── README.md          # Dokumentace
```

## API Endpointy

- `GET /api/members` - Seznam všech členů
- `POST /api/members` - Přidání nového člena
- `PUT /api/members/:id` - Úprava člena
- `DELETE /api/members/:id` - Smazání člena
- `GET /api/workout-plans` - Seznam cvičebních plánů
- `POST /api/workout-plans` - Přidání nového plánu
- `PUT /api/workout-plans/:id` - Úprava plánu
- `DELETE /api/workout-plans/:id` - Smazání plánu
- `GET /api/assignments` - Seznam přiřazení
- `POST /api/assignments` - Přidání přiřazení
- `DELETE /api/assignments/:id` - Smazání přiřazení

## Autor

Aleš Makula & Augment AI
>>>>>>> 058a50b7eeafefa1cb4e3a244324b197d9f82712
