const car = require('../../../models/car');
const listing = require('../../../models/listing');
const https = require('https');
const http = require('http');
const path = require('path'), fs = require('fs');
const helpers = require("../../../services/helpers");


module.exports.getModelData = function(req, res){
    let modelId = req.params.modelId;
    car.getModelData(modelId, function(err, model_info){
        if(err) {res.status(501).send(err)}
        listing.find({model_id : modelId}, function(err, listings){
            if(err) {res.status(501).send(err)}            
            res.send({model_info : model_info , listings: listings});
        });        
    })
}



module.exports.getRelatedModels = function(req, res){
    let modelId = req.params.modelId;
    car.getRelatedModels(modelId, function(err, related_models){
        if(err) res.status(501).send(err);
        res.send(related_models);
    })
}