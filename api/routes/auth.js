const express = require('express');
router = express.Router()
const mongoose = require('mongoose')
// router = require('express').Router()
var db=require('../config/connection')
const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const User = require('../models/User');

// const router = require('./users');

//Retgister
router.post('/register',async(req, res)=> {
  
    //  await db.get().collection('User').insertOne({'name':'tharun'})
    console.log(req.body);
      try {
            //generate new encrypted password
            const salt =await bcrypt.genSaltSync(10);
            const hash =await bcrypt.hashSync(req.body.password, salt);
              //create new user
              const newUser =await new User({
                  username: req.body.username,
                  email: req.body.email,
                  password: hash ,
               });
        // save to dta database and return response
        const user = await newUser.save()
        res.status(200).json(user)
      }catch(err){
        res.status(500).json(err)
      }
    // res.send('200')
})

//LOGIN
router.post('/login',async(req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({email: req.body.email});
    !user && res.status(404).json({message:"user not find"})

    const validPassword = await bcrypt.compareSync(req.body.password, user.password); 
    !validPassword && res.status(404).json({message:"password mismatch"})

    res.status(200).json(user)

  }catch(err){ res.status(500).json(err)}
})




module.exports = router