const express = require('express');
const { getDbClient } = require('../utils/db');
const router = express.Router();

// GET all music records
router.get('/', async (req, res) => {
  try {
    const sql = getDbClient();
    const response = await sql`SELECT * FROM music`;
    res.json([...response]);
  } catch (error) {
    console.error('Error fetching music data:', error);
    res.status(500).json({ error: 'Failed to fetch music data' });
  }
});

// POST - Create a new music record
router.post('/', async (req, res) => {
  try {
    // const {
    //   name = '',
    //   category = null,
    //   instruments = null,
    //   playtime = null,
    //   performance_ready = null,
    //   genre_mood = null,
    //   tempo = null,
    //   link = null,
    //   notes = null,
    //   last_date_rehearsed = null,
    //   number_times_rehearsed = null,
    // } = req?.body;

    const sql = getDbClient();

    // Insert the new record
    const newRecord = await sql`
      INSERT INTO music (
        name,
        category,
        instruments,
        playtime,
        performance_ready,
        genre_mood,
        tempo,
        link,
        notes,
        last_date_rehearsed,
        number_times_rehearsed,
        date_modified
      ) VALUES (
        ${''},
        ${null},
        ${null},
        ${null},
        ${null},
        ${null},
        ${null},
        ${null},
        ${null},
        ${null},
        ${null},
        ${new Date().toISOString()}
      )
      RETURNING *
    `;

    res.status(201).json(newRecord[0]);
  } catch (error) {
    console.error('Error creating music record:', error);
    res.status(500).json({ error: 'Failed to create music record' });
  }
});

// PATCH - Update a music record
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert id to number to ensure it's valid
    const musicId = parseInt(id, 10);
    if (isNaN(musicId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const sql = getDbClient();

    // Check if record exists
    const existingRecord = await sql`
      SELECT id FROM music WHERE id = ${musicId}
    `;

    if (existingRecord.length === 0) {
      return res.status(404).json({ error: 'Music record not found' });
    }

    // For PATCH, we need to build the query dynamically based on what fields were provided
    // First, get the current record to merge with updates
    const currentRecord = await sql`
      SELECT * FROM music WHERE id = ${musicId}
    `;

    const current = currentRecord[0];

    // Merge the current record with the updates
    const updates = {
      name: updateData.name !== undefined ? updateData.name : current.name,
      category:
        updateData.category !== undefined
          ? updateData.category
          : current.category,
      instruments:
        updateData.instruments !== undefined
          ? updateData.instruments
          : current.instruments,
      playtime:
        updateData.playtime !== undefined
          ? updateData.playtime
          : current.playtime,
      performance_ready:
        updateData.performance_ready !== undefined
          ? updateData.performance_ready
          : current.performance_ready,
      genre_mood:
        updateData.genre_mood !== undefined
          ? updateData.genre_mood
          : current.genre_mood,
      tempo: updateData.tempo !== undefined ? updateData.tempo : current.tempo,
      link: updateData.link !== undefined ? updateData.link : current.link,
      notes: updateData.notes !== undefined ? updateData.notes : current.notes,
      last_date_rehearsed:
        updateData.last_date_rehearsed !== undefined
          ? updateData.last_date_rehearsed
          : current.last_date_rehearsed,
      number_times_rehearsed:
        updateData.number_times_rehearsed !== undefined
          ? updateData.number_times_rehearsed
          : current.number_times_rehearsed,
    };

    // Update with the merged data
    const updatedRecord = await sql`
      UPDATE music
      SET 
        name = ${updates.name},
        category = ${updates.category},
        instruments = ${updates.instruments},
        playtime = ${updates.playtime},
        performance_ready = ${updates.performance_ready},
        genre_mood = ${updates.genre_mood},
        tempo = ${updates.tempo},
        link = ${updates.link},
        notes = ${updates.notes},
        last_date_rehearsed = ${updates.last_date_rehearsed},
        number_times_rehearsed = ${updates.number_times_rehearsed},
        date_modified = ${new Date().toISOString()}
      WHERE id = ${musicId}
      RETURNING *
    `;

    res.json(updatedRecord[0]);
  } catch (error) {
    console.error('Error updating music record:', error);
    res.status(500).json({ error: 'Failed to update music record' });
  }
});

// DELETE - Remove a music record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Convert id to number to ensure it's valid
    const musicId = parseInt(id, 10);
    if (isNaN(musicId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const sql = getDbClient();

    // Check if record exists
    const existingRecord = await sql`
      SELECT id FROM music WHERE id = ${musicId}
    `;

    if (existingRecord.length === 0) {
      return res.status(404).json({ error: 'Music record not found' });
    }

    // Delete the record
    await sql`
      DELETE FROM music
      WHERE id = ${musicId}
    `;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting music record:', error);
    res.status(500).json({ error: 'Failed to delete music record' });
  }
});

module.exports = router;
