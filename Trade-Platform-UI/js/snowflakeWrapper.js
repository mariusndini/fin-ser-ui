var snowflake = require('snowflake-sdk');

function connect (c){
    return new Promise((resolve, reject) =>{
        c.connect(function(err, conn) {
            if (err) {
                if(err.code == 405502){
                    resolve(conn);
                }
                //console.log(JSON.stringify(err) );
                reject(err);
            } else {
                resolve (conn);
            }
        });
    })

};

function runSQL(dbConn, SQL){
    if(!dbConn.isUp()){
        alert("Please Restart App - Disconnected")
    }

    return new Promise((resolve, reject) =>{
        var snowflakeQuery = {
            sqlText: SQL,
            complete: function(err, stmt, rows){
                if(err){
                    reject(err);
                }
                resolve(rows);
            }
        }
        
        dbConn.execute(snowflakeQuery);
    })//end promise  
}

function disconnect(){
    return new Promise((resolve, reject)=>{
        connection.destroy(function(err, conn) {
            if (err) {
                reject(0)
            }
            resolve(1);
        });
    })
}






