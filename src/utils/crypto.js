import CryptoJS from 'crypto-js';

/**
 * Decrypts an encrypted ciphertext using AES with the provided password.
 * Supports CryptoJS AES encryption, plaintext URLs, and base64 fallbacks.
 *
 * @param {string} encryptedText - The encrypted string/ciphertext
 * @param {string} password - The password/access key
 * @returns {Promise<string>} The decrypted plaintext string
 */
export async function decryptText(encryptedText, password) {
  if (!encryptedText || !password) {
    throw new Error('Encrypted payload and password are required.');
  }

  const cleanPassword = String(password).trim();

  // If already a plaintext URL (useful for development/testing)
  if (encryptedText.startsWith('http://') || encryptedText.startsWith('https://')) {
    return encryptedText;
  }

  // 1. Try standard CryptoJS AES decryption
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, cleanPassword);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (decrypted && (decrypted.startsWith('http://') || decrypted.startsWith('https://') || decrypted.startsWith('http'))) {
      return decrypted;
    }
  } catch (err) {
    // Continue to fallback checks
  }

  // 2. Try base64 decoding fallback
  try {
    const decoded = atob(encryptedText);
    if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
      return decoded;
    }
  } catch (err) {
    // Ignore and throw invalid password error
  }

  throw new Error('Incorrect password or decryption failure');
}

/**
 * Encrypts a plain text string using AES with a given password.
 * @param {string} plainText
 * @param {string} password
 * @returns {string} The ciphertext string
 */
export function encryptText(plainText, password) {
  return CryptoJS.AES.encrypt(plainText, String(password).trim()).toString();
}
