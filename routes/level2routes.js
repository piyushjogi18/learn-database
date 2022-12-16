import express from 'express'
import { execute_query } from '../helpers/helperfunctions.js';

const level2Router = express.Router();
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

export default level2Router;