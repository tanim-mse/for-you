// src/utils/auth.js
// The password hash is embedded here — safe to commit.
// The real password never appears anywhere in the code.

// HOW TO GET YOUR HASH:
// 1. Choose a password (something she'd know — a shared word, a date, her name + a number)
// 2. Open your browser console (F12)
// 3. Paste this and press Enter, replacing "yourPassword":
//    (async () => { const e = new TextEncoder().encode("yourPassword".toLowerCase().trim()); const h = await crypto.subtle.digest('SHA-256', e); console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('')); })()
// 4. Copy the long string it prints
// 5. Paste it as STORED_HASH below

const STORED_HASH = "REPLACE_THIS_WITH_YOUR_HASH";

export async function checkPassword(input) {
  const encoded = new TextEncoder().encode(input.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hash === STORED_HASH;
}

export function isAuthenticated() {
  return localStorage.getItem('auth') === 'true'
      || sessionStorage.getItem('auth') === 'true';
}

export function setAuthenticated(remember) {
  if (remember) {
    localStorage.setItem('auth', 'true');
  } else {
    sessionStorage.setItem('auth', 'true');
  }
}
