const express = require("express");
const app = express();

// Enable POST middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));

// Set CORS headers
app.use(function(_, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Set up routes
const path = require("path");
const router = express.Router();
router.route("/")
    .get((_, res) => {
        res.sendFile(path.join(__dirname, "index.html"));
    });
app.use("", router);

// Run server
const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log('Application listening on PORT: ' + PORT);

module.exports = app;
