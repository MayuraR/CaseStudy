var express = require('express');
var mongoose = require('mongoose');

app = express();

mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/members',{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('Connected to database "members"'))
    .catch((err) => {console.log(err)})

app.use(express.json())

const Member = require('../Models/Member')

//methods: ADD, GET, UPDATE

//Get all members
app.get('/members', (req, res) =>{
    Member.find({})
        .then((member) => res.send(member))
        .catch((err) => console.log(err))
})

//Get member by id
app.get('/members/:id', (req, res) =>{
    Member.find({ _id : req.params.id})
        .then((member) => res.send(member))
        .catch((err) => console.log(err))
})

//add a member(POST)
app.post('/members', (req, res) =>{
    (new Member ( { 'name' : req.body.name, 'gender' : req.body.gender, 'contact' : req.body.contact, 'email' : req.body.email}))
        .save()
        .then((member) => res.send(member))
        .catch((err) => console.log(err))
})

//update (PATCH)
app.patch('/members/:id', (req, res) =>{
    Member.findOneAndUpdate({ _id : req.params.id}, { $set : req.body })
        .then((member) => {
            console.log('member updated');
            Member.find({ _id : req.params.id})
                .then((member) => res.send(member))
                .catch((err) => console.log(err))})
        .catch((err) => console.log(err))
    
})

app.listen(3000, () => {
    console.log('Listening to port 3000')
})