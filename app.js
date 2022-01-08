const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

// const db = 'mongodb+srv://gouravk2404:Garry@123@mycluster.cua8q.mongodb.net/node-shop?retryWrites=true&w=majority';    
// mongoose.connect(db , {
//     useMongoClient : true ,
//     useNewUrlParser:true ,
    // useUnifiedTopology: true ,
    // useFinadAndModify: false ,
    // useCreateIndex : true
//  });.then(() => {
//     console.log('Database created');
// }).catch(err => {
//     console.log(`Database not created` + err);
// });

// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://gouravk2404:Garry@123@mycluster.cua8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// })



mongoose.connect("mongodb+srv://gouravk2404:" + "3l7LCteGMb6e0jLo" /*process.env.MONGO_ATLAS_PW*/ + "@mycluster.cua8q.mongodb.net/node-shop?retryWrites=true&w=majority" , 
{   useNewUrlParser: true ,
    useUnifiedTopology: true 
}).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.log(`Database not connected` + err);
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


app.use((req , res , next) => {
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Headers" , "Origin , X-Requested-With, Content-Type, Accept , Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Acess-Control_Allow-Methods' ,'PUT , POST , PATCH , DELETE , GET ' )
        return res.status(200).json({}); 
    }
    next();
})

app.use('/products' , productRoutes);
app.use('/order' , orderRoutes);
app.use('/user' , userRoutes);

app.use((req , res , next) => {
    const error = new Error ('Not found');
    error.status(404);
    next(error)
})

app.use((error , req , res , next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message 
        }
    });
});

module.exports = app ;


//postman , vscode(search node module , node snippet , prettier , html snippet css , html css support , express snippet , npm intellisense , path intellisense , npm dependency links , node extension pack , prettier javascript , git lens , react , auto import , auto close tag , react extension pack ,  material icon theme , )