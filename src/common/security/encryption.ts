import * as CryptoJS from "crypto-js";

export const Encrypt = (plainText: string, secret: string = process.env.ENCRYPT_KEY as string) => {
    return CryptoJS.AES.encrypt(plainText, secret).toString();
}
export const Decrypt = (encryptedText: string, secret: string = process.env.ENCRYPT_KEY as string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secret);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

}