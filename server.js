const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const database = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'root123',
        database: 'smartbrain'
    }
});

database.select('*').from('users').then(data => {
    console.log(data);
});

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
    database('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register'))
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    database.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if(user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('not found')
        }
    })
    .catch(err => {
        res.status(400).json('error getting user');
    })
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    database('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => {
            res.status(400).json('unable to get entries');
        })
})

app.listen(5000, () => {
    console.log('App is running on port 5000');
});