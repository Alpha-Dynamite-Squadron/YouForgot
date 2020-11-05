const csv = require('csv-parser');
const fs = require('fs');
let dbPool = require('../src/api/Models/database.js');

let valueArray = [];
//Should have Code to manually download CSV file from server to run completely autonomously
fs.createReadStream('../database/InstitutionCampus.csv')
  .pipe(csv())
  .on('data', (row) => {
    if(row.LocationType === 'Institution') {
      valueArray.push([row.DapipId, row.LocationName, row.Address]);
    }
  })
  .on('end', () => {
    console.log("Institutions Found: " + valueArray.length);
    dbPool.getConnection(function(err, connection) {
      if(err) {
        console.log("Failed to Connect to DB", err);
      }
      connection.beginTransaction(function(err) {
        if(err) {
          connection.rollback(function() {
            connection.release();
            console.log("Failed to Begin a Transaction", err);
          });
        }
        else {
          const insertInstitutionQuery = 'INSERT IGNORE INTO Institution (institutionID, schoolName, physicalAddress) VALUES ?;';
          connection.query(insertInstitutionQuery, [valueArray], function(err, result) {
            if(err) {
              connection.rollback(function() {
                connection.release();
                console.log("FAILED at insertion", err);
              });
            }
            else {
              connection.commit(function(err) {
                if(err) {
                  console.error("Success, but failed to Commit Transaction: ", err);
                  connection.rollback(function() {
                    connection.release();
                  });
                }
                else {
                  connection.release();
                  console.log("Successful with " + result.affectedRows + " affected rows");
                }
              });
            }
          });
        }
      });
    });
  });
