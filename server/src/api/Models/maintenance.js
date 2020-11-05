let dbPool = require('../models/database');
//use this with setInterval
//a hour is 3.6 x 10^6 millisecond
//we delete records that are a day old every hour?
export const clean = () => {
    var queryString = 'DELETE FROM User WHERE hash IS NULL and salt IS NULL and emailAddress IS NOT NULL and accessKey IS NOT NULL and timestamp < (NOW() - INTERVAL 1 DAY)';
    dbPool.query(queryString,null, function(err, res){
        if(err){
            console.log("Error cleaning the db");
        }
        else {
            console.log("Cleaned Database");
        }
    });
}