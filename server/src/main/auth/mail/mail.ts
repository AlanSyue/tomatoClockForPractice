import * as nodemailer from 'nodemailer'

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'marcelina.block54@ethereal.email',
        pass: '9FM7JeFkFGZ5nfA71Y'
    }
});



