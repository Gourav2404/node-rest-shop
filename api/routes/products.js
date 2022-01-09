const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const mongoose = require('mongoose');
// const Product = require('../models/product');
const multer = require('multer');
// const upload = multer({dest: 'uploads/'})
const chechAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination : function(req , file,cb){
        cb(null , './uploads/');
    },
    filename: function(req , file,cb) {
        let test = "img-" + Date.now() + file.originalname.substring(file.originalname.lastIndexOf(".") , file.originalname.length);
        cb(null , test);
    }
});

const fileFilter = (req , file , cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null , true);
    } else {
        cb(null , false);
    }
};

const upload = multer ({
    storage : storage 
    //  limits : {
    //     fileSize : 1024 * 1024 * 5
    // },
    // fileFilter : fileFilter
}); 

const Product = require('../models/product');



router.get('/' , (req , res , next) => {
    Product.find()
    .select('name price _id productImage ' )
    .exec()
    .then(
        docs => {
            const response = {
                count : docs.length,
                products : docs.map(doc => {
                    return {
                        name : doc.name , 
                        price : doc.price ,
                        productImage : doc.productImage,
                        _id : doc._id,
                        request : {
                            Type : 'GET' , 
                            URL : 'http;//localhost:3000/products/' + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        }
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.post('/' , upload.single('productImage'),  chechAuth , (req , res , next) => { 
    // const product = {
    //     name : req.body.name ,   //old product that we dont want now
    //     price : req.body.price
    // };
  
    console.log(req.file.path);
    const product = new Product ({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name ,
        price : req.body.price ,
        productImage : req.file.path
    });
    product
    .save()
    .then(result => {
       console.log(result);
        res.status(201).json({
            message : 'Created product successfully' ,
            createdProduct : {
                name : result.name ,
                price : result.price ,
                productImage : result.productImage,
                _id : result._id ,
                request : {
                    type : 'GET' , 
                    URL : 'http;//localhost:3000/products/' + result._id
                }
            }
            });
         })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error :err
        });
    });
    
});

router.get('/:productId' , chechAuth, (req , res , next) => {
    const id = req.params.productId ;
    Product.findById(id)
        .select('name price _id  productImage')
        .exec()
        .then(doc => {
            console.log("From Database" , doc);
            if (doc){
                res.status(200).json({
                    product :doc ,
                    request : {
                        type : 'GET' ,
                        url : 'http;//localhost:3000/products/'}
                });
            } else {
                res.status(404).json({message : "NO valid entry for provided ID"})
            }
            
        })
        .catch(err => { 
            console.log(err);
            res.status(500).json({error : err});
        });
});

router.patch('/:productId' ,chechAuth, (req , res , next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value ;
    }
    Product.update({_id : id}, {$set : updateOps}).exec()
    .then(result => {
        console.log(result);
        res.status(500).json({
            message : 'product updated',
            request : {
                type : 'GET',
                url : 'http://localhost:3000/products/' + id
        }});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.delete('/:productId' , chechAuth,(req , res , next) => {
     const id = req.params.productId;
     Product.remove({_id : id}).exec()
     .then(result => {
         res.status(200).json({
             message : 'product deleted',
             request :{
                 type :'POST',
                 url :'http://localhost:3000/products/' ,
                 body : {name : 'String' , price : 'Number'}
             }
         });
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({
            error :err
        });
    });
});

module.exports = router ;