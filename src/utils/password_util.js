import bcrypt from 'bcrypt';

export const hashPassWord = (password) => {
    return bcrypt.hashSync(password, 10);
}
export const comparePassword = (passWord, passWordHashed) => {
    return bcrypt.compareSync(passWord, passWordHashed);
}
export const hashPassWordAsync = async (password) => {
    let hashPassWord= await bcrypt.hash(password, 10);
    return hashPassWord;
}
export const comparePassWordAsync = async (passWord, passWordHashed) => {
    let status = await bcrypt.compare(passWord, passWordHashed);
    return status;
}