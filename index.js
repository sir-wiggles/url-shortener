var express = require("express");

var app = express();

app.get("/", function(req, res){
    res.send("hello");
});


app.listen(process.env.PORT || 8000, function() {
    console.log("Listening on port " + (process.env.PORT || 8000));
});
