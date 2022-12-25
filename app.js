const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    var fN = req.body.fname;
    var lN = req.body.lname;
    var email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fN,
                    LNAME: lN
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/9b1875abdf";
    const options = {
        method: "POST",
        auth: "divyansi01:4d29c727e397539a6fed0df742df91dc-us9"

    }


    const reques = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    reques.write(jsonData);
    reques.end();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3002, function () {
    console.log("Server running on port 3002");
});

// 4d29c727e397539a6fed0df742df91dc-us9
// 9b1875abdf