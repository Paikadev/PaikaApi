var express = require("express");
var app = express();
const https = require("https");
const fs = require("fs");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
var routerInteraction = require("./Routes/interaction.router");
var routerTextOnly = require("./Routes/textOnly.router");
var routerVotes = require("./Routes/votes.router");
var routerMultipleOptions = require("./Routes/multipleOtions.router");
const bodyParser = require("body-parser");
const dolbyio = require("@dolbyio/dolbyio-rest-apis-client");
const databaseConnection = require("./database/connection");
const mysql = require("mysql");

var votesController = require("./Controllers/votes.controller");
var multipleOptionsController = require("./Controllers/multipleOptions.controller");
var TextOnlyController = require("./Controllers/textOnlyController");
var interactionsController = require("./Controllers/interactions.controller");

//Routes
//app.use('/interaction', routerInteraction);
//app.use('/textOnly', routerTextOnly);
//app.use('/votesss', routerVotes);
//app.use('/multipleOptions', routerMultipleOptions);

const APP_KEY = "r4jNvxc-zFCrHySvhtw3VA==";
const APP_SECRET = "eP-HH8T6vHF4RaHJEP8oR3ipwF_16YeUVvSJ-FDek-M=";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Paika API v1.0");
});

app.get("/getAceessToken", (req, res) => {
  interactionsController.getAceessToken(req, res);
});

app.post("/startStream", (req, res) => {
  interactionsController.startStream(req, res);
});

app.post("/interaction", (req, res) => {
  interactionsController.insert(req, res);
});

app.post("/stream", (req, res) => {
  interactionsController.insertStreams(req, res);
});

app.get("/interactions", (req, res) => {
  interactionsController.read(req, res);
});

app.get("/Streams", (req, res) => {
  interactionsController.readStreams(req, res);
});

app.post("updateLive", (req, res) => {
  interactionsController.updateLive(req, res);
});

app.post("updateLiveStatus", (req, res) => {
  interactionsController.updateLiveStatus(req, res);
});

app.get("/streams/IdInteraction", (req, res) => {
  interactionsController.readConferenceIdStreams(req, res);
});

app.post("/votes", (req, res) => {
  votesController.insert(req, res);
});
app.post("/multipleOptions", (req, res) => {
  multipleOptionsController.insert(req, res);
});
app.post("/textOnly", (req, res) => {
  TextOnlyController.insert(req, res);
});

const helperImage = (filePath, fileName, size) => {
  return sharp(filePath).resize(size).toFile(`./public/optimize/${fileName}`);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  helperImage(req.file.path, `resize-${req.file.filename}`, 300);
  res.send({ data: `resize-${req.file.filename}` });
});

const staticRoute = path.join(__dirname, "./public/optimize");

app.use("/image", express.static(staticRoute));

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(9000, () => {
  console.log("Listening on port: " + 9000);
  databaseConnection.connectionToDatabase();
});

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connections = [];
playerPoints = [];

