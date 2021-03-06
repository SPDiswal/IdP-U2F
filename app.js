var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var index = require("./routes/index");
var exit = require("./routes/exit");
var manage = require("./routes/manage");
var register = require("./routes/register");
var yubikey = require("./routes/yubikey");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: "u2f"}));

app.use("/", index);
app.use("/exit", exit);
app.use("/manage", manage);
app.use("/register", register);
app.use("/yubikey", yubikey);

// Error handlers.
app.use(function (req, res, next)
{
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

if (app.get("env") === "development")
{
    app.use(function (err, req, res, next)
    {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next)
{
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

module.exports = app;
