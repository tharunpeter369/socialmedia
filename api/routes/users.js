var express = require('express');
var router = express.Router();
// const router = require('express').Router();
const bcrypt = require('bcrypt')
const User = require('../models/User');
const { rawListeners } = require('../models/User');



//Update user 
router.put('/:id',async(req, res)=>{
    console.log(req.body);
    console.log(req.params);
    if(req.body.userid === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt =await bcrypt.genSaltSync(10);
                req.body.password =await bcrypt.hashSync(req.body.password, salt);
            }catch(err){
                res.status(500).json({message: err})
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body})
            console.log(user);
            if(user != null){
                res.status(200).json({message:'account has been updated successfully'})
            }else{
                res.status(404).json({message:'acount not found'})
            } 
        }catch(err) {
            res.status(500).json({message: err})
        }
    }else{
        res.status(403).json("You can update only your account!");
    }
})



//Delete user
router.delete('/:id',async(req, res)=>{
    console.log(req.body);
    console.log(req.params);
    if(req.body.userid === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json({message:'account has been Deleted successfully'})
        }catch(err) {
            res.status(500).json({message: err})
        }
    }else{
        res.status(403).json("You can delete only your account!");
    }
})


//Get user(search for a user)  // post man works
// router.get('/:id',async(req, res)=>{
//     console.log(req.body);
//     console.log(req.params);
//     try{
//         const user = await User.findById(req.params.id);
//         const { password, updatedAt, ...other } = user._doc;
//         console.log(other);
//         res.status(200).json(other);
//     }catch(err) {
//         res.status(500).json(err);
//     }

// })


//Get user(search for a user)
router.get('/',async(req, res)=>{
    const userid = req.query.userid
    const username = req.query.username
    // console.log(req.body);
    // console.log(req.params);
    try{
        const user =userid? await User.findById(userid)
        : await User.findOne({username:username})
  
        const { password, updatedAt, ...other } = user._doc;
        // console.log(other);
        res.status(200).json(other);
    }catch(err) {
        res.status(500).json(err);
    }

})

//get Frieds
router.get('/Friends/:userid', async(req, res)=>{
    console.log('fffffffffffffffffdddddddddddddddddddddddd');
    try{
        const user = await User.findById(req.params.userid)
        const friends = await Promise.all(
            user.following.map(friendId =>{
                return User.findById(friendId)
            })
        )
        let friendsList = []
        friends.map((eachfriend)=>{
            const {_id,username,profilePicture} = eachfriend
            friendsList.push({_id,username,profilePicture})
        })
        console.log(friendsList);
        res.status(200).json(friendsList)
    }catch(err){
        res.status(500).json(err)
    }
})


//Follow user
router.put('/:id/follow',async(req, res)=>{
    console.log(req.body);
    console.log(req.params);
    if(req.params.id !== req.body.id){
        try{
            const user = await User.findById(req.params.id)

            const currentUser = await User.findById(req.body.id)
            if(!user.followers.includes(req.body.id)){
                await user.updateOne({$push:{followers:req.body.id}})
                console.log(user);

                await currentUser.updateOne({$push:{following:req.params.id}})
                console.log(currentUser);
                res.status(200).json({message:'user has been followed'})
            }else{
                res.status(403).json({message:'you already have followings this user'})
            }
        }catch(err) {
            res.status(500).json(err); 
        }
    }else{
        res.status(403).json({message:'you cant for yourself'});
    }
})

//unfollow user

router.put('/:id/unfollow',async(req, res)=>{
    console.log(req.body);
    console.log(req.params);
    try{
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.id)
        if(user.followers.includes(req.body.id)){
            await user.updateOne({$pull:{followers:req.body.id}})
            await currentUser.updateOne({$pull:{following:req.params.id}})
            res.status(200).json({message:'user has been unfollowed'})
        }else{
            res.status(403).json({message:'you already unfollowed this user'})
        }
    }catch(err) {
        res.status(500).json(err); 
    }
})


//Unfollow user



module.exports = router

