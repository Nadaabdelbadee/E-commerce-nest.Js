import { createTransport, sendMailOptions } from "nodemailer"

export const sendEmail = async (data: sendMailOptions) => {

    const transporter = createTransport({
        host: "smtp.gmail.email",
        service: "gmail",
        port: 465,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });


    const info = await transporter.sendMail({
        from: `"Nada😁" <${process.env.EMAIL}>`, // sender address
        ...data
    });

    console.log("Message sent: %s", info.messageId);
}