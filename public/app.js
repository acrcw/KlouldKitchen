const express = require("express")
const app=express();
app.listen(3000);

app.get('/about',function (req,res){
    res.sendFile('./index.html',{root:__dirname});
})

app.get('/',function (req,res){
    res.redirect('/about');
})

app.use(function (req,res){
    res.send('page not found');
})

