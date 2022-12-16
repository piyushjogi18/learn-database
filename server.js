import express from "express";
import {level1Router,level2Router} from "./routes/apiroutes.js";
const app = express();

app.use('/level1',level1Router);
app.use('/level2',level2Router);

//listening to the port
app.listen(3000,'localhost',function(){
    console.log('listening to port 3000');
});