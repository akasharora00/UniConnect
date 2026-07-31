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