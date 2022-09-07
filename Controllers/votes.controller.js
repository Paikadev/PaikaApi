const mysql = require('mysql')

const databaseConnection = require('../database/connection')

function insert(req, res){
  console.log(req.body)
    let insertQuery = "INSERT INTO Votes (idInteraction, turn, text, img, time, total, player1_points, player2_points, player3_points, player4_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    let query = mysql.format(insertQuery, [req.body.idInteraction, req.body.turn, req.body.text, req.body.img, req.body.time, req.body.total, req.body.player1_points, req.body.player2_points, req.body.player3_points,req.body.player4_points])
    databaseConnection.connection.query(query, function(err,result){
        if(err) {
            return res.status(500).json({
              message: 'Error create prompt'
            })
          }
          let insertQuery1 = "INSERT INTO Paika.Order (idInteraction,turn,type,idPrompt) VALUES (?, ?, ?, ?)"
          let query = mysql.format(insertQuery1, [req.body.idInteraction,req.body.turn,"Votes",result.insertId])
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
    databaseConnection.connection.query('SELECT * From Votes', function (err, result){
        if(err) { 
            return res.status(500).json({
              message: 'Error get prompt TextOnly'
            })
          }
          return res.json(result)
    });

}


module.exports = {insert, read}