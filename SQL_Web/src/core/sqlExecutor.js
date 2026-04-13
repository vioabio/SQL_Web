import initSqlJs from 'sql.js';

let SQL = null;

export const initDB = async (initSql) => {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: () => `/sql-wasm.wasm`,
    });
  }

  const db = new SQL.Database();

  if (initSql) {
    // 移除注释后执行
    const cleanSql = initSql
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    
    db.exec(cleanSql);
  }

  return db;
};

export const runSQL = (db, sql) => {
  if (!db) {
    throw new Error('数据库未初始化');
  }

  console.log('runSQL 接收到的 SQL:', sql?.substring(0, 100));

  // 移除 -- 开头的注释行，保留其他代码
  const lines = sql.split('\n');
  const cleanLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) {
      continue;
    }
    cleanLines.push(line);
  }
  
  let cleanSql = cleanLines.join('\n').trim();

  if (!cleanSql) {
    console.log('cleanSql 为空');
    return [];
  }

  // 关键修复：确保多语句之间有分号分隔
  // 把 "select...\nSELECT..." 替换为 "select...;\nSELECT..."
  cleanSql = cleanSql.replace(/(\w)(\s*\n\s*)(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\b/gi, '$1;\n$3');

  console.log('清理后的 SQL:', cleanSql?.substring(0, 100));

  // 执行 SQL
  try {
    const results = db.exec(cleanSql);
    console.log('SQL 执行结果:', results);
    
    if (!results || results.length === 0) {
      return [];
    }
    
    return [results[results.length - 1]];
  } catch (e) {
    console.error('SQL 执行错误:', e.message);
    console.error('执行的 SQL:', cleanSql);
    throw e;
  }
};
