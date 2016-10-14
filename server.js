"use strict";
const url = require('url');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const request = require('request');
require('dotenv').config();

function saveSearch(term, cb){
  MongoClient.connect(process.env.MONGO, (err,db)=>{
   if(err){
      cb(err);
    } else {
      const collection = db.collection('searches');
      collection.insert({term: term, when: Date.now()},(err, item)=>{
        if(err) { cb(err) } else { cb(null) }
        db.close();
      });
    }
  });
};

function latestSearches(cb){
  MongoClient.connect(process.env.MONGO, (err, db)=>{
   if(err) { cb(err) } else {
     const collection = db.collection('searches');
     collection.find({},{
       _id: 0, term: 1, when: 1
     }).sort({ when: -1 }).limit(20).toArray((err, docs)=>{
       if(err) { cb(err) } else {
         cb(null, docs);
       }
       db.close();
     });
   }
  });
}

function mkSearchString(term, offset){
  return url.format({
    protocol: 'https:',
    slashes: true,
    host: 'www.googleapis.com',
    query: { 
      q: (term) ? term : 'lolcats',
      start: (offset > 0 ) ? offset : 1,  
      cx: process.env.CSE_ID,
      key: process.env.API_KEY
    },
    pathname: '/customsearch/v1',
  });
}

const app = express();

app.get('/latest', (req, res)=>{
   latestSearches((err, docs)=>{
    if(err) {
      res.status(500).json(err);
    } else {
      res.json(docs);
    }
   });
});

app.get('/search/:term', (req, res)=>{
  const search = mkSearchString(req.params.term, req.query);
  //request.get({uri: search, json:true}).on('error',(err)=>{console.error(err)}).pipe(res);  
  request.get({uri: search, json:true}, (err, resp, body)=>{
    //res.writeHead({'Content-Type': 'application/json'});
    if (err) {
      res.end(err)
    } else if (!err && resp.statusCode == 200) {
      saveSearch(req.params.term,(err)=>{
        if(err) { console.error(err); }
        res.end(JSON.stringify(body.items));
      });
    } else {
      res.end(JSON.stringify(resp));
   }
  });  
});
app.listen(8080);

