const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../Models/listing.js');

main().then((res)=>{
    console.log('connection to DB');
}).catch((err=>{
    console.log('error connecting to DB');
}))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

Listing.deleteMany({}).then((res)=>{
    console.log('deleted all listings');
}).catch((err)=>{
    console.log('error deleting listings');
});
initdata.data = initdata.data.map((obj)=>({...obj,owner: "675337b13c3fcc45764c6a64"}))
Listing.insertMany(initdata.data).then((res)=>{

    console.log("done inserting");
}).catch((err)=>{
    console.log('error inserting listings');
});