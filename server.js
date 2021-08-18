const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded( { extended: false } )); // this is to handle URL encoded data
// end parser middleware
//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({origin: "*" }));

// custom middleware to log data access
const log = function (request, response, next) {
    next();
}
app.use(log);
// end custom middleware


// enable static files pointing to the folder "public"
// this can be used to serve the index.html file
app.use(express.static(path.join(__dirname, "public")));

app.get('/success', function (req, res) {
    res.sendFile(__dirname + '/public/success.html')
})

// HTTP POST
app.post("/sendmail", function(request, response) { // this will be used to send the emails
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "briannahabwe@gmail.com", // this should be YOUR GMAIL account
            pass: "jmryidmwgjnkgyds" // this should be your password
        }
    });

    var textBody = `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`;
    var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`;
    var mail = {
        from: "briannahabwe@gmail.com", // sender address
        to: "nahabwebrian24@gmail.com", // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
        subject: "Mail From Resume Form", // Subject line
        text: textBody,
        html: htmlBody
    };

    // send mail with defined transport object
    transporter.sendMail(mail, function (err, info) {
        if(err) {
            console.log(err);
            response.send({ message: "message not sent: an error occurred; check the server's console log" });
        }
        else {
            // response.send('Email Sent Successfully');
            response.redirect('/success');
        }
    });
});


// set port from environment variable, or 8000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));