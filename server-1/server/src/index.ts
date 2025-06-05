import mongoose  from "mongoose";
import app  from "./app";

const PORT = process.env.PORT || 5001;
const MONGO_URI= process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI).then(()=>{
    console.log("✅ Connected to MongoDB");
    app.listen(PORT,()=>{
              console.log(`🚀 Server is running on http://localhost:${PORT}`);

    })
})
.catch((err)=>{
    console.error("Connection Failed",err);

})