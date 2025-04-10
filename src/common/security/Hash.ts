import * as bcrypt from 'bcrypt';


export const Hash = (plainText: string, saltRounds: number = Number(process.env.SALT_ROUNDS)): string => {
    return bcrypt.hashSync(plainText, saltRounds)
}


export const verifyHashing = (plainText: string, hashedText: string): boolean => {
    return bcrypt.compareSync(plainText, hashedText)
}