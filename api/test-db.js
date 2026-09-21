// File: api/test-db.js
import admin from 'firebase-admin';

export default async function handler(req, res) {
  try {
    // 1. Cek apakah Environment Variable terbaca
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      return res.status(500).json({
        success: false,
        message: 'Gagal: Variable FIREBASE_SERVICE_ACCOUNT tidak ditemukan di Vercel.'
      });
    }

    // 2. Coba parse JSON dan inisialisasi Firebase Admin
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    // 3. Tes koneksi ringkas ke Firestore
    const db = admin.firestore();
    await db.listCollections();

    return res.status(200).json({
      success: true,
      message: 'Sempurna! Firebase Admin SDK berhasil terhubung ke Firestore dari Vercel.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses kunci rahasia / koneksi Firebase',
      errorDetail: error.message
    });
  }
}
