var express = require('express');
var mongoose = require('mongoose');

app = express();

mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.tfqi1.mongodb.net/inventory',{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })
    .then(console.log('Connected to database "inventory"'))
    .catch((err) => {console.log(err)})

app.use(express.json())

const Inventory = require('../Models/Inventory')

//methods: ADD, GET, UPDATE

//Get all inventory
//http://localhost:3600/inventory?item=potato&date=2020-12-12
app.get('/inventory', (req, res) =>{
    const matchItem = req.query.item
    const matchDate = Date.parse(req.query.date)
    Inventory.find({ item : matchItem, date : matchDate})
        .then((inventory) => res.send(inventory))
        .catch((err) => console.log(err))
})

//Get inventory by item
app.get('/inventory/:item', (req, res) =>{
    Inventory.find({ item : req.params.item})
        .then((inventory) => res.send(inventory))
        .catch((err) => console.log(err))
})


//add an inventory (POST)
app.post('/inventory', (req, res) =>{
    (new Inventory ( { 'date' : req.body.date, 'area' : req.body.area, 'item' : req.body.item, 'quantity' : req.body.quantity}))
        .save()
        .then((inventory) => res.send(inventory))
        .catch((err) => console.log(err))
})

//update a reservation (PATCH)
app.patch('/inventory/:id', (req, res) =>{
    Inventory.findOneAndUpdate({ _id : req.params.id}, { $set : req.body })
        .then((inventory) => {
            console.log("Inventory updated!")
            Inventory.find({ _id : req.params.id})
                .then((reservation) => res.send(reservation))
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    
})

//deleting an inventory
app.delete('/inventory/:id', (req, res) =>{
    Inventory.findOneAndDelete({  _id : req.params.id })
        .then((reservation) => res.send("inventory deleted"))
        .catch((err) => console.log(err))
})

app.listen(3600, () => {
    console.log('Listening to port 3600')
})