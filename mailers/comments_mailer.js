const nodemailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodemailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from: 'nodemailertestsetup@gmail.com', // nodemailertestsetup
        to: comment.user.email,
        subject: 'New comment published',
        html: htmlString // formatting the html in tabular format such that it looks good on mobile devices, 
        //because they do not get deformed when the table size changes
    },
        (err, info) => {
            if (err) { console.log(`Error in seding mail : ${err}`); return; }
            console.log('Message sent', info);
            return;
        });
};