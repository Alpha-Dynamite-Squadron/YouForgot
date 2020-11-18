let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let dbPool = require('../models/database');
let nodeMailerTransport = require('../config/nodeMailerTransport.js');

let baseMailUrl;
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://youforgot.school';
} else {
  baseUrl = 'http://localhost:8080';
}
// error 1 there was a duplicate entry
// error 2 the email did not send
// code 3 the email sent successfully
module.exports.sendResetEmail = function (emailAddress, resultCallback) {
  let accessKey = crypto.randomBytes(20).toString('hex');
  console.log(accessKey);
  const url = baseUrl + '/reset_password/' + accessKey;
  let setAccessKeyQuery = 'UPDATE User SET accessKey = ? WHERE emailAddress = ?;';
  dbPool.query(setAccessKeyQuery, [accessKey, emailAddress], function (err, result) {
    if (err) {
      resultCallback(err, null);
    }
    else {
      let info = nodeMailerTransport.sendMail({
        from: '"YouForgot Admin" <admin@youforgot.school>', // sender address
        to: emailAddress, // list of receivers
        subject: "Reset Your Password for YouForgot.school", // Subject line
        html: `Please click this email to reset your password on YouForgot.school: <a href="${url}">Reset Password</a>` // html body
      }, function (error, result) {
        if (error) {
          console.log("Failed to send email to " + emailAddress);
          console.log(error);
          resultCallback(error, 2); //failed to send email
        } else {
          console.log("Successfully sent the email to " + emailAddress);
          console.log(result);
          resultCallback(null, null);
        }
      });
    }
  });
}
// error code 1 is that the access keys do not match
// error code 2 is that the update did not work
module.exports.resetEmail = function (emailAddress, password, accessKey, resultCallback) {
  let checkAccessKeyQuery = 'SELECT accessKey FROM User WHERE emailAddress = ?;';
  dbPool.query(checkAccessKeyQuery, [emailAddress], function (err, res) {
    console.log(res);
    if (err) {
      resultCallback(err, null);
    }
    else if (res.length !== 0) {
      console.log(res[0].accessKey);
      if (accessKey === res[0].accessKey) {
        let user = {
          setPassword: funcSetPassword
        };
        user.setPassword(password);
        let hash = user.hash;
        let salt = user.salt;
        let updatePasswordQuery = 'UPDATE User SET accessKey = NULL, hash = ?, salt = ?  WHERE emailAddress = ?;';
        dbPool.query(updatePasswordQuery, [hash, salt, emailAddress], function (error, result) {
          if (error) {
            console.log(error);
            resultCallback(error, 2);
          } else {
            resultCallback(null, null); // if it gets here then the user has been updated
          }
        })
      }
      else {
        console.log("This error should never happen. This is dead code. If you are reading this and it did happen. This happened in the else of a select err check.")
        resultCallback(null, 1); // this user does not have an accesskey
      }
    }
    else {
      resultCallback(null, 3); // this user does not have an accesskey
    }
  })

  let user = {
    setPassword: funcSetPassword
  };
  user.setPassword(password);
  let hash = user.hash;
  let salt = user.salt;
  let createUserQuery = 'UPDATE User SET username = ?, imageID = ?, hash = ?, salt = ?, accessKey = NULL WHERE emailAddress = ?;';
  let updatePasswordQuery = 'UPDATE User SET accessKey = ? WHERE emailAddress = ?;';
}

//kwqmeposdms1dsnfd812j312nj38sdvh
let secretString = process.env.LOGIN_SECRET;
if (secretString == undefined) {
  console.log("Assessment Login Undefined in enviroment `LOGIN_SECRET`");
  process.exit(1);
}

let funcSetPassword = function (password) {
  this.salt = crypto.randomBytes(20).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};
function validateEmail(mail) {
  return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail));

}

