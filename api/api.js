const express = require('express');
const db = require('../database/db');

const router = express.Router();

// Endpointy pro členy (members)
router.get('/members', (req, res) => {
  db.all('SELECT * FROM members', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/members/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM members WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Člen nenalezen' });
    
    // Získání přiřazených cvičebních plánů
    db.all(
      `SELECT wp.* FROM workout_plans wp
       JOIN member_workout_plans mwp ON wp.id = mwp.workout_plan_id
       WHERE mwp.member_id = ?`,
      [id],
      (err, plans) => {
        if (err) return res.status(500).json({ error: err.message });
        row.workout_plans = plans;
        res.json(row);
      }
    );
  });
});

router.post('/members', (req, res) => {
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname) {
    return res.status(400).json({ error: 'Jméno a příjmení jsou povinné' });
  }
  
  db.run(
    'INSERT INTO members (firstname, lastname) VALUES (?, ?)',
    [firstname, lastname],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, firstname, lastname });
    }
  );
});

router.put('/members/:id', (req, res) => {
  const id = req.params.id;
  const { firstname, lastname } = req.body;
  if (!firstname || !lastname) {
    return res.status(400).json({ error: 'Jméno a příjmení jsou povinné' });
  }
  
  db.run(
    'UPDATE members SET firstname = ?, lastname = ? WHERE id = ?',
    [firstname, lastname, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Člen nenalezen' });
      res.json({ id, firstname, lastname });
    }
  );
});

router.delete('/members/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM members WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Člen nenalezen' });
    res.json({ message: 'Člen byl smazán' });
  });
});

// Endpointy pro cvičební plány (workout_plans)
router.get('/workout-plans', (req, res) => {
  db.all('SELECT * FROM workout_plans', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/workout-plans/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM workout_plans WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Cvičební plán nenalezen' });
    
    // Získání členů, kteří mají přiřazený tento plán
    db.all(
      `SELECT m.* FROM members m
       JOIN member_workout_plans mwp ON m.id = mwp.member_id
       WHERE mwp.workout_plan_id = ?`,
      [id],
      (err, members) => {
        if (err) return res.status(500).json({ error: err.message });
        row.members = members;
        res.json(row);
      }
    );
  });
});

router.post('/workout-plans', (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Název je povinný' });
  }
  
  db.run(
    'INSERT INTO workout_plans (name, description) VALUES (?, ?)',
    [name, description || ''],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, description });
    }
  );
});

router.put('/workout-plans/:id', (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Název je povinný' });
  }
  
  db.run(
    'UPDATE workout_plans SET name = ?, description = ? WHERE id = ?',
    [name, description || '', id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Cvičební plán nenalezen' });
      res.json({ id, name, description });
    }
  );
});

router.delete('/workout-plans/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM workout_plans WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Cvičební plán nenalezen' });
    res.json({ message: 'Cvičební plán byl smazán' });
  });
});

