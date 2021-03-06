require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


/////////////////////////////////////
//////     Middle-ware    //////////

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/////////////////////////////////////
//////      DB Schema     //////////

const characterSchema = new mongoose.Schema({
    alias: String,
})

const userSchema = new mongoose.Schema({
    authId: String,
    characters: [characterSchema],
});

const User = mongoose.model('Users', userSchema);
const Character = mongoose.model('Characters', characterSchema);

/////////////////////////////////////
//////      DB Connect     /////////

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', () => console.log('Database failed to connect'));
db.on('connected', () => console.log('Connected to Scipricore MongoDB'));
db.on('disconnected', () => console.log('Connection to Sciprciore MongoDB ended'));


/////////////////////////////////////
//////      Controllers     /////////

app.delete('/user/:id', async (req, res) => {
    try {
        const deleteUser = await User.deleteOne({authId: req.params.id})
        res.json(deleteUser)
    } catch (e) {
        console.log(e)
    }
})

app.post('/user', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    catch (e) {
        res.send(e);
    }
});

app.put('/user/:id', async (req, res) => {
    console.log(req.body);
    const updatedUser = await User.update({authId: req.params.id}, {$push: {characters: req.body.character}});
    res.json(updatedUser);
});

app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.find({authId: req.params.id});
        res.json(user);
    }
    catch (e) {
        res.send(e);
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Scipricore backend connected at Port " + PORT);
})