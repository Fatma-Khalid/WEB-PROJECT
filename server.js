const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5003; 

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myproject'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});


app.get('/', (req, res) => {
    res.send('Welcome to My Students Attendance System Project');
});



app.post('/register', (req, res) => {
    const { fullname, registrationNumber, password } = req.body;

    

    const checkSql = 'SELECT * FROM students WHERE registrationNumber = ?';
    db.query(checkSql, [registrationNumber], (err, result) => {
        if (err) {
            console.error('Error checking registration number:', err);
            res.status(500).send({ msg: 'An error occurred while checking registration number' });
            return;
        }
        if (result.length > 0) {
            res.status(400).send({ msg: 'Registration number already exists' });
        } else {
            const sql = 'INSERT INTO students (fullname, registrationNumber, password) VALUES (?, ?, ?)';
            db.query(sql, [fullname, registrationNumber, password], (err, result) => {
                if (err) {
                    console.error('Error registering student:', err);
                    res.status(500).send({ msg: 'An error occurred while registering student' });
                    return;
                }
                res.send({ msg: 'Student registered successfully!' });
            });
        }
    });
});




app.post('/login', (req, res) => {
    const { registrationNumber, password } = req.body;
    const sql = 'SELECT * FROM students WHERE registrationNumber = ? AND password = ?';
    db.query(sql, [registrationNumber, password], (err, result) => {
        if (err) {
            console.error('Error logging in student:', err);
            res.status(500).send({ msg: 'An error occurred while logging in' });
            return;
        }
        if (result.length > 0) {
            res.send({ msg: 'Login successful!', student: result[0] });
        } else {
            res.status(401).send({ msg: 'Invalid credentials' });
        }
    });
});




app.get('/api/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            res.status(500).send({ msg: 'An error occurred while fetching students' });
            return;
        }
        res.json(results);
    });
});




app.post('/api/students', (req, res) => {
    const { fullname, registrationNumber, password } = req.body;
    const sql = 'INSERT INTO students (fullname, registrationNumber, password) VALUES (?, ?, ?)';
    db.query(sql, [fullname, registrationNumber, password], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            res.status(500).send({ msg: 'An error occurred while adding student' });
            return;
        }
        res.send({ msg: 'Student added successfully!' });
    });
});




app.get('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error fetching student:', err);
            res.status(500).send({ msg: 'An error occurred while fetching student' });
            return;
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send({ msg: 'Student not found' });
        }
    });
});




app.put('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const { fullname, registrationNumber, password } = req.body;
    const sql = 'UPDATE students SET fullname = ?, registrationNumber = ?, password = ? WHERE id = ?';
    
    db.query(sql, [fullname, registrationNumber, password, studentId], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            res.status(500).send({ msg: 'An error occurred while updating student' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send({ msg: 'Student not found' });
        } else {
            res.send({ msg: 'Student updated successfully!' });
        }
    });
});




app.delete('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'DELETE FROM students WHERE id = ?';
    
    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            res.status(500).send({ msg: 'An error occurred while deleting student' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send({ msg: 'Student not found' });
        } else {
            res.send({ msg: 'Student deleted successfully!' });
        }
    });
});




app.post('/attendance', (req, res) => {
    const { name } = req.body;

    


    if (!name) {
        return res.status(400).send({ msg: 'Attendance name is required' });
    }

    const sql = 'INSERT INTO attendance (attendance) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Error adding attendance:', err);
            res.status(500).send({ msg: 'An error occurred while adding attendance' });
            return;
        }
        res.send({ msg: 'Attendance added successfully!' });
    });
});




app.get('/attendance', (req, res) => {
    const sql = 'SELECT * FROM attendance';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching attendance:', err);
            res.status(500).send({ msg: 'An error occurred while fetching attendance' });
            return;
        }
        res.json(results);
    });
});




app.get('/attendance/:id', (req, res) => {
    const attendanceId = req.params.id;
    const sql = 'SELECT * FROM attendance WHERE id = ?';
    db.query(sql, [attendanceId], (err, result) => {
        if (err) {
            console.error('Error fetching attendance:', err);
            res.status(500).send({ msg: 'An error occurred while fetching attendance' });
            return;
        }
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send({ msg: 'Attendance record not found' });
        }
    });
});




app.put('/attendance/:id', (req, res) => {
    const attendanceId = req.params.id;
    const { name } = req.body;

    


    if (!name) {
        return res.status(400).send({ msg: 'Attendance name is required' });
    }

    const sql = 'UPDATE attendance SET attendance = ? WHERE id = ?';
    db.query(sql, [name, attendanceId], (err, result) => {
        if (err) {
            console.error('Error updating attendance:', err);
            res.status(500).send({ msg: 'An error occurred while updating attendance' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send({ msg: 'Attendance record not found' });
        } else {
            res.send({ msg: 'Attendance updated successfully!' });
        }
    });
});




app.delete('/attendance/:id', (req, res) => {
    const attendanceId = req.params.id;
    const sql = 'DELETE FROM attendance WHERE id = ?';
    
    db.query(sql, [attendanceId], (err, result) => {
        if (err) {
            console.error('Error deleting attendance:', err);
            res.status(500).send({ msg: 'An error occurred while deleting attendance' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send({ msg: 'Attendance record not found' });
        } else {
            res.send({ msg: 'Attendance deleted successfully!' });
        }
    });
});

app.get('/api/students/count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS studentCount FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error performing count query:', err);
            res.status(500).send({ msg: 'An error occurred while performing the count query' });
            return;
        }
        res.json(results[0]);
    });
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
