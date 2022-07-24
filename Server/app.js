// Assignment 4 REST Service
// Naomi Nottingham

// Import required modules
var express = require("express");
var app = express();
app.use(express.json());

// CORS fix
app.all('/*', function (req,res,next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Route for service info
app.get('/', function (req, res) {
    res.status(200);
    res.send("<h1>This REST service will provide services related to assignment 3.");
    console.log("A request has been processed in / (root)");
});

app.listen(3000, function() {
    console.log("API version 1.0.0 is running on port 3000");
});

// Service 1: Get Cat Names

//Possible cat names
const catNames = [];

app.get('/catnames', function (req, res) {
    const randIndex = Math.floor(Math.random() * catNames.length);
    console.log("/catnames request is made");
    
    var resultString = '{ "catnames" : [';

    for (var i = 0; i < catNames.length; i++) {
        if (i > 0) {
            resultString += ",";
        }
        resultString += ' { "name" : "' + catNames[i] + '" }';
    }

    resultString += "]}";

    res.json(JSON.parse(resultString));
})


// Service 2: Register cats

var catWeights = {};

app.post('/catweights/register/:name/:weight', function (req, res) {
    var newName = req.params.name;
    var newWeight = parseFloat(req.params.weight);

    // If cat name already registered, error. Else, register it.
    if (catNames.includes(newName)) {
        // error case
        console.log("Failed registration attempt, duplicate cat name: " + newName);

        res.status(400).send({
            message: "Registration failed, cat name already exists."
        })
    } else {
        console.log("/catweights/register new cat, name: " + newName + " weight: " + newWeight);

        catNames.push(newName);

        catWeights[newName] = newWeight;
        res.status(200).send({
            message: "Registration successful!"
        });
    }
});

//// Service 3: Update/View cat weights

// View all cat weights
app.get('/catweights', function (req, res) {

    var resultString = '{ "catweights" : [';

    first = true;

    for (const [key, value] of Object.entries(catWeights)) {
        if (!first) {
            resultString += ",";
        }
        resultString += ' { "name" : "' + key + '", "weight" : "' + value + '" }';
        first = false;
    }

    resultString += "]}";

    res.json(JSON.parse(resultString));
});

// View specific cat weight
app.get('/catweights/:name', function(req, res) {
    var searchName = req.params.name;
    if (catNames.includes(searchName)) {
        var resultString = '{ "catweights" : [{ "name" : "' + searchName + '", "weight" : "' + catWeights[searchName] + '" }] }';
        res.json(JSON.parse(resultString));
    } else {
        // error case
        console.log("Failed search attempt, cat name does not exist: " + searchName);

        res.status(400).send({
            message: "Search failed, cat name does not exist."
        })
    }
    
});

// Update cat weight
app.post('/catweights/:name/:weight', function(req, res) {
    var searchName = req.params.name;
    var newWeight = req.params.weight;

    if (catNames.includes(searchName)) {
        var weightDiff = newWeight - catWeights[searchName];
        var resultString = '{ "old" : "' + catWeights[searchName] + '", "new" : "' + newWeight + '", "diff" : "' + weightDiff + '" }';

        catWeights[searchName] = newWeight;
        res.json(JSON.parse(resultString));
    } else {
        // error case
        console.log("Failed update attempt, cat name does not exist: " + searchName);

        res.status(400).send({
            message: "Update failed, cat name does not exist."
        })
    }
});

// Service 4: Delete Cat

app.post('/catdelete/:name', function(req, res) {
    var searchName = req.params.name;

    if (catNames.includes(searchName)) {
        //deletion
        var index = catNames.indexOf(searchName);
        catNames.splice(index, 1);
        delete catWeights[searchName];
        res.status(200).send({
            message: "Delete successful."
        })
    } else {
        // error case
        console.log("Failed delete attempt, cat name does not exist: " + searchName);

        res.status(400).send({
            message: "Delete failed, cat name does not exist."
        })
    }
});
