/**
 * Converts a Uint8Array to a Base64 string.
 */
function uint8ArrayToBase64(arr) {
  let binary = '';
  const len = arr.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return window.btoa(binary);
}

/**
 * Converts a Base64 string to a Uint8Array.
 */
function base64ToUint8Array(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypts clear text with a password using AES-256-GCM.
 * Used primarily for local encryption generation.
 * 
 * @param {string} text - The clear text to encrypt.
 * @param {string} password - The password key.
 * @returns {Promise<string>} The base64-encoded encrypted package containing salt + iv + ciphertext.
 */
export async function encryptText(text, password) {
  const encoder = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    aesKey,
    encoder.encode(text)
  );

  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encryptedArray, salt.length + iv.length);

  return uint8ArrayToBase64(combined);
}

/**
 * Decrypts a base64-encoded encrypted package with a password using AES-256-GCM.
 * 
 * @param {string} encryptedBase64 - The base64-encoded package.
 * @param {string} password - The password key.
 * @returns {Promise<string>} The decrypted clear text.
 */
export async function decryptText(encryptedBase64, password) {
  try {
    const combined = base64ToUint8Array(encryptedBase64);
    
    // Check minimal length: salt (16) + iv (12) + tag (16) = 44 bytes minimum
    if (combined.length < 44) {
      throw new Error("Invalid cipher package size");
    }

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const encoder = new TextEncoder();
    const passwordKey = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      aesKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (e) {
    throw new Error("Invalid password");
  }
}
