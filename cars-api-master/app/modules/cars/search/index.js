const car = require('../../../models/car');
const https = require('https');
const http = require('http');
const path = require('path'), fs = require('fs');
const helpers = require("../../../services/helpers");

module.exports.searchCars = function(req,res){
	let query  = req.params.query.toLowerCase();
	query = decodeURIComponent(query);
	console.log(query, "query data");
	var resturnArr = [];
	car.searchMakes(query , function(err, makes){
		if(err){
			res.send({error:true , message :err });
		}
		else{
			if(makes.length){
				resturnArr = makes;
				car.listAllModelsByMakeId(makes[0].make_id, function(err, makeModels){
					if(err){
						res.send({error:false , data : resturnArr});
					}
					else{
						resturnArr = resturnArr.concat(makeModels);
						res.send({error:false , data : resturnArr});
					}
				})
			}
			else{
				car.searchModels(query, function(err, models){
					if(err){
						res.send({error:false , data : resturnArr});
					}
					else{
						resturnArr.concat(models);
						res.send({error:false , data: resturnArr});
					}
				});
			}
		}
	});   
}

module.exports.searchModelsData = function(req,res){
	let params = req.params;
	car.searchModelsByMakeId(params, function(err, makes){
		if(err) res.status(500).send(err);
		res.send(makes);
	});
}

