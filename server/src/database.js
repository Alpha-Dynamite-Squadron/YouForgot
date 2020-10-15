var mysqllib = require("mysql");

var dbpassword = process.env.DB_PASSWORD;

if(dbpassword == undefined) {
  console.log("Database Password Undefined in enviroment `DB_PASSWORD`");
  process.exit(1);
}
console.log("Password is '" + dbpassword + "'");

var dbPool;
if(process.env.NODE_ENV === 'production') {
  dbPool = mysqllib.createPool({
    connectionLimit: 3,
    socketPath: '',
    user: "",
    password: dbpassword,
    database: "yfdb"
  });
}
else {
  dbPool = mysqllib.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: "yfAdmin",
    password: dbpassword,
    database: "yfdb",
    multipleStatements: true
  });
}
console.log("Connected to Database");

module.exports = dbPool;
