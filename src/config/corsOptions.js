const whiteList = ["http://localhost:8080"]

const corsOptions = (req,cb) => {
    let origin = req.headers.origin;
    if(!origin || whiteList.includes(origin)){
        cb(null,true);
    }else{
        cb(new Error("CORS hatası"));
    }
}

module.exports = corsOptions;