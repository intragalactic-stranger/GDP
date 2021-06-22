require("dotenv").config()
const express = require('express')
const app = express()
const path = require("path")
const logger = require("morgan")
const mongoose = require("mongoose")
const User = require("./models/user")
const session = require("express-session")
const Blog = require('./models/blog')
const methodOverride = require('method-override')





app.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true
  }))



app.set("view-engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))
//public or static= css 
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/css",
express.static(path.join(__dirname,"node_modules/mdb-ui-kit/css")));
app.use("/js",
express.static(path.join(__dirname,"node_modules/mdb-ui-kit/js")));







const db = require('./config/keys').MongoURI;
const { equal } = require("assert")
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,useCreateIndex: true, 
    useUnifiedTopology: true,
    }).then(() => console.log("DB connected "))
      .catch(err => console.log(err))










      app.use(methodOverride('_method'))













//SIGNUP GET
app.get("/login", (req, res) => {
    res.render("login.ejs")
  })
  
  //SIGNUP POST
  app.post("/signup", async (req, res) => {
    console.log(req.body)
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
      await user.save();
      res.redirect("/login")
    } catch {
      res.redirect("/")
  
    }
  
  })
  
  //LOGIN GET
  app.get("/login", (req, res) => {
    res.render("login.ejs")
  })
  
  //LOGIN POST
  app.post("/signin", async (req, res) => {
      console.log(req.body)
   await User.findOne({email:req.body.email}).then(data =>{
    console.log("DATA",data) 
    if(req.body.password == data.password){
       req.session.user =data
       res.redirect("/dashboard")
     }
   }).catch(e=>{
     console.log(e)
     res.send("error")
   })
  
  })










//Blog -add
app.post("/addblog",async (req,res)=>{
  try{
  const blog = new Blog(
    {
      userId:req.session.user._id,
      title:req.body.title,
      content:req.body.content
      
    }
  )
  await blog.save()
  console.log("blog added")
  res.redirect("/dashboard")
  }catch{
      res.send("error")
  }
})


//blog -edit 
app.post("/updateblog/:id" , async (req, res )=> {
  await Blog.findOneAndUpdate({_id: req.params.id} , 
  {$set:{
    title: req.body.title, 
    content: req.body.content 

  }
}).then(result =>{
  if(result){
    console.log("BlogUpdated")
    res.redirect("/dashboard")
  }else{
    res.send("error")
  }
}).catch(e=>{
  res.send("error in catch")
})
}) 


//blog    -delete 
app.post("/deleteblog/:id" , async (req, res )=> {
await Blog.findOneAndDelete({_id: req.params.id}).then(result =>{
  if(result){
    console.log("Blog deleted")
    res.redirect("/dashboard")
  }else{
    res.send("error")
  }
}).catch(e=>{
  console.log(e) ;
  res.send("error in catch")
})


})








app.get("/",(req , res) =>{
    res.render("index.ejs")

}
)
app.get("/about",(req , res) =>{
    res.render("about.ejs")

}
)
app.get("/tech",(req , res) =>{
    res.render("tech.ejs")

}
)
app.get("/travel",(req , res) =>{
    res.render("travel.ejs")

}
)
app.get("/upgrade",(req , res) =>{
    res.render("upgrade.ejs")

}
)
app.get("/reviews",(req , res) =>{
    res.render("reviews.ejs")

}
)
app.get("/lifestyle",(req , res) =>{
    res.render("lifestyle.ejs")

}
)
app.get("/dashboard" ,async (req,res) =>{
  await Blog.find({userId:req.session.user._id}).then(blog => {
    console.log(blog)
    res.render("dashboard.ejs",{
      blogs:blog,
    })
  })

})
app.get("/editblog/:id" , async (req,res) =>{
  await Blog.findById(req.params.id).then(blog=> {
   if (req.session.user._id == blog.userId){
     res.render("editblog.ejs" , {
       blog:blog 
     } )
   }else{
     res.redirect("/dashboard")
   }
   }) .catch(e => {
    console.log(e)
    res.send("error")
  })
})


//logout
app.post("/logout" , (req, res)=>{
  
   req.session.destroy()
   res.redirect("/")
})






//middlewares
function checkAuthentication (req, res, next ) 
{
  if (req.session.user){
    return next ();
    
  }

    else {
      res.redirect("/")
    }
}

app.use( function ( req, res ){
  res.send("Page not found");
})



  app.listen(80, () => {
    console.log("listening to port 80")
  })





  