import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBkik59dur08gL4_qL9vxHtWnfwKd_FpXc",
    authDomain: "peminjaman-ruang-b22d9.firebaseapp.com",
    projectId: "peminjaman-ruang-b22d9",
    storageBucket: "peminjaman-ruang-b22d9.firebasestorage.app",
    messagingSenderId: "215586677183",
    appId: "1:215586677183:web:effc4a25cd478b6169010a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// tombol kirim
window.kirimData = async function () {
  const nama = document.getElementById("nama").value;
  const tanggal = document.getElementById("tanggal").value;
  const jamMulai = document.getElementById("jamMulai").value;
  const jamSelesai = document.getElementById("jamSelesai").value;
  const keterangan = document.getElementById("keterangan").value;

  await addDoc(collection(db, "peminjaman"), {
    nama,
    tanggal,
    waktu: jamMulai + " - " + jamSelesai,
    keterangan
  });

  alert("Berhasil dikirim");
};

// tampilkan data realtime
const tabel = document.getElementById("tabelData");

if (tabel) {
  onSnapshot(collection(db, "peminjaman"), (snapshot) => {
    tabel.innerHTML = "";

    snapshot.forEach((doc) => {
      const d = doc.data();

      tabel.innerHTML += `
        <tr>
          <td>${d.nama}</td>
          <td>${d.tanggal}</td>
          <td>${d.waktu}</td>
          <td>${d.keterangan}</td>
        </tr>
      `;
    });
  });
}
