/**
 * tests/game.test.js
 * Unit test untuk fungsi-fungsi game logic 2048.
 * Menggunakan pure Node.js assert (tanpa framework eksternal).
 * Jalankan: node tests/game.test.js
 */

const assert = require('assert');

// ===================================================================
// Salinan fungsi game logic (pure functions) dari index.html
// ===================================================================

function createBoard() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
}

function cloneBoard(board) {
  return board.map(row => [...row]);
}

function getEmptyCells(board) {
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) cells.push({ r, c });
    }
  }
  return cells;
}

function spawnTile(board) {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return null;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  board[r][c] = value;
  return { r, c, value };
}

function slide(row) {
  let arr = row.filter(v => v !== 0);
  let score = 0;
  let moved = false;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== 0 && arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
      moved = true;
      i++;
    }
  }

  arr = arr.filter(v => v !== 0);
  while (arr.length < 4) arr.push(0);

  if (!moved) {
    for (let i = 0; i < 4; i++) {
      if (arr[i] !== row[i]) { moved = true; break; }
    }
  }

  return { row: arr, score, moved };
}

function moveLeft(board) {
  let totalScore = 0;
  let moved = false;
  const newBoard = board.map(r => {
    const result = slide(r);
    totalScore += result.score;
    if (result.moved) moved = true;
    return result.row;
  });
  return { board: newBoard, score: totalScore, moved };
}

function moveRight(board) {
  let totalScore = 0;
  let moved = false;
  const newBoard = board.map(r => {
    const reversed = [...r].reverse();
    const result = slide(reversed);
    totalScore += result.score;
    if (result.moved) moved = true;
    return result.row.reverse();
  });
  return { board: newBoard, score: totalScore, moved };
}

function transpose(board) {
  const result = createBoard();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      result[r][c] = board[c][r];
    }
  }
  return result;
}

function moveUp(board) {
  const t = transpose(board);
  const result = moveLeft(t);
  return { board: transpose(result.board), score: result.score, moved: result.moved };
}

function moveDown(board) {
  const t = transpose(board);
  const result = moveRight(t);
  return { board: transpose(result.board), score: result.score, moved: result.moved };
}

function canMove(board) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return true;
    }
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = board[r][c];
      if ((c < 3 && board[r][c + 1] === val) ||
          (r < 3 && board[r + 1][c] === val)) {
        return true;
      }
    }
  }
  return false;
}

function hasWon(board) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] >= 2048) return true;
    }
  }
  return false;
}

