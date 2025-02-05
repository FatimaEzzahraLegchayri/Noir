export const generateCode = () =>{
    //generate a randone 6 digits code
    return Math.floor(10000 + Math.random() * 900000).toString()
}