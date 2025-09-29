// db/connect.js：封装数据库连接逻辑，供其他文件调用
const mysql = require('mysql2/promise'); // 引入支持Promise的mysql2

// 1. 配置连接参数（替换为你的实际信息！）
const dbConfig = {
  host: 'localhost', // 从cPanel确认的主机，默认localhost
  user: 'xwang97@localhost', // 从cPanel获取的用户名
  password: 'Wangxc123!', // 从cPanel设置的用户密码
  database: 'xwang97_charityevents_db', // 从cPanel获取的数据库名
  port: 3306, // 默认端口，无需修改
  waitForConnections: true, // 连接池满时等待，避免报错
  connectionLimit: 10, // 最大连接数，防止资源耗尽
  queueLimit: 0 // 无队列限制
};

// 2. 创建连接池（推荐用连接池，比单次连接更高效）
const pool = mysql.createPool(dbConfig);

// 3. 验证连接是否成功（可选，但首次配置建议加，方便排查错误）
async function testDBConnection() {
  try {
    const connection = await pool.getConnection(); // 获取一个连接
    console.log('✅ 成功连接到 xwang97_charityevents_db 数据库！');
    connection.release(); // 释放连接回连接池（不释放会导致连接泄漏）
  } catch (err) {
    console.error('❌ 数据库连接失败：', err.message);
    // 常见错误提示：
    // 1. "Access denied"：用户名/密码错误，去cPanel重新确认
    // 2. "Unknown database"：数据库名错误，检查cPanel中的数据库名前缀
    // 3. "Can't connect to MySQL server"：主机/端口错误，确认是localhost:3306
  }
}

// 4. 导出连接池，供其他文件（如控制器）调用
module.exports = {
  pool,
  testDBConnection // 导出测试函数，方便启动时验证
};