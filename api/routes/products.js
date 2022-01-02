const express = require('express');
const req = require('express/lib/request');

const router = express.Router();

router.get('/' , (req , res , next) => {
    res.status(200).json({
        message : 'handling GET requests to /products'
    });
});

router.post('/' , (req , res , next) => {
    const product = {
        name : req.body.name ,
        price : req.body.price 
    };
    res.status(201).json({
        message : 'handling POST requests to /products' ,
        createdProduct : product
    });
});

router.get('/:productId' , (req , res , next) => {
    const id = req.params.productId ;
    if (id === 'special'){
        res.status(200).json({
            message : 'you discoveres the special ID' ,
            id : id 
        });
    } else {
        res.status(200).json ({
            message : 'you passed an ID'
        });
    }
})

router.patch('/:productId' , (req , res , next) => {
    res.status(200).json({
        message : 'Updated products'
    });
});

router.delete('/:productId' , (req , res , next) => {
    res.status(200).json({
        message : 'Delete products'
    });
});

module.exports = router ;