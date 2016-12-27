
var config = require('../config.js');
var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'v10258@qq.com',
        pass: 'raplqvmunccccaig'
    }
};

var mailOptions = {
    from: '"聂风"<v10258@qq.com>',
    to: 'chenjinghui@meizu.com',
    subject: 'Test a mail',
    html: '<b>Hello world 🐴</b>', // html body
    generateTextFromHtml: true
};


module.exports = function(){
    var transporter = nodemailer.createTransport(smtpConfig);

    return {
        send: function(to, subj, body) {
            Object.assign(mailOptions, {
                to: to,
                subject: subj,
                html: body
            });

            transporter.sendMail(mailOptions, function(err){
                if(err) {
                    return console.error('Unable to send email:' + err);
                }
            })
        },
        emailError: function(message, filename, exception) {
            var body = '<h1>Meadowlark Travel Site Error</h1>' + 'message:<br><pre>' + message + '</pre><br>';
            if (exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
            if (filename) body += 'filename:<br><pre>' + filename + '</pre><br>';

            mailTransport.sendMail({
                to: errorRecipient,
                subject: 'Meadowlark Travel Site Error',
                html: body
            }, function(err) {
                if (err) console.error('Unable to send email: ' + err);
            });
        }
    }
}





//var transporter = nodemailer.createTransport('smtps://v10258@qq.com:raplqvmunccccaig@smtp.qq.com');


/*var mailTransport = nodemailer.createTransport('SMTP', {
    host: 'smtp.qq.com',
    secureConnection: true,
    auth: {
        user: config.mail.user,
        pass: config.mail.password
    }
})*/