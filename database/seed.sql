-- Vložení ukázkových dat pro členy fitness centra
INSERT INTO members (firstname, lastname) VALUES 
('Jan', 'Novák'),
('Marie', 'Svobodová'),
('Petr', 'Dvořák'),
('Lucie', 'Černá'),
('Tomáš', 'Procházka');

-- Vložení ukázkových dat pro cvičební plány
INSERT INTO workout_plans (name, description) VALUES 
('Začátečník', 'Základní cvičební plán pro začátečníky'),
('Pokročilý', 'Intenzivní cvičební plán pro pokročilé'),
('Kardio', 'Plán zaměřený na kardio cvičení'),
('Síla', 'Plán zaměřený na budování svalové hmoty'),
('Flexibilita', 'Plán zaměřený na zvýšení flexibility');

-- Vložení ukázkových dat pro přiřazení plánů členům
INSERT INTO member_workout_plans (member_id, workout_plan_id) VALUES 
(1, 1), -- Jan Novák má plán Začátečník
(2, 3), -- Marie Svobodová má plán Kardio
(3, 4), -- Petr Dvořák má plán Síla
(4, 2), -- Lucie Černá má plán Pokročilý
(5, 5), -- Tomáš Procházka má plán Flexibilita
(1, 3), -- Jan Novák má také plán Kardio
(3, 1); -- Petr Dvořák má také plán Začátečník

