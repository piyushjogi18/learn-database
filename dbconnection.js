import mysql from 'mysql';

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "bms",
    password: ""
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected55!");
});
export default con;