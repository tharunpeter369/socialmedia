const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    // const url='mongodb+srv://tharun:8907603367@cluster0.oipc7.mongodb.net/socialMedia?retryWrites=true&w=majority',
    const url='mongodb://localhost:27017'
    const dbname='socialMedia'

    mongoClient.connect(url,(err,data)=>{
        if(err){
            return done(err)
        }else{
            state.db=data.db(dbname)
            done()
        }  
    })
}

module.exports.get=function(){
    return state.db
}