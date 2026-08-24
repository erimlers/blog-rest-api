const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL)
.then(() =>{
    console.log("MongoDB bağlantısı başarılı.");
})
.catch((err) =>{
    console.log("MongoDB bağlantısı başarısız.", err);
})
