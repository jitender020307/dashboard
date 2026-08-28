/**
 * Cryptographic Utility for Document & Evidence Integrity
 * Uses standard W3C Web Crypto API (SubtleCrypto) for authentic client-side SHA-256 hashing.
 */

export async function calculateFileSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return calculateBufferSha256(arrayBuffer);
}

export async function calculateBufferSha256(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export async function calculateTextSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function generateSignatureSnippet(signerName: string, role: string, hash: string): string {
  const timestamp = new Date().toISOString();
  return `SIG-PKI-${signerName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}-${hash.slice(0, 12)}-${timestamp.slice(0, 10)}`;
}
