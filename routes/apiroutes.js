import express from 'express'
import mysql from 'mysql';
import con from '../dbconnection.js';
// import {v4 as UUID} from 'uuid';

const level1Router = express.Router();
const level2Router = express.Router();

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

// Level 2 Routes  -Nested queries/subqueries and corelated subquery
level2Router.get('/:query',async function(req,res){
    let sql;
    switch(req.params.query){
        case 'update-age-in-users' : 
            sql = `UPDATE users SET age=(SELECT FLOOR(RAND()*100+1))`; 
            break;
        case 'find-eldest-user' : 
            sql = `SELECT name FROM users WHERE age=(SELECT MAX(AGE) FROM users)`; 
            break;    
        case  'find-second-eldest-user' :   
            sql = `SELECT name FROM users WHERE age=(SELECT MAX(AGE) FROM users WHERE age != (SELECT MAX(AGE) FROM users))`; 
            break;  
        case  'find-third-eldest-user' :   
            sql = `SELECT name FROM users ORDER BY age DESC LIMIT 1 OFFSET 2`; 
            break;    
        case  'count-same-age-users' :   
            sql = `SELECT age,COUNT(age) FROM users GROUP BY age`; 
            break;    
        case  'show-only-duplicate-ages' :   
            sql = `SELECT age,COUNT(age) FROM users GROUP BY age HAVING COUNT(age)>1`; 
            break;  
        case  'show-users-having-duplicate-ages' :   
            sql = `SELECT name FROM users WHERE age IN (SELECT age FROM users GROUP BY age HAVING COUNT(age)>1)`; 
            break;   
        case  'find-eldest-student-in-each-course' :   
            sql = `SELECT name,course,age FROM users WHERE (course,age) IN (SELECT course,MAX(age) FROM users GROUP BY course)`; 
            break;  

        /* Corelated - Subquery */
        case  'find-users-who-have-made-bookings' :   
            sql = `SELECT * FROM users WHERE EXISTS (SELECT * FROM booking where users.id=booking.userid)`; 
            //it will pick one row from users table and then compare booking tbale all rows with this one row, if any one  matched exists will return true and select will print that row from users
            //after that it will pick second row from users table and perform the same operation. 
            // Thats why it is co-related query because output of outer query is used as input in inner query
            //while in normal nested queries first inner query executes complelety and then its result is given as input in outer query
            break;   
        
        case  'find-nth-eldest-user' :   
            /* in following query replace n with the number like if we have to find third eldest replace n with 3*/ 
            sql = `SELECT name,age FROM users u1 WHERE N-1 = (SELECT COUNT(DISTINCT age) from users u2 where u2.age>u1.age)`; 
            /* it is also a co realted query in which we pick the outer query pick the first row from user and then nested query check how many ages are greater than this row*/  
            break;    
            
        case  'dynamic' :   
            sql = `SELECT name,age FROM users u1 WHERE 2-1 = (SELECT COUNT(DISTINCT age) from users u2 where u2.age>u1.age)`; 
            break;                         
    }

    execute_query(sql,res);
});

function execute_query(sql,res){
    con.query(sql,function(error,result){
        if(error)
            res.send('Error in query:- '+error); 
        else
            res.send('Successfully executed query '+JSON.stringify(result));  
    })
}

export {level1Router,level2Router};