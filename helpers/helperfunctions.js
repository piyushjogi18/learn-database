import con from "../dbconnection.js";

function execute_query(sql,res){
    con.query(sql,function(error,result){
        if(error)
            res.send('Error in query:- '+error); 
        else
            res.send('Successfully executed query '+JSON.stringify(result));  
    })
}

export {execute_query};