// Endpointy pro přiřazení plánů členům (member_workout_plans)
router.get('/member-workout-plans', (req, res) => {
  db.all(
    `SELECT mwp.id, m.id as member_id, m.firstname, m.lastname, 
     wp.id as workout_plan_id, wp.name as workout_plan_name
     FROM member_workout_plans mwp
     JOIN members m ON mwp.member_id = m.id
     JOIN workout_plans wp ON mwp.workout_plan_id = wp.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.post('/member-workout-plans', (req, res) => {
  const { member_id, workout_plan_id } = req.body;
  if (!member_id || !workout_plan_id) {
    return res.status(400).json({ error: 'ID člena a ID cvičebního plánu jsou povinné' });
  }
  
  // Kontrola, zda člen a plán existují
  db.get('SELECT id FROM members WHERE id = ?', [member_id], (err, memberRow) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!memberRow) return res.status(404).json({ error: 'Člen nenalezen' });
    
    db.get('SELECT id FROM workout_plans WHERE id = ?', [workout_plan_id], (err, planRow) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!planRow) return res.status(404).json({ error: 'Cvičební plán nenalezen' });
      
      // Kontrola, zda přiřazení již neexistuje
      db.get(
        'SELECT id FROM member_workout_plans WHERE member_id = ? AND workout_plan_id = ?',
        [member_id, workout_plan_id],
        (err, existingRow) => {
          if (err) return res.status(500).json({ error: err.message });
          if (existingRow) return res.status(409).json({ error: 'Toto přiřazení již existuje' });
          
          // Vytvoření nového přiřazení
          db.run(
            'INSERT INTO member_workout_plans (member_id, workout_plan_id) VALUES (?, ?)',
            [member_id, workout_plan_id],
            function(err) {
              if (err) return res.status(500).json({ error: err.message });
              res.status(201).json({ 
                id: this.lastID, 
                member_id, 
                workout_plan_id 
              });
            }
          );
        }
      );
    });
  });
});

router.delete('/member-workout-plans/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM member_workout_plans WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Přiřazení nenalezeno' });
    res.json({ message: 'Přiřazení bylo smazáno' });
  });
});

// Endpointy pro přiřazení plánů členům (assignments)
router.get('/assignments', (req, res) => {
  db.all(
    `SELECT mwp.id, 
            m.id as member_id, 
            m.firstname, 
            m.lastname, 
            wp.id as plan_id, 
            wp.name as plan_name,
            wp.description as plan_description
     FROM member_workout_plans mwp
     JOIN members m ON mwp.member_id = m.id
     JOIN workout_plans wp ON mwp.workout_plan_id = wp.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Transformace dat do požadovaného formátu
      const assignments = rows.map(row => ({
        id: row.id,
        member: {
          id: row.member_id,
          firstname: row.firstname,
          lastname: row.lastname
        },
        plan: {
          id: row.plan_id,
          name: row.plan_name,
          description: row.plan_description
        }
      }));
      
      res.json(assignments);
    }
  );
});

router.post('/assignments', (req, res) => {
  const { memberId, planId } = req.body;
  if (!memberId || !planId) {
    return res.status(400).json({ error: 'ID člena a ID cvičebního plánu jsou povinné' });
  }
  
  // Kontrola, zda člen a plán existují
  db.get('SELECT id FROM members WHERE id = ?', [memberId], (err, memberRow) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!memberRow) return res.status(404).json({ error: 'Člen nenalezen' });
    
    db.get('SELECT id FROM workout_plans WHERE id = ?', [planId], (err, planRow) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!planRow) return res.status(404).json({ error: 'Cvičební plán nenalezen' });
      
      // Kontrola, zda přiřazení již neexistuje
      db.get(
        'SELECT id FROM member_workout_plans WHERE member_id = ? AND workout_plan_id = ?',
        [memberId, planId],
        (err, existingRow) => {
          if (err) return res.status(500).json({ error: err.message });
          if (existingRow) return res.status(409).json({ error: 'Toto přiřazení již existuje' });
          
          // Vytvoření nového přiřazení
          db.run(
            'INSERT INTO member_workout_plans (member_id, workout_plan_id) VALUES (?, ?)',
            [memberId, planId],
            function(err) {
              if (err) return res.status(500).json({ error: err.message });
              
              // Získání detailů člena a plánu pro odpověď
              db.get('SELECT * FROM members WHERE id = ?', [memberId], (err, member) => {
                if (err) return res.status(500).json({ error: err.message });
                
                db.get('SELECT * FROM workout_plans WHERE id = ?', [planId], (err, plan) => {
                  if (err) return res.status(500).json({ error: err.message });
                  
                  res.status(201).json({
                    id: this.lastID,
                    member: member,
                    plan: plan
                  });
                });
              });
            }
          );
        }
      );
    });
  });
});

router.delete('/assignments/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM member_workout_plans WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Přiřazení nenalezeno' });
    res.json({ message: 'Přiřazení bylo smazáno' });
  });
});

module.exports = router;




