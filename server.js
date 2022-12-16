import express from "express";
import level1Router from "./routes/level1routes.js";
import level2Router from "./routes/level2routes.js";
import level3Router from "./routes/level3routes.js";

const app = express();

app.use('/level1',level1Router);     //basic sql queries
app.use('/level2',level2Router);     //Nested queries/subqueries and corelated subquery
app.use('/level3',level3Router);     //joins all types

//listening to the port
app.listen(3000,'localhost',function(){
    console.log('listening to port 3000');
});