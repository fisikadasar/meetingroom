import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// FIREBASE CONFIG
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
const colRef = collection(db, "peminjaman");

// ================= USER KIRIM =================
window.kirimData = async function () {
  try {
    const nama = document.getElementById("nama").value.trim();
    const tanggal = document.getElementById("tanggal").value;
    const jamMulai = document.getElementById("jamMulai").value;
    const jamSelesai = document.getElementById("jamSelesai").value;
    const keterangan = document.getElementById("keterangan").value.trim();

    if (!nama || !tanggal || !jamMulai || !jamSelesai || !keterangan) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (jamSelesai <= jamMulai) {
      alert("Jam selesai harus lebih besar!");
      return;
    }

    await addDoc(colRef, {
      nama,
      tanggal,
      waktu: jamMulai + " - " + jamSelesai,
      keterangan,
      status: "pending",
      createdAt: Date.now()
    });

    alert("Berhasil dikirim!");

    document.getElementById("nama").value = "";
    document.getElementById("tanggal").value = "";
    document.getElementById("jamMulai").value = "";
    document.getElementById("jamSelesai").value = "";
    document.getElementById("keterangan").value = "";

  } catch (error) {
    alert("Gagal kirim data");
    console.error(error);
  }
};

// ================= HALAMAN USER =================
function loadUserTable() {
  const tabel = document.getElementById("tabelData");
  if (!tabel) return;

  const q = query(colRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    tabel.innerHTML = "";

    snapshot.forEach((item) => {
      const data = item.data();

      if (data.status === "approved") {
        tabel.innerHTML += `
          <tr>
            <td>${data.nama}</td>
            <td>${data.tanggal}</td>
            <td>${data.waktu}</td>
            <td>${data.keterangan}</td>
          </tr>
        `;
      }
    });
  });
}

// ================= HALAMAN ADMIN =================
function loadAdmin() {
  const pending = document.getElementById("pendingData");
  const history = document.getElementById("historyData");

  if (!pending && !history) return;

  const q = query(colRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    if (pending) pending.innerHTML = "";
    if (history) history.innerHTML = "";

    snapshot.forEach((item) => {
      const data = item.data();
      const id = item.id;

      // Pending
      if (data.status === "pending" && pending) {
        pending.innerHTML += `
          <tr>
            <td>${data.nama}</td>
            <td>${data.tanggal}</td>
            <td>${data.waktu}</td>
            <td>${data.keterangan}</td>
            <td class="aksi">
              <button class="approve" onclick="approve('${id}')">✔</button>
              <button class="reject" onclick="reject('${id}')">✖</button>
            </td>
          </tr>
        `;
      }

      // Riwayat
      if (data.status !== "pending" && history) {
        let badge =
          data.status === "approved"
            ? "✅ Disetujui"
            : "❌ Ditolak";

        history.innerHTML += `
          <tr>
            <td>${data.nama}</td>
            <td>${data.tanggal}</td>
            <td>${data.waktu}</td>
            <td>${data.keterangan}</td>
            <td>${badge}</td>
            <td class="aksi">
              <button class="delete" onclick="hapus('${id}')">🗑</button>
            </td>
          </tr>
        `;
      }
    });
  });
}

// ================= ADMIN ACTION =================
window.approve = async function(id) {
  await updateDoc(doc(db, "peminjaman", id), {
    status: "approved"
  });
};

window.reject = async function(id) {
  await updateDoc(doc(db, "peminjaman", id), {
    status: "rejected"
  });
};

window.hapus = async function(id) {
  await deleteDoc(doc(db, "peminjaman", id));
};

// ================= AUTO RUN =================
window.addEventListener("DOMContentLoaded", () => {
  loadUserTable();
  loadAdmin();
});
