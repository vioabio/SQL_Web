// src/utils/sqlHelper.js
import initSqlJs from 'sql.js';

export async function initDatabase() {
  const SQL = await initSqlJs({
    // 关键点：告诉 sql.js 去哪里找那个巨大的二进制引擎文件
    // 因为文件在 public 下，直接写 "/文件名" 即可
    locateFile: file => `/sql-wasm.wasm` 
  });

  const db = new SQL.Database();
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
  return db;
}

export function insertTestData(db) {
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", ['张三', 'zhangsan@example.com']);
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", ['李四', 'lisi@example.com']);
}

export function getAllUsers(db) {
  const res = db.exec("SELECT * FROM users");
  if (res.length === 0) return [];
  
  const columns = res[0].columns;
  const values = res[0].values;
  return values.map(row => {
    let obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
}