const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Set up database connection
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12714270',
    password: 'jvxyNJJnCd',
    database: 'sql12714270',
    port: 3306
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database successfully');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoints
// Films
app.get('/films', (req, res) => {
    db.query('SELECT * FROM film', (err, results) => {
        if (err) {
            console.error('Failed to retrieve films:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});

app.get('/films/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM film WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Failed to retrieve film:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results[0]);
    });
});

app.post('/films', (req, res) => {
    const { judul, durasi } = req.body;
    db.query('INSERT INTO film (judul, durasi) VALUES (?, ?)', [judul, durasi], (err, result) => {
        if (err) {
            console.error('Failed to add film:', err);
            res.status(500).send('Error adding data');
            return;
        }
        res.status(201).send('Film added successfully');
    });
});

app.put('/films/:id', (req, res) => {
    const { id } = req.params;
    const { judul, durasi } = req.body;
    db.query('UPDATE film SET judul = ?, durasi = ? WHERE id = ?', [judul, durasi, id], (err, result) => {
        if (err) {
            console.error('Failed to update film:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.send('Film updated successfully');
    });
});

app.delete('/films/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM film WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Failed to delete film:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.send('Film deleted successfully');
    });
});

// Cinemas
app.get('/cinemas', (req, res) => {
    db.query('SELECT * FROM bioskop', (err, results) => {
        if (err) {
            console.error('Failed to retrieve cinemas:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});

app.get('/cinemas/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM bioskop WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Failed to retrieve cinema:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results[0]);
    });
});

app.post('/cinemas', (req, res) => {
    const { nama, lokasi } = req.body;
    db.query('INSERT INTO bioskop (nama, lokasi) VALUES (?, ?)', [nama, lokasi], (err, result) => {
        if (err) {
            console.error('Failed to add cinema:', err);
            res.status(500).send('Error adding data');
            return;
        }
        res.status(201).send('Cinema added successfully');
    });
});

app.put('/cinemas/:id', (req, res) => {
    const { id } = req.params;
    const { nama, lokasi } = req.body;
    db.query('UPDATE bioskop SET nama = ?, lokasi = ? WHERE id = ?', [nama, lokasi, id], (err, result) => {
        if (err) {
            console.error('Failed to update cinema:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.send('Cinema updated successfully');
    });
});

app.delete('/cinemas/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM bioskop WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Failed to delete cinema:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.send('Cinema deleted successfully');
    });
});

// Schedules
app.get('/schedules', (req, res) => {
    db.query('SELECT jadwal.*, bioskop.nama AS bioskop_nama FROM jadwal JOIN bioskop ON jadwal.bioskop_id = bioskop.id', (err, results) => {
        if (err) {
            console.error('Failed to retrieve schedules:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});

app.get('/schedules/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT jadwal.*, bioskop.nama AS bioskop_nama FROM jadwal JOIN bioskop ON jadwal.bioskop_id = bioskop.id WHERE jadwal.id = ?', [id], (err, results) => {
        if (err) {
            console.error('Failed to retrieve schedule:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results[0]);
    });
});

app.post('/schedules', (req, res) => {
    const { bioskop_id, film_id, waktu_mulai } = req.body;
    db.query('INSERT INTO jadwal (bioskop_id, film_id, waktu_mulai) VALUES (?, ?, ?)', [bioskop_id, film_id, waktu_mulai], (err, result) => {
        if (err) {
            console.error('Failed to add schedule:', err);
            res.status(500).send('Error adding data');
            return;
        }
        res.status(201).send('Schedule added successfully');
    });
});

app.put('/schedules/:id', (req, res) => {
    const { id } = req.params;
    const { bioskop_id, film_id, waktu_mulai } = req.body;
    db.query('UPDATE jadwal SET bioskop_id = ?, film_id = ?, waktu_mulai = ? WHERE id = ?', [bioskop_id, film_id, waktu_mulai, id], (err, result) => {
        if (err) {
            console.error('Failed to update schedule:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.send('Schedule updated successfully');
    });
});

app.delete('/schedules/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM jadwal WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Failed to delete schedule:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.send('Schedule deleted successfully');
    });
});

// Tickets
app.get('/tickets', (req, res) => {
    db.query('SELECT * FROM tiket', (err, results) => {
        if (err) {
            console.error('Failed to retrieve tickets:', err);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});

app.post('/tickets', (req, res) => {
    const { jadwal_id, jumlah_tiket, total_harga, status_pembayaran } = req.body;
    db.query('INSERT INTO tiket (jadwal_id, jumlah_tiket, total_harga, status_pembayaran) VALUES (?, ?, ?, ?)', [jadwal_id, jumlah_tiket, total_harga, status_pembayaran], (err, result) => {
        if (err) {
            console.error('Failed to add ticket:', err);
            res.status(500).send('Error adding data');
            return;
        }
        res.status(201).send('Ticket added successfully');
    });
});

app.put('/tickets/:id', (req, res) => {
    const { id } = req.params;
    const { jadwal_id, jumlah_tiket, total_harga, status_pembayaran } = req.body;
    db.query('UPDATE tiket SET jadwal_id = ?, jumlah_tiket = ?, total_harga = ?, status_pembayaran = ? WHERE id = ?', [jadwal_id, jumlah_tiket, total_harga, status_pembayaran, id], (err, result) => {
        if (err) {
            console.error('Failed to update ticket:', err);
            res.status(500).send('Error updating data');
            return;
        }
        res.send('Ticket updated successfully');
    });
});

app.delete('/tickets/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tiket WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Failed to delete ticket:', err);
            res.status(500).send('Error deleting data');
            return;
        }
        res.send('Ticket deleted successfully');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
