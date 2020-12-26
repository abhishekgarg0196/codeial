const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');
const { mainModule } = require("process");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'nodemailertestsetup',
        pass: '*************' // Generate app password https://support.google.com/accounts/answer/185833?hl=en
    }
});

let renderTemplate = (data, relativePath) => {
    // relativePath : From where the mail is being sent, is the place from where this function is called
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data, // the context we pass to the ejs which will be filled inside ejs template
        function (err, template) {
            if (err) { console.log(`Error in rendering email template : ${err}`); return; }
            mailHtml = template;
        }
    )
    return mailHtml;
};

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
};