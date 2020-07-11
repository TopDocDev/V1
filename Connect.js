const sql = require("mssql")

const dbConfig = {  
  server: 'localhost', 
  database: "v21db",
  authentication: {
      type: 'default',
      options: {
          userName: 'louis', 
          password: 'password'  
      }
  },
}; 
function getDb() {
  const conn = new sql.ConnectionPool(dbConfig);
  const req = new sql.Request(conn)
  conn.connect().then(
      function getData (req) {
          let a = {
              number: 1,
              date: "01/01/2020",
          }
          const text = "SELECT TOP "+ a.number + "TT_PNAME as name, TT_DATAUS as 'end', DATEADD(MINUTE, -TT_DAUER, TT_DATAUS) AS start, 'green' as color from v21db.dbo.Tabelle1$ where TT_DATAUS > '" + a.date +"' and TT_PNR is not null order by TT_DATAUS"
          req.query(text).then(getData)
          .catch(function (err) {
              console.log(err);
              conn.close();
          })
      }
  )
  .catch(function (err) {
      console.log(err);
  });
}
function getData(recordset) {
    exports.data = "hi"
    exports.SimpleMessage = 'Hello world';
    conn.close();
})
getDb()