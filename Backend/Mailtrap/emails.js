import { mailtrapClient, sender } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE } from "./email.template.js"

export const sendVerificationEmail = async(email, verificationToken) =>{
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: "Email Verification",
        })
        console.log('response sending email', response)
    } catch (error) {
        console.error('error sending verification email ', error);
        
        throw new Error(`error sending verification email ${error}`)
    }

}