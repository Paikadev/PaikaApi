const mysql = require('mysql')
const dolbyio = require('@dolbyio/dolbyio-rest-apis-client');
const databaseConnection = require('../database/connection');

const APP_KEY = 'r4jNvxc-zFCrHySvhtw3VA==';
const APP_SECRET = 'eP-HH8T6vHF4RaHJEP8oR3ipwF_16YeUVvSJ-FDek-M=';


function insert(req, res) {
  console.log(req.body)
  let insertQuery = "INSERT INTO Interactions (url_img,hashtag,players_number,random,host_user,date,total_prompts,player1_points,player2_points,player3_points,player4_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  let query = mysql.format(insertQuery, [req.body.url_img, req.body.hashtag, req.body.players_number, req.body.random, req.body.host_user, req.body.date, req.body.total_prompts, req.body.player1_points, req.body.player2_points, req.body.player3_points, req.body.player4_points])
  databaseConnection.connection.query(query, function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error create interaction'
      })
    }
    return res.json({ id: result.insertId })
  });
}

function insertStreams(req, res) {
  console.log(req.body)
    let insertQuery = "INSERT INTO Streams (name,description,total_viewers,url_live,url_record,live,img,idInteraction,idConference,subscribeToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    let query = mysql.format(insertQuery, [req.body.name, req.body.description, req.body.total_viewers, req.url_live, req.body.url_record, req.body.live, req.body.img, req.body.idInteraction, req.body.idConference, req.body.subscribeToken])
    databaseConnection.connection.query(query, function(err,result){
        if(err) { 
            return res.status(500).json({
              message: 'Error create stream'
            })
          }
          return res.json({id: result.insertId})
    });
  }

async function getAceessToken(req, res) {
  const at = await dolbyio.communications.authentication.getClientAccessToken(APP_KEY, APP_SECRET);
  if (at.access_token == null || at.access_token == "") {
    return res.status(500).json({
      message: 'Error get Access token'
    })
  }
  return res.json({ AccessToken: at.access_token });
}

async function startStream(req, res) {
  const sdkToken = require('api')('@communications-apis/v1.4.9#1dfatt2fmlesv8nwn');

  var tokenApi = ""

  var response = ""

  sdkToken.auth('r4jNvxc-zFCrHySvhtw3VA==', 'eP-HH8T6vHF4RaHJEP8oR3ipwF_16YeUVvSJ-FDek-M=');
  await sdkToken.getApiToken({ grant_type: 'client_credentials' }, {
    accept: 'application/json',
    'cache-control': 'no-cache'
  })
    .then(({ data }) => tokenApi = data['access_token'])
    .catch(err => console.error(err));

    const sdk = require('api')('@communications-apis/v1.4.9#hgralehnmhj4');

    sdk.auth(tokenApi);

    sdk.startRts({
      layoutUrl: 'https://main--boisterous-gumdrop-35c313.netlify.app/'
    }, {conference_id: req.body.idConference})
      .then(({ data }) => response = data)
      .catch(err => console.error(err));

    res.json(response);
}


function read(req, res) {
  databaseConnection.connection.query('SELECT * From Interactions', function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error get interactions'
      })
    }
    return res.json(result)
  });

}

function readStreams(req, res) {
  databaseConnection.connection.query('SELECT * From Streams', function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error get Streams'
      })
    }
    return res.json(result)
  });

}

function readId(req, res) {
  let query = 'SELECT * From Interactions WHERE id = ' + req.params.id
  databaseConnection.connection.query(query, function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error get interaction by id'
      })
    }
    return res.json(result)
  });

}

function readConferenceIdStreams(req, res) {
  let query = 'SELECT idInteraction FROM Streams WHERE idConference = "' + req.body.idConference + '"';
  databaseConnection.connection.query(query, function (err, result) {
    if (err) {
      throw err;
      return res.status(500).json({
        message: 'Error '
      })
    }
    return res.json(result)
  });

}

function updatePoints(req, res) {
  let query = "UPDATE Interactions SET player" + req.params.player + "_points = " + req.params.points + " WHERE id = " + req.params.id;
  databaseConnection.connection.query(query, function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error get interaction by id'
      })
    }
    return res.json(result)
  });
}


function updateLive(req, res) {
  let query = "UPDATE Streams SET url_live" + req.body.url_live + ", live = " + req.body.live + " WHERE id = " + req.body.id;
  databaseConnection.connection.query(query, function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error '
      })
    }
    return res.json(result)
  });
}

function updateLiveStatus(req, res) {
  let query = "UPDATE Streams SET live = " + req.body.live + " WHERE id = " + req.body.id;
  databaseConnection.connection.query(query, function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error'
      })
    }
    return res.json(result)
  });
}

function getTurns(id) {
  let query = "SELECT total_prompts FROM Interactions WHERE id = 1";
  databaseConnection.connection.query(query, function (err, result) {
    console.log("geeet")
    if (err) {
      return -1
    }
    let number = JSON.stringify(result[0].total_prompts)
    console.log("numberrrr:" + number)
    return number
  });
}

async function getWinner(req, res) {

  let player1 = 0
  let player2 = 0
  let player3 = 0
  let player4 = 0

  let players = []

  let query1 = "Select player1_points from Interactions where id = " + req.params.id;
  let query2 = "Select player2_points from Interactions where id = " + req.params.id;
  let query3 = "Select player3_points from Interactions where id = " + req.params.id;
  let query4 = "Select player4_points from Interactions where id = " + req.params.id;

  await databaseConnection.connection.query(query1, function (err, result) {
    if (err) {
      return res.status(500).json({
        message: 'Error get Winner'
      })
    }
    player1 = result[0].player1_points;
    databaseConnection.connection.query(query2, function (err, result) {
      if (err) {
        return res.status(500).json({
          message: 'Error get Winner'
        })
      }
      player2 = result[0].player2_points;
      databaseConnection.connection.query(query3, function (err, result) {
        if (err) {
          return res.status(500).json({
            message: 'Error get Winner'
          })
        }
        player3 = result[0].player3_points;
        databaseConnection.connection.query(query4, function (err, result) {
          if (err) {
            return res.status(500).json({
              message: 'Error get Winner'
            })
          }
          player4 = result[0].player4_points;
          MaxPoints(player1, player2, player3, player4, res);
        });
      });
    });
  });

}


function MaxPoints(player1, player2, player3, player4, res) {

  if (player1 > player2 && player1 > player3 && player1 > player4) {
    return res.json({ winner: 'player1' });
  }

  if (player2 > player1 && player2 > player3 && player2 > player4) {
    return res.json({ winner: 'player2' });
  }
  if (player3 > player2 && player3 > player1 && player3 > player4) {
    return res.json({ winner: 'player3' });
  }
  if (player4 > player2 && player4 > player3 && player4 > player1) {
    return res.json({ winner: 'player4' });
  }
}

module.exports = { insert, read, readId, updatePoints, getWinner, getTurns, getAceessToken, startStream, readConferenceIdStreams,updateLive, readStreams, insertStreams }

