/**
 * EarthOS Shared Crypto Utilities
 * Cryptography and hashing functions
 */

import crypto from 'crypto';

export const cryptoUtils = {
  /**
   * Generate a unique device ID
   */
  generateDeviceId(): string {
    const randomPart = crypto.randomBytes(8).toString('hex').slice(0, 16);
    return `earth-${randomPart}`;
  },

  /**
   * Generate a unique app installation ID
   */
  generateInstallationId(): string {
    return crypto.randomUUID();
  },

  /**
   * Calculate SHA256 checksum of a buffer
   */
  calculateChecksum(data: Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  },

  /**
   * Calculate SHA256 checksum of a file (stream-friendly)
   */
  async calculateFileChecksum(filePath: string): Promise<string> {
    const fs = await import('fs');
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  },

  /**
   * Verify checksum
   */
  verifyChecksum(data: Buffer, expectedChecksum: string): boolean {
    const actualChecksum = this.calculateChecksum(data);
    return actualChecksum === expectedChecksum.toLowerCase();
  },

  /**
   * Generate a secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  },

  /**
   * Hash a password (for auth)
   */
  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  },

  /**
   * Sign data with a private key
   */
  signData(data: string, privateKey: string): string {
    return crypto
      .createHmac('sha256', privateKey)
      .update(data)
      .digest('hex');
  },

  /**
   * Verify signed data
   */
  verifySignature(data: string, signature: string, publicKey: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', publicKey)
      .update(data)
      .digest('hex');
    return signature === expectedSignature;
  },
};

export default cryptoUtils;
