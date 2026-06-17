// console.log("Starting a new Project") 
const express=require('express');
const app=express();

app.use("/hello", (req, res)=>{
    res.send("Hello")
})

app.use("/test",(req, res) => {
    res.send("yoooo from server");
});
app.listen(4000, ()=>{
    console.log("Server is successfully running.");
})