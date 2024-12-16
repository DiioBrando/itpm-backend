import crypto from 'crypto';

const secretKey = Buffer.from('n203@C[i?4g_i2-g22FA%f+)_(g]-in!', 'utf8');
const algorithm = 'aes-256-cbc';
export default class CryptoInfo {
   static encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { encryptedData: encrypted, iv: iv.toString('hex') };
    }

   static decrypt(encryptedData, ivHex) {
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };
}
