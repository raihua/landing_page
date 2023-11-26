const express = require("express");

// instance of express router
const recordRoutes = express.Router();

// db connect helper
const dbo = require("../db/conn");

// helps convert id  from strong to object id for the _id
const ObjectId = require("mongodb").ObjectId;


// This section will help you get list of all the records
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("waitList");
    db_connect
        .collection("records")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect
        .collection("records")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// Route for new record
recordRoutes.route("/record/add").post(function (req, response){
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.name,
        email: req.body.email,
    };

    db_connect.collection("records").insertOne(myobj, function(err, res) {
        if (err) throw err;
        res.json(response)
    });
});

// Route for updating a record
recordRoutes.route("/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            email: req.body.email
        },
    };

    db_connect
        .collection("records")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated.");
            response.json(res);
        });
});

// This section helps delete a record
recordRoutes.route("/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

module.exports = recordRoutes;

