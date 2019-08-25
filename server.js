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
    
    if (validateParameters(req)){
        res.json({code : 1, msg : 'eksik parametre'})
        return
    }
     
    db.collection('records').aggregate([{
         $project : {_id: 0, key: 1, createdAt: 1, totalCount: {$sum: "$counts"}
        }} 
       , { $match: {
            "createdAt": { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate)},
            "totalCount": {"$gte": req.body.minCount, "$lte": req.body.maxCount}
        }}
       
    ]).toArray(function(err, results) {
        
        if (!err)
            res.json({code : 0, msg : 'success', records: results})
        else
            res.json({code : 2, msg : 'sorgulamada hata alındı'})
   
    })
})

function validateParameters(req) {
    if (typeof req.body.startDate == 'undefined'
        || typeof req.body.endDate == 'undefined'
        || typeof req.body.minCount == 'undefined'
        || typeof req.body.maxCount == 'undefined')
        return 1;
}