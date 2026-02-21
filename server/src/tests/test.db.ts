import mongoose from "mongoose";


export async function verifyData(){
    const data = await mongoose.connection.db?.collection('user').countDocuments();
    console.log(`current data count ${data}`)
}