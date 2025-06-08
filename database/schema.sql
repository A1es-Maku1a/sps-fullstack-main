-- Vytvoření tabulky pro členy fitness centra
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL
);

-- Vytvoření tabulky pro cvičební plány
CREATE TABLE IF NOT EXISTS workout_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- Vytvoření vazební tabulky pro vztah M:N mezi členy a cvičebními plány
CREATE TABLE IF NOT EXISTS member_workout_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  workout_plan_id INTEGER NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE,
  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans (id) ON DELETE CASCADE
);

-- Vytvoření indexů pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS idx_member_id ON member_workout_plans (member_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_id ON member_workout_plans (workout_plan_id);


