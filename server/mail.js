import nodemailer from 'nodemailer';

// Create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'noreply.idraw@gmail.com',
        clientId: '815233616125-lalqpisb3e9s76ct6n2j5al10bf5fsvi.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04AWX2ofMwLH7CgYIARAAGAQSNwF-L9IrX8D9A671x_yA8D22eCQDJS7ZHeiMFMNWlq9y3SPOzQm52bW-HjwLmgf8AcMfO3k2PCY',
        accessToken: 'ya29.A0AVA9y1sSBDaF5JyZdVCkQyj1xyVN6h0x0x3Dy_CKqMkdQdiSSWKBcqdftwIL2sId1AHppC-Q-R5D9YL6WCKnbjPl_yfRoTPbwyUQX0cwJuxP8gmtU9PtfvjSlqAd6E5fMvjvCKwaB5buwqVeqMZ8eI7CkPf8aCgYKATASATASFQE65dr89tvu8WAEpGxN21r9Uu26GQ0163'
    }
});

// Export the transporter object
export const mailTransporter = transporter;