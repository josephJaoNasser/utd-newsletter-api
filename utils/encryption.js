const crypto = require("crypto")

exports.encryptText = (text) => {
  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(process.env.ENCRYPT_KEY),
      process.env.ENCRYPT_IV
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString("hex");
  } catch (e) {
    console.log("A problem has ocurred when encrypting text:", e);
    return "";
  }
};

exports.decryptText = (text) => {
  try {
    const encryptedText = Buffer.from(text, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(process.env.ENCRYPT_KEY),
      process.env.ENCRYPT_IV
    );
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString();
  } catch (e) {
    console.log("A problem has ocurred when encrypting text:", e);
    return "";
  }
};
