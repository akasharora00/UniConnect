// console.log("Starting a new Project") 
const express=require('express');
const app=express();

// // order is very important   
// app.use("/hello", (req, res)=>{
//     res.send("Hello")
// })

// app.use("/test",(req, res) => {
//     res.send("yoooo from server");
// });



// Episode 4


//this will match all the HTTP methods API call to the /test
// app.use("/test", (req, res)=>{
//     res.send("USer")
// })
    
// this will only handel the GET call to /user
// app.get("/user", (req, res)=>{
//     res.send({firstName: "Akashdeep"})
// })

// app.post("/user", (req, res)=>{
//     // console.log("Save data to database");
//     res.send("Saved data to DB")
// })

// app.delete("/user", (req, res)=>{
//     // console.log("Save data to database");
//     res.send("deleted data")
// })

// app.get("/ab?c", (req, res)=>{
//     res.send("i am testing special expressions")
// })

// app.get("/user", (req, res)=>{
//     console.log(req.query)
//     res.send("i am dynamic") //http://localhost:4000/user?userid=101
// })

// app.get("/user/:userId", (req, res)=>{
//     console.log(req.query)
//     res.send("i am dynamic") //http://localhost:4000/user/101
// })

// app.get("/user/:userId/:name/:college", (req, res)=>{
//     console.log(req.query)
//     res.send("i am dynamic") //http://localhost:4000/user/101/akash/chitkara
// })

// app.get(/a/, (req, res)=>{
//     res.send("i am rajex") // any thing contain 'a' will run here like: /akash, /cab, /cat
// })

app.listen(4000, ()=>{
    console.log("Server is successfully running.");
})