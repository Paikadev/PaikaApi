const mysql = require('mysql')

const databaseConnection = require('../database/connection')

function insert(req, res){
    let insertQuery = "INSERT INTO TextOnly (idInteraction, turn, text, img, time) VALUES (?, ?, ?, ?, ?)"
    let query = mysql.format(insertQuery, [req.body.idInteraction, req.body.turn, req.body.text, req.body.img, req.body.time])
    databaseConnection.connection.query(query, function(err,result){
        if(err) {
            return res.status(500).json({
              message: 'Error create prompt'
            })
          }
          let insertQuery1 = "INSERT INTO Paika.Order (idInteraction,turn,type,idPrompt) VALUES (?, ?, ?, ?)"
          let query = mysql.format(insertQuery1, [req.body.idInteraction,req.body.turn,"TextOnly",result.insertId])
          databaseConnection.connection.query(query, function(err,result2){
              if(err) { 
                  return res.status(500).json({
                    message: 'Error insert order'
                  })
                }
          });
          return res.json(result.insertId)
    });
}


function read(req,res){
    databaseConnection.connection.query('SELECT * From TextOnly', function (err, result){
        if(err) { 
            return res.status(500).json({
              message: 'Error get prompt TextOnly'
            })
          }
          return res.json(result)
    });

}


module.exports = {insert, read}