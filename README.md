# 🎮 2048 Game

Permainan puzzle **2048** — implementasi single-page web app dengan HTML, CSS, dan Vanilla JavaScript. Gabungkan ubin bernilai sama untuk mencapai **2048**!

## 🚀 Demo Langsung

Kunjungi: **[https://adigo99.github.io/2048-game](https://adigo99.github.io/2048-game)**

## ✨ Fitur

- 🧩 **4×4 Grid** — ubin bernomor (2, 4, 8 ... 2048, 4096, dst.)
- ⌨️ **Keyboard** — geser ubin dengan tombol panah (← ↑ ↓ →)
- 📱 **Touch / Swipe** — dukungan penuh untuk perangkat mobile
- 🔢 **Penggabungan** — ubin sama bertemu → nilainya berlipat ganda
- 📊 **Skor** — penghitungan skor real-time + high score (tersimpan di localStorage)
- ↩️ **Undo** — batalkan satu langkah terakhir
- 🏆 **Deteksi Menang** — notifikasi saat mencapai 2048, bisa lanjut main
- 💀 **Game Over** — deteksi saat tidak ada langkah tersisa
- 🎨 **Tema Gelap** — background #0d1117, warna ubin bervariasi sesuai nilai
- ✨ **Animasi Halus** — transisi geser dan efek pop saat penggabungan
- 📐 **Responsif** — bekerja di layar 320px hingga desktop lebar

## 🛠️ Tech Stack

- **HTML5** + **CSS3** + **Vanilla JavaScript** (ES6+)
- **Tanpa framework**, tanpa build step, tanpa dependensi eksternal
- Satu file `index.html` — buka langsung di browser

## 🧪 Menjalankan Tes

Tes unit menggunakan pure Node.js `assert` (tanpa framework):

```bash
node tests/game.test.js
```

### Cakupan Tes

| Modul | Pengujian |
|-------|-----------|
| `createBoard()` | Membuat papan 4×4 berisi nol |
| `slide()` | Gabung, tanpa gabung, gabung berantai, baris kosong, hanya geser |
| `moveLeft()` / `moveRight()` | Geser horizontal dengan gabung |
| `moveUp()` / `moveDown()` | Geser vertikal dengan gabung |
| `canMove()` | Papan penuh tanpa/tanpa potensi gabung, ada sel kosong |
| `hasWon()` | Deteksi 2048 (dan nilai lebih besar) |
| `spawnTile()` | Sel kosong berkurang 1, distribusi 90%/10%, papan penuh → null |
| `cloneBoard()` | Deep copy tidak memengaruhi original |
| `transpose()` | Tukar baris dan kolom |

## 📂 Struktur Proyek

```
2048-game/
├── index.html          # Game (HTML + CSS + JS dalam satu file)
├── tests/
│   └── game.test.js    # Unit test game logic
└── README.md
```

## 🎯 Cara Bermain

1. Buka `index.html` di browser (atau kunjungi GitHub Pages)
2. Gunakan **tombol panah** (desktop) atau **swipe** (mobile) untuk menggeser ubin
3. Ubin dengan nilai sama akan bergabung saat bertabrakan
4. Setiap langkah memunculkan ubin baru (2 atau 4)
5. Capai **2048** untuk menang — lalu lanjutkan untuk raih skor lebih tinggi!
6. Klik **Batal** untuk mundur satu langkah
7. Klik **Baru** untuk memulai permainan baru

## 📝 Lisensi

MIT