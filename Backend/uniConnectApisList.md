# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionRequestRouter
- POST /request/send/:status/:userId //interested or ignored

- POST /request/review/:status/:requestId //accepted or rejected


- GET /user/connections
- GET /user/request/recieve

- GET /user/feed - get u the feed profile of the users


Status : ignore, interested, accepted, rejected