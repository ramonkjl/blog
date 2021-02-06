if(process.env.NODE_ENV == "production"){
    module.exports = {MONGODB_URI:'mongodb+srv://ramon_teste:32251049@ramon.lxiex.mongodb.net/ramon_teste_mongo?retryWrites=true&w=majority'}
}else{
    module.exports = {MONGODB_URI:'mongodb://localhost/blogapp'}

}