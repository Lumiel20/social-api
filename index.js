
const express  = require ('express')
const bodyParser = require('body-parser')
const dotenv = require("dotenv")
const AuthRoute = require('./routes/AuthRoutes.js')
const mongoose = require('mongoose')
const UserRoute = require('./routes/UserRoute.js')
const PostRoute = require('./routes/PostRoute.js')



//connection a la bdd

const app = express();


//middleware qui permet de traiter les donnéé de le request
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
dotenv.config()


// usage of routes
app.use('/auth', AuthRoute)
app.use("/user", UserRoute)
app.use('/post', PostRoute)


//connection a la bdd
mongoose
    .connect( 
        process.env.MONGO_DB, {
            useNewUrlParser: true,
        useUnifiedTopology: true
    } )
    .then(() => app.listen(process.env.PORT, () => console.log(`server en ecoute au PORT: ${process.env.PORT}`)))
    .catch((error) => console.log(error))




