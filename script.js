import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
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


// ================= USER SUBMIT =================
window.kirimData = async function () {
  const nama = document.getElementById("nama").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const jamMulai = document.getElementById("jamMulai").value;
  const jamSelesai = document.getElementById("jamSelesai").value;
  const keterangan = document.getElementById("keterangan").value.trim();

  if (
    nama === "" ||
    tanggal === "" ||
    jamMulai === "" ||
    jamSelesai === "" ||
    keterangan === ""
  ) {
    alert("Semua field wajib diisi!");
    return;
  }

  if (jamSelesai <= jamMulai) {
    alert("Jam selesai harus lebih besar dari jam mulai!");
    return;
  }

  const data = {
    nama,
    tanggal,
    waktu: jamMulai + " - " + jamSelesai,
    keterangan
  };

  let pending = getPending();
  pending.push(data);

  localStorage.setItem("pending", JSON.stringify(pending));

  alert("Data dikirim!");

  location.reload();
}

// ================= USER PAGE =================
function tampilkanApproved() {
  let data = getApproved();
  let tabel = document.getElementById("tabelData");

  if (!tabel) return;

  tabel.innerHTML = "";

  data.forEach(item => {
    tabel.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.tanggal}</td>
        <td>${item.waktu}</td>
        <td>${item.keterangan}</td>
      </tr>
    `;
  });
}

// ================= ADMIN PENDING =================
function tampilkanPending() {
  let data = getPending();
  let tabel = document.getElementById("pendingData");

  if (!tabel) return;

  tabel.innerHTML = "";

  data.forEach((item, index) => {
    tabel.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.tanggal}</td>
        <td>${item.waktu}</td>
        <td>${item.keterangan}</td>
        <td class="aksi">
          <button class="approve" onclick="approve(${index})">✔</button>
          <button class="reject" onclick="reject(${index})">✖</button>
        </td>
      </tr>
    `;
  });
}

// ================= APPROVE =================
function approve(index) {
  let pending = getPending();
  let approved = getApproved();

  approved.push(pending[index]);
  pending.splice(index, 1);

  localStorage.setItem("pending", JSON.stringify(pending));
  localStorage.setItem("approved", JSON.stringify(approved));

  refreshAdmin();
}

// ================= REJECT =================
function reject(index) {
  let pending = getPending();
  let rejected = getRejected();

  rejected.push(pending[index]);
  pending.splice(index, 1);

  localStorage.setItem("pending", JSON.stringify(pending));
  localStorage.setItem("rejected", JSON.stringify(rejected));

  refreshAdmin();
}

// ================= HISTORY =================
function tampilkanHistory() {
  let approved = getApproved();
  let rejected = getRejected();
  let tabel = document.getElementById("historyData");

  if (!tabel) return;

  tabel.innerHTML = "";

  approved.forEach((item, index) => {
    tabel.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.tanggal}</td>
        <td>${item.waktu}</td>
        <td>${item.keterangan}</td>
        <td class="status-yes">✅ Disetujui</td>
        <td class="aksi">
          <button class="delete" onclick="hapusApproved(${index})">🗑</button>
        </td>
      </tr>
    `;
  });

  rejected.forEach((item, index) => {
    tabel.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.tanggal}</td>
        <td>${item.waktu}</td>
        <td>${item.keterangan}</td>
        <td class="status-no">❌ Ditolak</td>
        <td class="aksi">
          <button class="delete" onclick="hapusRejected(${index})">🗑</button>
        </td>
      </tr>
    `;
  });
}

// ================= HAPUS =================
function hapusApproved(index) {
  let data = getApproved();
  data.splice(index, 1);
  localStorage.setItem("approved", JSON.stringify(data));
  refreshAdmin();
}

function hapusRejected(index) {
  let data = getRejected();
  data.splice(index, 1);
  localStorage.setItem("rejected", JSON.stringify(data));
  refreshAdmin();
}

// ================= REFRESH =================
function refreshAdmin() {
  tampilkanPending();
  tampilkanHistory();
}
