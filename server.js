const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser');

var express = require("express");
var app = express();

var db
var mongodb = require('mongodb')

app.use(bodyParser.json())

MongoClient.connect('mongodb://dbUser:dbPassword1@ds249623.mlab.com:49623/getir-case-study', (err, database) => {
    
    if (err) return console.log(err)
    db = database
    
    var port = process.env.PORT || 3000

    app.listen(port, () => {
        console.log('listening on ' + port)
    })
    
})

app.post('/getrecords', (req, res) => {
     
    db.collection('records').aggregate([{
        $match: {
            "createdAt": { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate)}
        }},
                                             {
        $project : {_id: 0, key: 1, createdAt: 1, totalCount: {$sum: "$counts"}
        }} 
    ]).toArray(function(err, results) {
 
       res.json({code : 0, msg : 'success', records: results})
   
    })
})