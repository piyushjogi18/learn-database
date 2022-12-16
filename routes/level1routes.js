import express from 'express'
import mysql from 'mysql';
import { execute_query } from '../helpers/helperfunctions.js';

const level1Router = express.Router();
// Level 1 Routes - basic sql queries

level1Router.get('/:query',function(req,res){
    let sql;
    switch(req.params.query){

        case 'create-db' : 
            sql = "CREATE DATABASE bms"; 
            break;
        
        case  'create-users-table' :
            sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255))"; 
            break; 
        case  'create-booking-table' :
            sql = "CREATE TABLE booking (id INT AUTO_INCREMENT PRIMARY KEY,status VARCHAR(255))"; 
            break;

        case  'add-foreign-key' :
            sql = "ALTER TABLE booking ADD COLUMN userid INT, ADD FOREIGN KEY(userid) REFERENCES users(id)"; 
            break;  

        case  'insert-in-users' :
            sql = "INSERT INTO users (name) VALUES ('Rohan'),('Sohan'),('Abhishek')"; 
            break;
        case  'insert-in-booking' :
            sql = "INSERT INTO booking (status,userid) VALUES ('pending',3),('booked',2),('cancelled',5)"; 
            break;    

        case  'show-users' :
            sql = "SELECT * FROM users"; 
            break;  
        case  'show-users-desc' :
            sql = "SELECT * FROM users ORDER BY name DESC"; 
            break;    
        case  'show-3-users' :
            sql = "SELECT * FROM users LIMIT 3 OFFSET 2"; // it will return 3 records starting from 3rd row
            // shorter syntax : "SELECT * FROM users LIMIT 2,3"; Note : LIMIT 2,3 means LIMIT 3 OFFSET 2
            break;    
        case  'show-specific-users' :
            let userid = 4;
            sql = "SELECT * FROM users where name LIKE '%Ank%' OR id="+mysql.escape(userid);  //use mysql.escape() functions for paasing variables in query  to prevent SQL injections
            break;  

        case  'show-bookings' :
            sql = "SELECT status,userid FROM booking"; 
            break;   
        case  'show-cancelled-bookings' :
            sql = "SELECT * FROM booking WHERE status='cancelled'"; 
            break;  

        case  'update-specific-user' :
            sql = "UPDATE users SET name='Aashish' WHERE id=5";
            break;

        case  'delete-in-users' :
            sql = "DELETE FROM users WHERE id>5"; 
            break; 

        case  'drop-table' :
            sql = "DROP TABLE testing"; 
            break;  

        case  'drop-db' :
            sql = "DROP DATABASE bms2"; 
            break; 
                                     
    }
    execute_query(sql,res);
});

export default level1Router;