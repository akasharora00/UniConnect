# Episode - 3
- create a repo
- initialize project
- node_modules, package.json, package-lock.json
- what are dependencies
- what are ~ and ^
- install express
- listen to port 4000
- write request handeler for /test /hello
- install nodemon and update script inside a package.json
- what "-g" means




# Episode - 4
- Initialise the git
- git ignore file
- create a remote repo on github
- push code to github
- played wiyh routs extensions ex. /hello, /, /hello2/xyz
- * order of the rout matters a lot
- write logic to handel GET, POST, DELETE, PATCH API calls and test them on Postman

- /ab?c = here b is optional both /abc and /ac will work here
- /a(bc)?d = here bc is optional both /abcd and /ad will work 
- /ab+c = here you can add as many "b" i want : /abbbbbbbbbbbbc and / abbbc will work but not abccc
- /a(bc)+c = /abcbcbcbcbcc     
- /ab*c =here i can enter anything between ab and c : /abdwefiwenfoiwejwc it will work

- app.get(/a/, ()) = any thing contain 'a' will run here like: /akash, /cab, /cat
- app.get(/*fly$/, ()) = any thing end at 'fly' will run here like: /butterfly, /drangonfly, /catfly
- /user/:userId and /user/:userId/:name/:college
- dynamic routes




# Episode - 5
- Multiple Route Handelers - Play with code
- next()
- next function and errors (call stack)
- diff of app.use() and app.get()
- middlewares
- why middlewares
- ## http status codes= 
  - Informational responses (100 – 199)
  - Successful responses (200 – 299)
  - Redirection messages (300 – 399)
  - Client error responses (400 – 499)
  - Server error responses (500 – 599)

- diff bw app.use() and app.all()
    ## `app.use`
        - Matches path prefix
        - used for Middleware
        - dont Needs exact route match
        - Example -
            app.use("/user", (req, res, next) => {
                console.log("Middleware");
                next();
            });
            run for all GET /user, POST /user, GET /user/profile, DELETE /user/123
    ## `app.all`
        - dont Matches path prefix
        - use for Route handling
        - Needs exact route match
        - Example
            app.all("/user", (req, res) => {
                res.send("All methods allowed");
            });
            run for GET /user, POST /user, PUT /user, DELETE /user

- dummy middleware for admin
- separate middlware folder
- (err, req, res, next)
- error handeling




# Episode - 6
- create cluster
- install mongoose liberary
- connect to db and compass
- call the connectDB function and connect to database before starting application
- create a user schema
- created an SignUp IP add data to database
-   Schema = Blueprint
    Model = Manager
    Document = Actual Data

    // Database

        //creating API

        // # complete flow
        // POSTMAN
        //    ↓
        // POST /signup
        //    ↓
        // Express Route
        //    ↓
        // userObj create
        //    ↓
        // new User(userObj)
        //    ↓
        // Mongoose Document
        //    ↓
        // await user.save()
        //    ↓
        // MongoDB
        //    ↓
        // res.send()



# Episode - 7
- diff bw Javascript and JSON
    - ## `javascript object` :
        - A programming language object
        - Keys can be without quotes
        - Can contain functions, support comments
        - Can use single or double quotes
        - Directly useable in JS code
    - ## `JSON`
        - A data format for storing/transferring data
        - Keys must be in double quotes
        - can not contain functions and no comments allowed
        - only double quotes are allowed
        - Must be parsed into JS objects

- added the express.json milddleware
- make a signup api dynamic to recieve the data from user
- diff bw findOne and find
- User.findOne with same data.
- can use findById()
- created an APi /user
- GET /feed
- created a delete/user by id api
- created an update/ user api 
- API - which upadte the user with emailId


# Episode 8
- added required, unique, lowercase, min, maxLength minLength, trim
- create a custom validate function for gender
- improve the DB schema
- add timestamps to schema
- addded api level validation on Patch request and signup post api
- data sanitisation - added validation data must be entered correct
- installed validator
- explore validator libereary functions
- never trust req.body 

# Episode 9
- validate data in signup api
- install bycript package
- create passwordHash using bycrypt.hash and save the user is encrypted


# Episode 10
- install cookie-parser
- just send a dummy cookie to user
- create GET /profile API and check if you get the cookie back
- installed jsonwebtoken
- In login api, after email and password validation create a jwt token and send back to user
- read the cookie inside ur profile and find the logged in user
- userAuth middleware
- add user Auth middleware in profile api and send connection request
- set the expiry of jwt token
- Expiry the token is very important
- create userschema method to getJWT();
- create userSchema method to comparePassword(passwordInputByUser)

# Episode 11
- created the api's list
- create route folder for managing auth, profile, request routers
- create routers- authRouter, requestRouter, profileRouters
import these routers in app.js
- create post/logout api
- create patch/profile/edit
- create patch/profile/password API - forgot password api
- validate all data in every post patch apis


# Pagination
/feed?page=1&limit=10 - first 10 users from 1 to 10 => skip(0) and limt(10) // give 10 users
/feed?page=2&limit=10 11-20 => skip(10) and limit(10) //give 11 to 20 users
/feed?page=3&limit=10 21-30 => skip(20) and limit(10) //give 21 to 30 users


