const mysql = require('mysql')

const databaseConnection = require('../database/connection')

function insert(req, res){
  console.log(req.body)
    let insertQuery = "INSERT INTO Order (idInteraction,turn,type,idPrompt) VALUES (?, ?, ?, ?)"
    let query = mysql.format(insertQuery, [req.body.url_img, req.body.hashtag, req.body.players_number, req.body.random, req.body.host_user, req.body.date, req.body.total_prompts, req.body.player1_points, req.body.player2_points, req.body.player3_points, req.body.player4_points])
    databaseConnection.connection.query(query, function(err,result){
        if(err) { 
            return res.status(500).json({
              message: 'Error create interaction'
            })
          }
          return res.json({id: result.insertId})
    });
}


function read(req,res){
    databaseConnection.connection.query('SELECT * From Order', function (err, result){
        if(err) { 
            return res.status(500).json({
              message: 'Error get interactions'
            })
          }
          return res.json(result)
    });

}

function readId(req,res){
  let query = 'SELECT * From Order WHERE idInteraction = '+req.body.id+' AND turn='+req.body.turn
  databaseConnection.connection.query(query, function (err, result){
      if(err) { 
          return res.status(500).json({
            message: 'Error get order by id'
          })
        }
        return res.json(result)
  });

}

module.exports = {insert, read, readId}
