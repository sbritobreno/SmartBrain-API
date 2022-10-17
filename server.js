const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = {
    users: [
        {
            id: '123',
            name: 'breno',
            email: 'breno@breno.com',
            password: 'breno123',
            entries: 0,
            joined: new Date()
        },
        {
            id: '1243',
            name: 'jeff',
            email: 'jeff@jeff.com',
            password: 'jeff123',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(db.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === db.users[0].email && req.body.password === db.users[0].password) {
        res.json(db.users[0]);
    } else {
        res.status(400).json('Error logging in');
    }
})

app.post('/register', (req, res) => {
    const {email, password, name} = req.body
    db.users.push({
        id: '1234',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(db.users[db.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    db.users.forEach(user => {
        if(user.id === id){
            found = true;
            res.json(user);
        }
    })
    if (!found) {
        res.status(404).json('This user doe not exist');
    }
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;
    db.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++
            res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json('not found');
    }
})

app.listen(5000, () => {
    console.log('App is running on port 5000');
});