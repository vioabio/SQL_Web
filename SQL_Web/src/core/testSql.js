import initSqlJs from 'sql.js';

(async () => {
  console.log('正在初始化数据库...');
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  
  console.log('创建表并插入数据...');
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");
  db.run("INSERT INTO users VALUES (1, '张三', 'zhangsan@example.com')");
  db.run("INSERT INTO users VALUES (2, '李四', 'lisi@example.com')");
  
  console.log('查询结果:');
  const result = db.exec("SELECT * FROM users");
  console.table(result[0].values);
})();
