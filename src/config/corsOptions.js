const whiteList = ["http://localhost:3000"]

const corsOptions = (req,cb) => {
    let origin = req.headers.origin;
    if(!origin || whiteList.includes(origin)){
        cb(null,{ origin: true, credentials: true });
    }else{
        cb(new Error("CORS hatası"));
    }
}

module.exports = corsOptions;