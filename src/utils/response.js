class Response{
    constructor(data=null,message=null){
        this.data = data;
        this.message = message;
    }
    
    success(res){
        return res.status(200).json({
            success:true,
            data:this.data,
            message:this.message ?? "İşlem başarılı."
        })
    }

    created(res){
        return res.status(201).json({
            success:true,
            data:this.data,
            message:this.message ?? "Kayıt başarılı."
        })
    }

   deleted(res) {
        return res.status(204).send(); 
    }

     ok(res) {
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.message || "İşlem başarılı."
        });
    }
}

module.exports = Response;