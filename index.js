require('dotenv').config();
const express=require('express');
const path=require('path');
const app=express();
const Userrouter=require('./routes/user')
const blogrouter=require('./routes/blog')
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');
const PORT=process.env.PORT || 8000;
app.set('view engine','ejs');
app.set('views',path.resolve('./views'));
mongoose.connect(process.env.MONGO_URL).then(console.log('MongoDb connected'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve(`./public`)))
app.use('/user',Userrouter);
app.use('/blog',blogrouter);

app.get('/',async (req,res)=>{
  const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user,
        Blog:allBlogs,
    });
})
app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
    
})