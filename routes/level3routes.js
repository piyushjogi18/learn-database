import express from 'express'
import { execute_query } from '../helpers/helperfunctions.js';

const level3Router = express.Router();
// level3 routes - joins all types

level3Router.get('/:query',function(req,res){
    let sql;
    switch(req.params.query){
        case 'natural-join' : 
                sql = "SELECT * FROM users";  
                break;
    } 

    execute_query(sql,res);
})

export default level3Router;