io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log("Connect: %s sockets are connected", connections.length);

  datos = {
    img: "img",
    name: "Lalo Paika",
    description: "this is test a sh hs",
    rtmpUrl:
      "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_20mb.mp4",
    recordpUrl: "(user2Count * 100) / totalVotes,",
    live: true,
    totalViewers: 100,
  };

  io.sockets.emit("streamList", datos);

  socket.on("disconnect", function (data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnect: %s sockets are connected", connections.length);
  });

  socket.on("NodeJS Server Port", function (data) {
    console.log(data);
    io.sockets.emit("iOS Client Port", { msg: "Hi iOS Client" });
  });
  var totalUsers = 0;
  socket.on("join", function (idRoom) {
    console.log("joining room", idRoom);
    socket.join(idRoom);
    totalUsers + 1;
    io.sockets.to(idRoom).emit("totalUser", { totalUsers: totalUsers });
  });

  socket.on("get_interaction_id", function (idConference) {
    console.log("Obteniendo conferencia para: " + idConference);
    let query =
      'SELECT idInteraction FROM Streams WHERE idConference = "' +
      idConference +
      '"';
    databaseConnection.connection.query(query, function (err, result) {
      if (err) {
      }
      //return res.json(result)
      console.log(result);
      io.sockets.emit("set_interaction_id", { result });
    });
  });

  socket.on("leave", function (idRoom) {
    io.socketsLeave(idRoom);
    socket.leave(socket.current_room);
    socket.leave(idRoom);
    console.log("User leave room");
    io.sockets.to(idRoom).emit("finish_socket", { finish: true });
  });

  socket.on("total_user_mixer", function (data) {
    io.sockets.to(data["id"]).emit("total_user_mixer", { finish: true });
  });

  socket.on("initial_data", function (data) {
    const sdk = require("api")("@communications-apis/v1.4.9#hgrilehnbxlc");

    console.log("id conferencia: " + data["id_conference"]);

    idConference = data["id_conference"];

    sdk.auth(
      "eyJ0eXAiOiJKV1QiLCJraWQiOiI1ODExQjE0RS1DQzVCLTQ4QkQtQTNEOC1DREQxQzUzQ0ZDNUMiLCJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJkb2xieS5pbyIsImlhdCI6MTY4ODY0NDYwNCwic3ViIjoicjRqTnZ4Yy16RkNySHlTdmh0dzNWQT09IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJ0YXJnZXQiOiJhcGkiLCJvaWQiOiIzYzJiYzdjYy1iNmU3LTRlZTQtYWJiYi00OWEzOGEwNGQ4YjMiLCJhaWQiOiI4MjliMzMxNi0yOWJlLTQ4OGYtYjE5OS0wN2Y2ZDQ1YmMzODQiLCJiaWQiOiI4YTM2OWMzYzg3ZWMxNzI2MDE4N2VmZjc3ODE0NDY5NSIsImV4cCI6MTY4ODczMTAwNH0.l23NBQ_bsms6B0Xcw1w1f1TEMwkxitOkT7kxNIoZl0PLbHFM0j0QJhtOE90JLoNcoBOlZ-AKklBA-VDp4asGVjl0PPAPqMjjcx4b3Be7w6u48lO6VOH0w0jMoE8blcckFCbo_ULKFqdu6kok2V0bcY80iXQMbxri2gu1_7pr_4TtwXDZrj_A3kD9tKMH5_jhtWRaANA--t-DlCgk9goCpgnTkHHgWUufa9eRXiry9NTynsZkEG1g4mL_EqVulpI--suK0W1rnBefGRyapY7r8zHXrA9K0wmFN7SG7FriPiKd0pKPxem3EkgC1HlOS5jhokLFWEadzObSX7H-jnccPWSby7pnI-sZ34m-40mrN-tok6kpYBE-2-614dR65uhXfS30JTk8zBPatr1pYqgih_680o0_F6y_oDEdWXCLw6Fv7zzis9iSElQNijUZCAdUXNeOawfga2fD4IhtCgmFDjf8_kE_4JG1qTdn99nH0HHy66KG_GO-Et94oocCOyELAn-wVxImTiZriUAZ6gGTLiz6kaWOw03skWLk2ieM2VOQLck3FS5ENPVBNXJv9xtaH6ux1ZT95qYBEQdabOhZimpK5kO8MraVxCGLX0W5d88A5ELNQMTuC8MvzrXs_O9G19ppXxApRonB2s5H1tacKwOeFAbzCXN_2mKer8Kcj4s");

    sdk
      .apiRecordingStart(
        { layoutUrl: "https://boisterous-gumdrop-35c313.netlify.app/" },
        {
          conference_id: idConference,
        }
      )
      .then(({ datos }) => console.log(datos))
      .catch((err) => console.error(err));

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // El mes está basado en cero, por lo que se suma 1 y se rellena con ceros si es necesario.
    const day = String(currentDate.getDate()).padStart(2, "0"); // Se rellena con ceros si es necesario.
    const hour = String(currentDate.getHours()).padStart(2, "0");
    const minute = String(currentDate.getMinutes()).padStart(2, "0");
    const second = String(currentDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hour}:${minute}:${second}`;

    const horaFecha = formattedDate + formattedTime;

    let insertQuery =
      "INSERT INTO Streams (name,description,total_viewers,url_live,url_record,live,img,idInteraction,idConference,subscribeToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let query = mysql.format(insertQuery, [
      horaFecha,
      "",
      10,
      "",
      true,
      "",
      "",
      data["id_interaction"],
      data["id_conference"],
      "",
    ]);
    databaseConnection.connection.query(query, function (err, result) {
      if (err) {
        console.log("Error create stream");
      }
      console.log("Initial data success");
    });

    console.log("InitialData:");
    console.log(data);
    //const sdkToken = require('api')('@communications-apis/v1.4.9#1dfatt2fmlesv8nwn');
    const sdkToken = require("api")(
      "@communications-apis/v1.4.9#dun2q916liivo5c3"
    );

    var tokenApi = "";

    var response = "";

    //sdkToken.auth('r4jNvxc-zFCrHySvhtw3VA==', 'eP-HH8T6vHF4RaHJEP8oR3ipwF_16YeUVvSJ-FDek-M=');
  });

  socket.on("points", function (data) {
    console.log("Entro a points");
    let idInteraction = JSON.stringify(data["id_interaction"]);
    console.log("****User options data****");

    console.log("***Points Users:");
    console.log(playerPoints);
    console.log("Points Users***");
    io.sockets.to(idInteraction).emit("points_update", data);
  });

  socket.on("json_players_mixer", function (data) {
    let idInteraction = JSON.stringify(data["id_interaction"]);
    io.sockets.to(idInteraction).emit("json_players_mixer", data);
  });

  socket.on("option_user", function (data) {
    console.log("Entro a points");
    let idInteraction = JSON.stringify(data["id_interaction"]);
    console.log("****User points data****");

    console.log("***Points Users:");
    console.log(playerPoints);
    console.log("Points Users***");
    io.sockets.to(idInteraction).emit("options_update", data);
  });

  user1Count = 0.0;
  user1Name = "";
  user2Count = 0.0;
  user2Name = "";
  user3Count = 0.0;
  user3Name = "";
  user4Count = 0.0;
  user5Name = "";

  socket.on("chat message", (message) => {
    let idInteraction = JSON.stringify(message["id_interaction"]);
    idInteraction = idInteraction + "chat";
    io.sockets.to(idInteraction).emit("chat message", message); // Emitir el mensaje a todos los usuarios conectados
  });

  socket.on("mixer_players_total_socket", (message) => {
    let idInteraction = JSON.stringify(message["id_interaction"]);
    io.sockets.to(idInteraction).emit("mixer_players_total_socket", message);
  });

  socket.on("vote_user", function (data) {
    console.log("Entro a votos");
    let idInteraction = JSON.stringify(data["id_interaction"]);

    if (data["number_players"] == 2) {
      if (user1Name == "") {
        user1Name = data["vote"];
      }
      if (user2Name == "" && user1Name != "") {
        user2Name = data["vote"];
      }

      if (user1Name == data["vote"]) {
        user1Count = user1Count + 1;
      }
      if (user2Name == data["vote"]) {
        user2Count = user2Count + 1;
      }

      if (user1Name == data["current_vote"]) {
        user1Count = user1Count - 1;
      }
      if (user2Name == data["current_vote"]) {
        user2Count = user2Count - 1;
      }

      totalVotes = user1Count + user2Count;

      datos = {
        user1Name: user1Name,
        user1Percent: (user1Count * 100) / totalVotes,
        user2Name: user2Name,
        user2Percent: (user2Count * 100) / totalVotes,
      };

      io.sockets.to(idInteraction).emit("votes_update", datos);
    }

    if (data["number_players"] == 3) {
      if (user1Name == "") {
        user1Name = data["vote"];
      }
      if (user2Name == "" && user1Name != "") {
        user2Name = data["vote"];
      }
      if (user3Name == "" && user1Name != "" && user2Name != "") {
        user3Name = data["vote"];
      }

      if (user1Name == data["vote"]) {
        user1Count = user1Count + 1;
      }
      if (user2Name == data["vote"]) {
        user2Count = user2Count + 1;
      }
      if ((user3Name = data["vote"])) {
        user3Count = user3Count + 1;
      }

      if (user1Name == data["current_vote"]) {
        user1Count = user1Count - 1;
      }
      if (user2Name == data["current_vote"]) {
        user2Count = user2Count - 1;
      }
      if (user3Name == data["current_vote"]) {
        user3Count = user3Count - 1;
      }

      totalVotes = user1Count + user2Count + user3Count;

      datos = {
        user1Name: user1Name,
        user1Percent: (user1Count * 100) / totalVotes,
        user2Name: user2Name,
        user2Percent: (user2Count * 100) / totalVotes,
        user3Name: user3Name,
        user3Percent: (user3Count * 100) / totalVotes,
      };

      io.sockets.to(idInteraction).emit("votes_update", datos);
    }

    if (data["number_players"] == 4) {
      if (user1Name == "") {
        user1Name = data["vote"];
      }
      if (user2Name == "" && user1Name != "") {
        user2Name = data["vote"];
      }
      if (user3Name == "" && user1Name != "" && user2Name != "") {
        user3Name = data["vote"];
      }
      if (
        user4Name == "" &&
        user1Name != "" &&
        user2Name != "" &&
        user3Name != ""
      ) {
        user4Name = data["vote"];
      }

      if (user1Name == data["vote"]) {
        user1Count = user1Count + 1;
      }
      if (user2Name == data["vote"]) {
        user2Count = user2Count + 1;
      }
      if ((user3Name = data["vote"])) {
        user3Count = user3Count + 1;
      }
      if (user4Name == data["vote"]) {
        user4Count = user4Count + 1;
      }

      if (user1Name == data["current_vote"]) {
        user1Count = user1Count - 1;
      }
      if (user2Name == data["current_vote"]) {
        user2Count = user2Count - 1;
      }
      if (user3Name == data["current_vote"]) {
        user3Count = user3Count - 1;
      }
      if (user4Name == data["current_vote"]) {
        user4Count = user4Count - 1;
      }

      totalVotes = user1Count + user2Count + user3Count + user4Count;

      datos = {
        user1Name: user1Name,
        user1Percent: (user1Count * 100) / totalVotes,
        user2Name: user2Name,
        user2Percent: (user2Count * 100) / totalVotes,
        user3Name: user3Name,
        user3Percent: (user3Count * 100) / totalVotes,
        user4Name: user4Name,
        user4Percent: (user4Count * 100) / totalVotes,
      };

      io.sockets.to(idInteraction).emit("votes_update", datos);
    }
  });

  socket.on("initial", function (data) {
    console.log("initial");
    let query =
      "SELECT total_prompts,host_user,players_number FROM Interactions WHERE id = " +
      data;
    databaseConnection.connection.query(query, function (err, result) {
      if (err) {
        return 0;
      }
      console.log("user_host");
      console.log(result[0].host_user);
      console.log(result[0].players_number);
      io.sockets.to(data).emit("host_user", { host_user: result[0].host_user });
      io.sockets
        .to(data)
        .emit("players_number", { players_number: result[0].players_number });
    });
  });

  socket.on("start", function (data) {
    var started;

    if (started == true) {
      return;
    }
    started = true;
    if (true) {
      started = true;
      io.sockets.to(data).emit("start", { start: 1 });

      var i = 0;
      var counter = 0;
      var time = 0;
      var turnIndex = 0;
      var totalPrompts = 0;
      var text = "";
      var img = "";
      var finishInteraction = false;

      var waiting = 0;

      let query =
        "SELECT total_prompts,host_user,players_number FROM Interactions WHERE id = " +
        data;
      databaseConnection.connection.query(query, function (err, result) {
        if (err) {
          return 0;
        }
        io.sockets
          .to(data)
          .emit("host_user", { host_user: result[0].host_user });
        io.sockets
          .to(data)
          .emit("players_number", { players_number: result[0].players_number });
        let number = JSON.stringify(result[0].total_prompts);
        totalPrompts = result[0].total_prompts;
        return number;
      });
      let queryOrder =
        "SELECT idPrompt,type FROM Paika.Order WHERE idInteraction = " +
        data +
        " AND turn = 0";
      databaseConnection.connection.query(queryOrder, function (err, result) {
        if (err) {
          return 0;
        }

        io.sockets.to(data).emit("turn", turnIndex);
        io.sockets.to(data).emit("totalPrompts", totalPrompts);

        switch (result[0].type) {
          case "TextOnly":
            let queryPromptTextOnly =
              "SELECT id,text,img,time FROM " +
              result[0].type +
              " WHERE idInteraction = " +
              data +
              " AND turn = 0";
            databaseConnection.connection.query(
              queryPromptTextOnly,
              function (err, resultP) {
                if (err) {
                  return 0;
                }
                io.sockets.to(data).emit("text", { text: resultP[0].text });
                io.sockets.to(data).emit("img", { img: resultP[0].img });
                counter = resultP[0].time;
                io.sockets
                  .to(data)
                  .emit("totalTimer", { totalTimer: resultP[0].time });
              }
            );
            break;

          case "Votes":
            let queryPromptVotes =
              "SELECT id,text,img,time FROM " +
              result[0].type +
              " WHERE idInteraction = " +
              data +
              " AND turn = 0";
            databaseConnection.connection.query(
              queryPromptVotes,
              function (err, resultP) {
                if (err) {
                  return 0;
                }
                io.sockets.to(data).emit("text", { text: resultP[0].text });
                io.sockets.to(data).emit("img", { img: resultP[0].img });
                counter = resultP[0].time;
                io.sockets
                  .to(data)
                  .emit("totalTimer", { totalTimer: resultP[0].time });
              }
            );
            break;

          case "MultipleOptions":
            let queryPromptMO =
              "SELECT id,text,img,time,option_1,option_2,option_3,option_4,option_correct FROM MultipleOptions WHERE idInteraction = " +
              data +
              " AND turn = 0";
            databaseConnection.connection.query(
              queryPromptMO,
              function (err, resultP) {
                if (err) {
                  return 0;
                }
                io.sockets.to(data).emit("text", { text: resultP[0].text });
                io.sockets.to(data).emit("img", { img: resultP[0].img });
                counter = resultP[0].time;
                io.sockets
                  .to(data)
                  .emit("totalTimer", { totalTimer: resultP[0].time });
                io.sockets
                  .to(data)
                  .emit("option_1", { option_1: resultP[0].option_1 });
                io.sockets
                  .to(data)
                  .emit("option_2", { option_2: resultP[0].option_2 });
                io.sockets
                  .to(data)
                  .emit("option_3", { option_3: resultP[0].option_3 });
                io.sockets
                  .to(data)
                  .emit("option_4", { option_4: resultP[0].option_4 });
                io.sockets
                  .to(data)
                  .emit("option_correct", {
                    option_correct: resultP[0].option_correct,
                  });
              }
            );
            break;
          default:
          // code default
        }
        turnIndex += 1;
      });

      var countdown = setInterval(function () {
        var x = setInterval(function () {
          io.sockets.to(data).emit("text", { text: "..." });
        }, 3000);
        counter--;

        io.sockets.to(data).emit("timer", { timer: counter + 1 });

        if (counter == 0) {
          if (turnIndex == totalPrompts) {
            clearInterval(countdown);
            io.sockets.to(data).emit("finish", { finish: 1 });
            io.sockets.to(data).emit("text", { text: "Winner is " });
          } else {
            i++;
            let queryOrder =
              "SELECT idPrompt,type FROM Paika.Order WHERE idInteraction = " +
              data +
              " AND turn = " +
              turnIndex;
            databaseConnection.connection.query(
              queryOrder,
              function (err, result) {
                if (err) {
                  //finishInteraction = true
                }

                io.sockets.to(data).emit("turn", turnIndex);
                io.sockets.to(data).emit("totalPrompts", totalPrompts);
                io.sockets.to(data).emit("type", { type: result[0].type });
                switch (result[0].type) {
                  case "TextOnly":
                    let queryPromptTextOnly =
                      "SELECT id,text,img,time FROM TextOnly WHERE idInteraction = " +
                      data +
                      " AND turn = " +
                      turnIndex;
                    databaseConnection.connection.query(
                      queryPromptTextOnly,
                      function (err, resultP) {
                        if (err) {
                          return 0;
                        }
                        io.sockets
                          .to(data)
                          .emit("text", { text: resultP[0].text });
                        io.sockets
                          .to(data)
                          .emit("img", { img: resultP[0].img });
                        counter = resultP[0].time;
                        io.sockets
                          .to(data)
                          .emit("totalTimer", { totalTimer: resultP[0].time });
                        turnIndex += 1;
                      }
                    );
                    break;

                  case "Votes":
                    let queryPromptVotes =
                      "SELECT id,text,img,time FROM Votes WHERE idInteraction = " +
                      data +
                      " AND turn = " +
                      turnIndex;
                    databaseConnection.connection.query(
                      queryPromptVotes,
                      function (err, resultP) {
                        if (err) {
                          return 0;
                        }
                        io.sockets
                          .to(data)
                          .emit("text", { text: resultP[0].text });
                        io.sockets
                          .to(data)
                          .emit("img", { img: resultP[0].img });
                        counter = resultP[0].time;
                        io.sockets
                          .to(data)
                          .emit("totalTimer", { totalTimer: resultP[0].time });
                        turnIndex += 1;
                      }
                    );
                    break;

                  case "MultipleOptions":
                    let queryPromptMO =
                      "SELECT id,text,img,time,option_1,option_2,option_3,option_4,option_correct FROM MultipleOptions WHERE idInteraction = " +
                      data +
                      " AND turn = " +
                      turnIndex;
                    databaseConnection.connection.query(
                      queryPromptMO,
                      function (err, resultP) {
                        if (err) {
                          return 0;
                        }
                        io.sockets
                          .to(data)
                          .emit("text", { text: resultP[0].text });
                        io.sockets
                          .to(data)
                          .emit("img", { img: resultP[0].img });
                        counter = resultP[0].time;
                        io.sockets
                          .to(data)
                          .emit("option_1", { option_1: resultP[0].option_1 });
                        io.sockets
                          .to(data)
                          .emit("option_2", { option_2: resultP[0].option_2 });
                        io.sockets
                          .to(data)
                          .emit("option_3", { option_3: resultP[0].option_3 });
                        io.sockets
                          .to(data)
                          .emit("option_4", { option_4: resultP[0].option_4 });
                        io.sockets
                          .to(data)
                          .emit("option_correct", {
                            option_correct: resultP[0].option_correct,
                          });
                        turnIndex += 1;
                      }
                    );
                    break;
                  default:
                  // code default
                }
              }
            );
          }

          if (finishInteraction) {
            clearInterval(countdown);
            io.sockets.to(data).emit("finish", { finish: 1 });
          }
        }
      }, 1000);
      console.log("start");
    } else {
      console.log("Ya se ha iniciado la interaccion: " + data);
    }
  });
});

//module.exports = app