// ===================================================================
// TESTS
// ===================================================================

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${name}`);
    console.log(`    ${e.message}`);
  }
}

function assertDeepEqual(actual, expected, msg) {
  assert.deepStrictEqual(actual, expected, msg);
}

// ---------- createBoard ----------
console.log('\n📋 createBoard');
test('membuat papan 4x4 berisi nol', () => {
  const board = createBoard();
  assertDeepEqual(board.length, 4, 'harus 4 baris');
  board.forEach((row, i) => {
    assertDeepEqual(row.length, 4, `baris ${i} harus 4 kolom`);
    row.forEach(cell => assertDeepEqual(cell, 0, 'semua sel harus 0'));
  });
});

// ---------- slide ----------
console.log('\n📋 slide()');

test('gabung dua ubin: [2,2,0,4] → [4,4,0,0]', () => {
  const result = slide([2, 2, 0, 4]);
  assertDeepEqual(result.row, [4, 4, 0, 0]);
  assertDeepEqual(result.score, 4);
  assertDeepEqual(result.moved, true);
});

test('tanpa gabung: [2,4,8,16] → [2,4,8,16]', () => {
  const result = slide([2, 4, 8, 16]);
  assertDeepEqual(result.row, [2, 4, 8, 16]);
  assertDeepEqual(result.score, 0);
  assertDeepEqual(result.moved, false);
});

test('baris kosong: [0,0,0,0] → [0,0,0,0]', () => {
  const result = slide([0, 0, 0, 0]);
  assertDeepEqual(result.row, [0, 0, 0, 0]);
  assertDeepEqual(result.score, 0);
  assertDeepEqual(result.moved, false);
});

test('gabung berantai: [2,2,2,2] → [4,4,0,0] (setiap ubin hanya gabung sekali)', () => {
  const result = slide([2, 2, 2, 2]);
  assertDeepEqual(result.row, [4, 4, 0, 0]);
  assertDeepEqual(result.score, 8);
  assertDeepEqual(result.moved, true);
});

test('gabung di akhir: [0,0,2,2] → [4,0,0,0]', () => {
  const result = slide([0, 0, 2, 2]);
  assertDeepEqual(result.row, [4, 0, 0, 0]);
  assertDeepEqual(result.score, 4);
  assertDeepEqual(result.moved, true);
});

test('gabung dengan celah: [2,0,0,2] → [4,0,0,0]', () => {
  const result = slide([2, 0, 0, 2]);
  assertDeepEqual(result.row, [4, 0, 0, 0]);
  assertDeepEqual(result.score, 4);
  assertDeepEqual(result.moved, true);
});

test('tiga angka sama: [4,4,4,0] → [8,4,0,0]', () => {
  const result = slide([4, 4, 4, 0]);
  assertDeepEqual(result.row, [8, 4, 0, 0]);
  assertDeepEqual(result.score, 8);
  assertDeepEqual(result.moved, true);
});

test('hanya geser tanpa gabung: [0,2,0,4] → [2,4,0,0]', () => {
  const result = slide([0, 2, 0, 4]);
  assertDeepEqual(result.row, [2, 4, 0, 0]);
  assertDeepEqual(result.score, 0);
  assertDeepEqual(result.moved, true);
});

test('sudah rapat kiri: [2,4,8,16] → tidak berubah', () => {
  const result = slide([2, 4, 8, 16]);
  assertDeepEqual(result.row, [2, 4, 8, 16]);
  assertDeepEqual(result.moved, false);
});

// ---------- moveLeft ----------
console.log('\n📋 moveLeft()');

test('papan dengan beberapa baris', () => {
  const board = [
    [2, 2, 0, 4],
    [0, 0, 0, 0],
    [0, 2, 2, 0],
    [2, 0, 0, 2]
  ];
  const { board: newBoard, score, moved } = moveLeft(board);
  assertDeepEqual(newBoard, [
    [4, 4, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0]
  ]);
  assertDeepEqual(score, 12);
  assertDeepEqual(moved, true);
});

test('papan tidak berubah (semua sudah di kiri)', () => {
  const board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [2, 8, 4, 16],
    [32, 16, 8, 4]
  ];
  const { board: newBoard, moved } = moveLeft(board);
  assertDeepEqual(newBoard, board);
  assertDeepEqual(moved, false);
});

// ---------- moveRight ----------
console.log('\n📋 moveRight()');

test('geser kanan dengan gabung', () => {
  const board = [
    [2, 2, 0, 4],
    [0, 0, 0, 0],
    [0, 2, 2, 0],
    [2, 0, 0, 2]
  ];
  const { board: newBoard, score, moved } = moveRight(board);
  assertDeepEqual(newBoard, [
    [0, 0, 4, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 4],
    [0, 0, 0, 4]
  ]);
  assertDeepEqual(score, 12);
  assertDeepEqual(moved, true);
});

// ---------- moveUp ----------
console.log('\n📋 moveUp()');

test('geser atas dengan gabung', () => {
  const board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 0]
  ];
  const { board: newBoard, score, moved } = moveUp(board);
  assertDeepEqual(newBoard, [
    [4, 0, 0, 0],
    [4, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  assertDeepEqual(score, 4);
  assertDeepEqual(moved, true);
});

// ---------- moveDown ----------
console.log('\n📋 moveDown()');

test('geser bawah dengan gabung', () => {
  const board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 0]
  ];
  const { board: newBoard, score, moved } = moveDown(board);
  assertDeepEqual(newBoard, [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4, 0, 0, 0],
    [4, 0, 0, 0]
  ]);
  assertDeepEqual(score, 4);
  assertDeepEqual(moved, true);
});

// ---------- canMove ----------
console.log('\n📋 canMove()');

test('papan kosong → true', () => {
  assertDeepEqual(canMove(createBoard()), true);
});

test('papan penuh tanpa gabungan → false', () => {
  const board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [2, 8, 4, 16],
    [32, 16, 8, 4]
  ];
  assertDeepEqual(canMove(board), false);
});

test('papan penuh dengan gabungan horizontal → true', () => {
  const board = [
    [2, 2, 8, 16],
    [32, 64, 128, 256],
    [2, 8, 4, 16],
    [32, 16, 8, 4]
  ];
  assertDeepEqual(canMove(board), true);
});

test('papan penuh dengan gabungan vertikal → true', () => {
  const board = [
    [2, 4, 8, 16],
    [2, 64, 128, 256],
    [8, 8, 4, 16],
    [32, 16, 8, 4]
  ];
  assertDeepEqual(canMove(board), true);
});

test('papan dengan satu sel kosong → true', () => {
  const board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [2, 8, 4, 16],
    [32, 16, 8, 0]
  ];
  assertDeepEqual(canMove(board), true);
});

// ---------- hasWon ----------
console.log('\n📋 hasWon()');

test('papan tanpa 2048 → false', () => {
  assertDeepEqual(hasWon(createBoard()), false);
});

test('papan dengan 2048 → true', () => {
  const board = createBoard();
  board[0][0] = 2048;
  assertDeepEqual(hasWon(board), true);
});

test('papan dengan 4096 (lebih besar dari 2048) → true', () => {
  const board = createBoard();
  board[3][3] = 4096;
  assertDeepEqual(hasWon(board), true);
});

test('papan dengan nilai maks 1024 → false', () => {
  const board = createBoard();
  board[0][0] = 1024;
  assertDeepEqual(hasWon(board), false);
});

// ---------- spawnTile ----------
console.log('\n📋 spawnTile()');

test('spawn mengurangi jumlah sel kosong sebanyak 1', () => {
  const board = createBoard();
  const before = getEmptyCells(board).length;
  assertDeepEqual(before, 16, 'papan baru harus 16 sel kosong');

  const result = spawnTile(board);
  assertDeepEqual(result !== null, true, 'harus mengembalikan posisi');
  assertDeepEqual([2, 4].includes(result.value), true, 'nilai harus 2 atau 4');

  const after = getEmptyCells(board).length;
  assertDeepEqual(after, before - 1, 'sel kosong harus berkurang 1');
});

test('spawnTile mengembalikan null jika papan penuh', () => {
  const board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [2, 8, 4, 16],
    [32, 16, 8, 4]
  ];
  const result = spawnTile(board);
  assertDeepEqual(result, null);
});

test('spawnTile 90% menghasilkan 2 (uji statistik longgar)', () => {
  let count2 = 0;
  let count4 = 0;
  for (let i = 0; i < 500; i++) {
    const board = createBoard();
    const result = spawnTile(board);
    if (result.value === 2) count2++;
    else count4++;
  }
  // 90% dari 500 = 450, toleransi lebar: minimal 380 (76%)
  assertDeepEqual(count2 >= 380, true, `2 muncul ${count2}/500 kali, minimal 380`);
  assertDeepEqual(count4 <= 120, true, `4 muncul ${count4}/500 kali, maksimal 120`);
});

test('spawnTile menempatkan di sel acak', () => {
  // Uji bahwa spawn tidak selalu di posisi yang sama
  const positions = new Set();
  for (let i = 0; i < 100; i++) {
    const board = createBoard();
    const r = spawnTile(board);
    positions.add(r.r + ',' + r.c);
  }
  // Harus menghasilkan setidaknya 3 posisi berbeda dari 16
  assertDeepEqual(positions.size >= 3, true, `hanya ${positions.size} posisi unik`);
});

// ---------- cloneBoard ----------
console.log('\n📋 cloneBoard()');

test('cloneBoard menghasilkan deep copy', () => {
  const original = [
    [2, 0, 0, 0],
    [0, 4, 0, 0],
    [0, 0, 8, 0],
    [0, 0, 0, 16]
  ];
  const copy = cloneBoard(original);
  assertDeepEqual(copy, original, 'copy harus sama dengan original');
  copy[0][0] = 999;
  assertDeepEqual(original[0][0], 2, 'original tidak boleh berubah');
});

// ---------- transpose ----------
console.log('\n📋 transpose()');

test('transpose menukar baris dan kolom', () => {
  const board = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
  ];
  const expected = [
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [4, 8, 12, 16]
  ];
  assertDeepEqual(transpose(board), expected);
});

// ===================================================================
// RINGKASAN
// ===================================================================

console.log(`\n${'='.repeat(40)}`);
console.log(`Hasil: ${passed} lulus, ${failed} gagal dari ${passed + failed} tes`);
console.log(`${'='.repeat(40)}`);

if (failed > 0) {
  console.log('\n❌ BEBERAPA TES GAGAL!');
  process.exit(1);
} else {
  console.log('\n✅ SEMUA TES LULUS!');
  process.exit(0);
}