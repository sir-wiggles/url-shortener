var express = require("express");
var redis = require("redis");
var url_regex = require("url-regex");
var base64_url = require("base64-url");
var body_parser = require("body-parser");

var app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

var client = redis.createClient(process.env.REDIS_URL);

app.post("/", function(req, res){

    var url = req.body.url;
    var base = "https://safe-earth-31395.herokuapp.com/";

    if (!(url_regex({exact: true}).test(url))) {
        res.send({error: "Invalid URL"});
    }

    var encoded = base64_url.encode(url);
    client.set(encoded, url);
    res.send({original_url: url, short_url: base+encoded});
});

app.get("/:short", function(req, res) {
    client.get(req.params.short, function(err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(301, {Location: data});
        res.end();
    })
})

app.get("/", function(req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.listen(process.env.PORT || 8000, function() {
    console.log("Listening on port " + (process.env.PORT || 8000));
});
