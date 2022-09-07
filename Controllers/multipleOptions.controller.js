const mysql = require('mysql')

const databaseConnection = require('../database/connection')

function insert(req, res){
    console.log(req.params)
    let insertQuery = "INSERT INTO MultipleOptions (idInteraction, turn, text, img, time, option_1, option_2, option_3, option_4, option_correct) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    let query = mysql.format(insertQuery, [req.body.idInteraction, req.body.turn, req.body.text, req.body.img, req.body.time, req.body.option_1, req.body.option_2, req.body.option_3, req.body.option_4,req.body.option_correct])
    databaseConnection.connection.query(query, function(err,result){
        if(err) {
            return res.status(500).json({
              message: 'Error create prompt'
            })
          }
          let insertQuery1 = "INSERT INTO Paika.Order (idInteraction,turn,type,idPrompt) VALUES (?, ?, ?, ?)"
          let query = mysql.format(insertQuery1, [req.body.idInteraction,req.body.turn,"MultipleOptions",result.insertId])
          databaseConnection.connection.query(query, function(err,result2){
              if(err) { 
                  return res.status(500).json({
                    message: 'Error insert order'
                  })
                }
          });
          return res.json(result)
    });
}


function read(req,res){
    databaseConnection.connection.query('SELECT * From MultipleOptions', function (err, result){
        if(err) { 
            return res.status(500).json({
              message: 'Error get prompt TextOnly'
            })
          }
          return res.json(result)
    });

}


module.exports = {insert, read}