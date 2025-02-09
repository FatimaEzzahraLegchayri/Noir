import { mailtrapClient, sender } from "./mailtrap.config.js"
import { 
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE
} from "./email.template.js"

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
    } catch (error) {
        console.error('error sending verification email ', error);
        
        throw new Error(`error sending verification email ${error}`)
    }

}

export const sendWelcomeEmail = async (email, name) =>{
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to:recipient,
            template_uuid: "9483fb56-164f-4caa-ab1d-a2e34b32be5d",
            template_variables: {
                "name": name,
                "company_info_name": "Noir"
            }
        })

    } catch (error) {
        console.log('error sending welcome email', error);
        throw new Error (`error sending welcome email ${error}`)
        
    }
}

export const sentResetPasswordEmail = async (email, url) => {
    const recipient = [{email}]
   try {
    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: 'Reet your pasword',
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', url),
        category: 'Password Reset'

    })
    console.log('response, reset...', response)
   } catch (error) {
    console.log('error sending reset password email', error);
    throw new Error (`error sending reset password email: ${error}`)
    
   }
}