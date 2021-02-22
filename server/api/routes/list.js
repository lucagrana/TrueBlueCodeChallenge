const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Element = require('../models/element');

// To see all elements
router.get('/', (req, res, next) => {
    Element.find()
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

//To see one element
router.get('/:elementId', (req, res, next) => {
    const id = req.params.elementId;
    Element.findById(id)
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});
// To insert a new element
router.post('/', (req, res, next) => {
    
    if (req.body.title.length>100 || req.body.description.length>500) {
        return res.status(400).send('Bad request');
    }

    let element = new Element({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        expiringDate: req.body.expiringDate
    });
    element.save()
    .then(result => {
        console.log(result);
        res.status(200).json({});
    })
    .catch(err => console.log(err));
});

// To delete an element
router.delete('/:elementId', (req, res, next) => {
    const id = req.params.elementId;
    Element.findById(id)
    .exec()
    .then(doc => {
        Element.deleteOne({_id: id})
        .exec()
        .then(result => {
            console.log(res);
            res.status(200).json({
                message: id
            });
        })
        .catch(err => {
            res.status.json({
                error: "Error in the delete"
            });
        }); 
    })
    .catch(err => {
        res.status(404).send('Element not found');
    });
    
});

//To update an element
router.patch('/:elementId', (req, res, next) => {
    const id = req.params.elementId;
    Element.findById(id)
    .exec()
    .then(doc => {
        doc.title = req.body.title;
        doc.description = req.body.description;
        doc.status = req.body.status;
        doc.expiringDate = req.body.expiringDate;
        Element.updateOne({_id: id}, {$set: doc})
                .exec()
                .then(result => {
                    console.log(doc);
                    res.status(200).json(doc);
                })
                .catch(err => {
                    res.status.json({
                        error: "Error in the update"
                    });
                });  
    })
    .catch(err => {
        res.status(404).send('Element not found');
    });
    
});

module.exports = router;