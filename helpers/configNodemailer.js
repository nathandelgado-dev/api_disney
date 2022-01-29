const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASS}`,
    }
});

function mailOptions(email, subject) {
    const mailOptions = {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: `${email}`,
        subject: `${subject}`,
        html: `<h1>${subject}</h1>
        <p>Congratulations you are registered.</p> 
        <p>¡Welcome to Disney API!</p> 
        `
    };
    return mailOptions;
}

module.exports = {
    transporter,
    mailOptions
};