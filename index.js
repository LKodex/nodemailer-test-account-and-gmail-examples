const { createTransport, createTestAccount } = require("nodemailer");
require('dotenv').config();

function sendMailUsingTestAccount() {
    // nodemailer.createTestAccount uses Ethereal Email
    createTestAccount(async (err, account) => {
        if (err) {
            console.error(`[ERROR] An error occurred. ${err.name}: ${err.message}`);
            return process.exit(1);
        }

        const transporter = createTransport({
            port: account.smtp.port,
            host: account.smtp.host,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });

        const info = await transporter.sendMail({
            from: `"Sender Name" <${account.user}>`,
            to: `"Recipient Name" <${account.user}>`,
            subject: "Nodemailer Test",
            text: `Hello, from ${account.user}, that's a simple email test.`,
            html: `<h1>Hello,</h1> from ${account.user}, that's a simple email <b>test</b>.`,
        });
        console.log(`[LOG] Info about mail sent \n${info.messageId}`);
    });
}

function sendMailUsingGmail() {
    const SMTPS_PORT = 587;
    const GMAIL_SMTPS_ADDRESS = "smtp.gmail.com";

    const transporter = createTransport({
        port: SMTPS_PORT,
        host: GMAIL_SMTPS_ADDRESS,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD, // See .env.example file
        },
    });

    transporter.verify((error, success) => {
        if (success)
            return console.log("[LOG] Nodemailer is working fine with the actual configuration and you can send emails.");
        return console.error(`[ERROR] ${error}`);
    });
}

sendMailUsingTestAccount();
sendMailUsingGmail();