let funcCheckPassword = function (password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

let funcGenerateJwt = function () {
  let expiry = new Date(); //the current date
  expiry.setDate(expiry.getDate() + 1);
  return jwt.sign({
    emailAddress: this.emailAddress,
    username: this.username,
    imageID: this.imageID,
    getPostReminderNotifications: this.getPostReminderNotifications,
    getHomeworkReminderNotifications: this.getHomeworkReminderNotifications,
    setExcessively: this.sendExcessively,
    institutionID: this.institutionID,
    exp: parseInt(expiry.getTime() / 1000)
  }, secretString);
};

/* This is the database call to pull data for the user.
*/
module.exports.findAccountByEmail = function (email, resultCallback) {
  var queryString = 'SELECT emailAddress, username, imageID, hash, salt, profileRating, getPostReminderNotifications, getHomeworkReminderNotifications, institutionID, sendExcessively FROM User WHERE accessKey IS NULL AND emailAddress = ?;';
  dbPool.query(queryString, email, function (err, result) {
    if (err) {
      resultCallback(err, null);
    }
    else if (result.length === 1) {
      console.log('Found User: ' + result[0].username);
      var user = {
        emailAddress: result[0].emailAddress,
        username: result[0].username,
        imageID: result[0].imageID,
        hash: result[0].hash,
        salt: result[0].salt,
        profileRating: result[0].profileRating,
        getPostReminderNotifications: result[0].getPostReminderNotifications,
        getHomeworkReminderNotifications: result[0].getHomeworkReminderNotifications,
        institutionID: result[0].institutionID,
        sendExcessively: result[0].sendxcessively,
        setPassword: funcSetPassword,
        validPassword: funcCheckPassword,
        generateJwt: funcGenerateJwt
      }
      console.log(user);
      resultCallback(null, user);
    }
    else {
      console.log("No User found for email: " + email);
      resultCallback(null, null);
    }
  });
};
// Check that the user exists in the DB once the user has clicked on the link with the access key so that registration can continue.
module.exports.findNewUser = function (accessKey, resultCallback) {
  var findInactiveUserQuery = 'SELECT accessKey, emailAddress, FROM User WHERE accessKey = ? LIMIT 1;';
  dbPool.query(findInactiveUserQuery, accessKey, function (err, result) {
    if (err) {
      resultCallback(err, null);
    }
    else if (result.length === 1) {
      console.log('Found Inactive User:' + result[0].emailAddress);
      resultCallback(null, result[0].emailAddress);
    }
    else {
      console.log("Invalid access key provided for user " + accessKey);
      resultCallback(null, null);
    }
  });
}
/*
 * status code 0 the user was registered succefully. You should expect the user object at parameter 3 in the callback
 * error code 1 is an unauthorized accesskey
 * error code 2 no email address is found
 * error code 3 is that the query failed because the email dissapeared
 */
module.exports.registerUser = function (accessKey, emailAddress, username, password, institution, getNotifications, resultCallback) {

  let findInactiveUserQuery = 'SELECT emailAddress, accessKey FROM User WHERE emailAddress = ? LIMIT 1;';
  dbPool.query(findInactiveUserQuery, emailAddress, function (err, result) {
    if (err) {
      resultCallback(err, null);
    }
    else if (result.length === 1) {
      if (result[0].accessKey === accessKey) {
        console.log('Registering Inactive User:' + result[0].emailAddress);
        let user = {
          setPassword: funcSetPassword
        };
        user.setPassword(password);
        let hash = user.hash;
        let salt = user.salt;
        let createUserQuery = 'UPDATE User SET username = ?, imageID = 1, hash = ?, salt = ?, institutionID = ?, getPostReminderNotifications = ?, getHomeworkReminderNotifications = ?, accessKey = NULL WHERE emailAddress = ?;';
        dbPool.query(createUserQuery, [username, hash, salt, institution, getNotifications, getNotifications, emailAddress], function (err, result) {
          if (err) {
            resultCallback(err, null);
          }
          else if (result.affectedRows == 0) {
            console.log("The email was found but the query did not complete");
            resultCallback(null, 3);
          }
          else {
            console.log("New user registered.");
            let user = {
              emailAddress: emailAddress,
              username: username,
              imageID: 1,
              getPostReminderNotifications: getNotifications,
              getHomeworkReminderNotifications: getNotifications,
              sendExcessively: false,
              institutionID: institution,
              generateJwt: funcGenerateJwt
            }
            resultCallback(null, 0, user);
          }
        });
      }
      else {
        console.log("Unauthorized Access key!");
        resultCallback(null, 1);
      }
    }
    else { // no email address found
      resultCallback(null, 2);
    }
  });
}
// 0 is that the user was successfully inserted
// 1 the email is not a vaild edu email
// 2 the email failed to send
// 3 the email already exists
module.exports.preRegistration = function (email, resultCallback) {
  let validEmail = validateEmail(email);
  let validEdu = false;
  if (validEmail) {
    let edu = email.substring(email.length - 4);
    if (edu === '.edu') {
      validEdu = true;
    }
  }
  if (validEdu) {
    let accessKey = crypto.randomBytes(20).toString('hex');
    const url = baseUrl + '/finish_registration/' + accessKey;
    console.log("Creating Access to Finish Registration: " + url);
    let setAccessKeyQuery = 'INSERT INTO User (emailAddress, accessKey) VALUES (?, ?);';
    dbPool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        returnCallback(err, -1);
      }
      else {
        connection.beginTransaction(function (err) {
          if (err) {
            connection.rollback(function () {
              connection.release();
              resultCallback(err, -2);
            });
          }
          else {
            connection.query(setAccessKeyQuery, [email, accessKey], function (err, result) {
              if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                  connection.rollback(function () {
                    connection.release();
                    resultCallback(err, -2);
                  });
                }
                else {
                  connection.rollback(function () {
                    connection.release();
                    resultCallback(err, -4);
                  });
                }
              }
              else {
                console.log("Sending registration email to: " + email);
                let info = nodeMailerTransport.sendMail({
                  from: '"YouForgot Admin" <admin@youforgot.school>', // sender address
                  to: email, // list of receivers
                  subject: "Register Your Account on YouForgot.school", // Subject line
                  html: `Please click this email to confirm your email address on YouForgot.school: <a href="${url}">Finish Registration</a>` // html body
                }, function (error, result) {
                  if (error) {
                    console.log("Failed to send email to " + email);
                    console.log(error);
                    connection.rollback(function () {
                      connection.release();
                      resultCallback(err, 2);
                    });
                  } else {
                    console.log("Successfully sent the email to " + email);
                    console.log(result);
                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          connection.release();
                          resultCallback(err, -4);
                        });
                      }
                      else {
                        resultCallback(null, 0);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    resultCallback(null, 1); // not a valid edu email address
  }
}

// function() {
//   dbPool.getConnection(function (err, connection) {
//     if (err) {
//       connection.release();
//       returnCallback(err, -1);
//     }
//     else {
//       connection.beginTransaction(function (err) {
//         if (err) {
//           connection.rollback(function () {
//             connection.release();
//             resultCallback(err, -2);
//           });
//         }
//         else {
//           connection.query(sqlStatement, parameters, function (err, result) {
//             if (err) {
//               connection.rollback(function () {
//                 connection.release();
//                 resultCallback(err, -3);
//               });
//             }
//             else {
//               connection.commit(function (err) {
//                 if (err) {
//                   connection.rollback(function () {
//                     connection.release();
//                     resultCallback(err, -4);
//                   });
//                 }
//                 else {
//                   resultCallback(null, 0);
//                 }
//               });
//             }
//           });
//         }
//       });
//     }
//   });
// }

//If AccessKey exists, provides emailAddress, hash, salt
module.exports.verifyAccessKey = function (accessKey, resultCallback) {
  var findAccessKeyQuery = 'SELECT emailAddress FROM User WHERE accessKey = ? LIMIT 1;';
  dbPool.query(findAccessKeyQuery, accessKey, function (err, result) {
    if (err) {
      resultCallback(err, null);
    }
    else if (result.length === 1) {
      console.log('Found User: ' + result[0].emailAddress + " by AccessKey: " + accessKey);
      var user = {
        emailAddress: result[0].emailAddress,
        hash: result[0].hash,
        salt: result[0].salt,
      }
      resultCallback(null, user);
    }
    else {
      console.log("No User found for AccessKey: " + accessKey);
      resultCallback(null, null);
    }
  });
};
