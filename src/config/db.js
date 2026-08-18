const mongoose = require("mongoose");
const { toTurkeyDate } = require("../utils/dateFormatter");

mongoose.connect(process.env.DB_URL)
.then(() =>{
    console.log("MongoDB bağlantısı başarılı.");
})
.catch((err) =>{
    console.log("MongoDB bağlantısı başarısız.", err);
})

mongoose.plugin((schema) => {
    schema.set('toJSON', {
        transform: function (doc, ret) {
            if (ret.createdAt) ret.createdAt = toTurkeyDate(ret.createdAt);
            if (ret.updatedAt) ret.updatedAt = toTurkeyDate(ret.updatedAt);
            return ret;
        }
    });
});