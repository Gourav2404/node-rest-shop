const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/orders');

const Product = require('../models/product');

router.get('/' , (req ,res , next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product' , 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count : docs.length ,
            Order : docs.map(doc => {
                return {
                    _id : doc._id,
                    product : doc.product ,
                    quantity : doc.quantity,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/order/' + doc._id
                    }
                };
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });
});

router.post('/' , (req ,res , next) => {
    Product.find(req.body.productId)
    .then(product => {
        if (!product){
            return res.status(404).json({
                message : 'Product not found'  
            });
            return ;
        }
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            product : req.body.productId
        });
        return order.save() ;
        })
        .then(result => { 
            console.log(result);
            res.status(201).json({
                message : 'Order stored',
                createOrder : {
                    _id: result._id ,
                    product : result.product ,
                    quantity: result.quantity
                },
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/order/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });    

// testing the nodemon

router.get('/:orderId' , (req ,res , next) => {
    Order.findById(req.params.orderId)
    .populate('product' , 'name')
    .exec()
    .then(
        order => {
            res.status(200).json({
                order: order,
                request: {
                    type : 'GET',
                    url : 'http://localhost:3000/order'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error :err 
            });
        });
});

router.delete('/:orderId' , (req ,res , next) => {
    res.status(200).json({
        message : 'order deleted',
        orderId : req.params.orderId
    });
})

module.exports = router ;