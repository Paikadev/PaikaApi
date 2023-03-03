var express = require('express');
var app = express();
require('dotenv').config();
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
var routerInteraction = require('./Routes/interaction.router');
var routerTextOnly = require("./Routes/textOnly.router");
var routerVotes = require("./Routes/votes.router");
var routerMultipleOptions = require("./Routes/multipleOtions.router");
const bodyParser = require('body-parser');
const dolbyio = require('@dolbyio/dolbyio-rest-apis-client');
const databaseConnection = require('./database/connection')

var votesController = require('./Controllers/votes.controller')
var multipleOptionsController = require('./Controllers/multipleOptions.controller')
var TextOnlyController = require('./Controllers/textOnlyController')
var interactionsController = require('./Controllers/interactions.controller')

//Routes
//app.use('/interaction', routerInteraction);
//app.use('/textOnly', routerTextOnly);
//app.use('/votesss', routerVotes);
//app.use('/multipleOptions', routerMultipleOptions);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cors());


app.get("/", (req, res) => {
    res.send("Paika API v1.0")
});

app.get("/getAceessToken", (req, res) => {
    interactionsController.getAceessToken(req,res);
})

app.post("/interaction", (req, res) => {
    interactionsController.insert(req, res)
});
app.get("/interactions", (req, res) => {
    interactionsController.read(req, res)
});

app.post("/votes", (req, res) => {
    votesController.insert(req, res)
});
app.post("/multipleOptions", (req, res) => {
    multipleOptionsController.insert(req, res)
});
app.post("/textOnly", (req, res) => {
    TextOnlyController.insert(req, res)
});


const helperImage = (filePath, fileName, size) => {
    return sharp(filePath)
        .resize(size)
        .toFile(`./public/optimize/${fileName}`)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null, `${Date.now()}.${ext}`);
    }
})



const upload = multer({ storage })

app.post("/upload", upload.single('file'), (req, res) => {
    helperImage(req.file.path, `resize-${req.file.filename}`, 300)
    res.send({ data: `resize-${req.file.filename}` });
})

const staticRoute = path.join(__dirname, './public/optimize');

app.use('/image', express.static(staticRoute));

app.use(express.static(path.join(__dirname, 'public')));


//const PORT = process.env || 8080

const server = app.listen(9000, () => {
    console.log("Listening on port: " + 9000);
    databaseConnection.connectionToDatabase();
});


const io = require('socket.io')(server)

connections = [];



io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connect: %s sockets are connected', connections.length);

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1)
        console.log('Disconnect: %s sockets are connected', connections.length);
    })

    socket.on('NodeJS Server Port', function (data) {
        console.log(data)
        io.sockets.emit('iOS Client Port', { msg: 'Hi iOS Client' })
    })

    socket.on('join', function (idRoom) {
        var totalUsers = 0;
        console.log('joining room', idRoom);
        socket.join(idRoom);
        totalUsers++;
        io.sockets.to(idRoom).emit('totalUser', { totalUsers: totalUsers });
    });

    socket.on('leave', function (idRoom) {
        io.socketsLeave(idRoom);
        socket.leave(socket.current_room);
        socket.leave(idRoom);
        console.log("User leave room")
        io.sockets.to(idRoom).emit('finish_socket', {finish: true });
    });

    socket.on('start', function (data) {
        var started = false
        if(started == false){
            started = true
        io.sockets.to(data).emit('start', { start: 1 })
        var i = 0;
        var counter = 0
        var time = 0
        var turnIndex = 0
        var totalPrompts = 0
        var text = ""
        var img = ""
        var finishInteraction = false

        var waiting = 0



        let query = "SELECT total_prompts FROM Interactions WHERE id = " + data;
        databaseConnection.connection.query(query, function (err, result) {
            if (err) {
                return 0
            }
            let number = JSON.stringify(result[0].total_prompts)
            totalPrompts = result[0].total_prompts
            return number
        });
        let queryOrder = "SELECT idPrompt,type FROM Paika.Order WHERE idInteraction = " + data + " AND turn = 0";
        databaseConnection.connection.query(queryOrder, function (err, result) {
            if (err) {
                return 0
            }

            
            io.sockets.to(data).emit('turn', turnIndex);
            io.sockets.to(data).emit('totalPrompts', totalPrompts);
            io.sockets.to(data).emit('type', { type: result[0].type });
            switch (result[0].type) {
                case "TextOnly":
                    let queryPromptTextOnly = "SELECT id,text,img,time FROM " + result[0].type + " WHERE idInteraction = " + data + " AND turn = 0";
                    databaseConnection.connection.query(queryPromptTextOnly, function (err, resultP) {
                        if (err) {
                            return 0
                        }
                        io.sockets.to(data).emit('text', { text: resultP[0].text })
                        io.sockets.to(data).emit('img', {img: resultP[0].img});
                        counter = resultP[0].time;
                        io.sockets.to(data).emit('totalTimer', { totalTimer: resultP[0].time })
                    });
                    break;

                case "Votes":
                    let queryPromptVotes = "SELECT id,text,img,time FROM " + result[0].type + " WHERE idInteraction = " + data + " AND turn = 0";
                    databaseConnection.connection.query(queryPromptVotes, function (err, resultP) {
                        if (err) {
                            return 0
                        }
                        io.sockets.to(data).emit('text', { text: resultP[0].text })
                        io.sockets.to(data).emit('img', {img: resultP[0].img});
                        counter = resultP[0].time;
                        io.sockets.to(data).emit('totalTimer', { totalTimer: resultP[0].time })
                    });
                    break;

                case "MultipleOptions":
                    let queryPromptMO = "SELECT id,text,img,time,option_1,option_2,option_3,option_4,option_correct FROM MultipleOptions WHERE idInteraction = " + data + " AND turn = 0";
                    databaseConnection.connection.query(queryPromptMO, function (err, resultP) {
                        if (err) {
                            return 0
                        }
                        io.sockets.to(data).emit('text', { text: resultP[0].text })
                        io.sockets.to(data).emit('img', {img: resultP[0].img});
                        counter = resultP[0].time;
                        io.sockets.to(data).emit('totalTimer', { totalTimer: resultP[0].time })
                        io.sockets.to(data).emit('option_1', { option_1: resultP[0].option_1 })
                        io.sockets.to(data).emit('option_2', { option_2: resultP[0].option_2 })
                        io.sockets.to(data).emit('option_3', { option_3: resultP[0].option_3 })
                        io.sockets.to(data).emit('option_4', { option_4: resultP[0].option_4 })
                        io.sockets.to(data).emit('option_correct', { option_correct: resultP[0].option_correct })
                    });
                    break;
                default:
                // code default
            }
            turnIndex += 1;
        });


        var countdown = setInterval(function () {
            var x = setInterval(function() {
                io.sockets.to(data).emit('text', { text: "..." })
            }, 3000);
            counter--;

            io.sockets.to(data).emit('timer', { timer: counter + 1 })


            if (counter == 0) {
                if (turnIndex == totalPrompts) {
                    clearInterval(countdown)
                    io.sockets.to(data).emit('finish', { finish: 1 })
                    io.sockets.to(data).emit('text', { text: "Winner is " })
                  
                    
                } else {
                i++;
                let queryOrder = "SELECT idPrompt,type FROM Paika.Order WHERE idInteraction = " + data + " AND turn = " + turnIndex;
                databaseConnection.connection.query(queryOrder, function (err, result) {
                    if (err) {
                        //finishInteraction = true
                    }


                        

                        io.sockets.to(data).emit('turn', turnIndex);
                        io.sockets.to(data).emit('totalPrompts', totalPrompts);
                        io.sockets.to(data).emit('type', { type: result[0].type });
                        switch (result[0].type) {
                            case "TextOnly":
                                let queryPromptTextOnly = "SELECT id,text,img,time FROM TextOnly WHERE idInteraction = " + data + " AND turn = " + turnIndex;
                                databaseConnection.connection.query(queryPromptTextOnly, function (err, resultP) {
                                    if (err) {
                                        return 0
                                    }
                                    io.sockets.to(data).emit('text', { text: resultP[0].text })
                                    io.sockets.to(data).emit('img', {img: resultP[0].img});
                                    counter = resultP[0].time;
                                    io.sockets.to(data).emit('totalTimer', { totalTimer: resultP[0].time })
                                    turnIndex += 1;
                                });
                                break;

                            case "Votes":
                                let queryPromptVotes = "SELECT id,text,img,time FROM Votes WHERE idInteraction = " + data + " AND turn = " + turnIndex;
                                databaseConnection.connection.query(queryPromptVotes, function (err, resultP) {
                                    if (err) {
                                        return 0
                                    }
                                    io.sockets.to(data).emit('text', { text: resultP[0].text })
                                    io.sockets.to(data).emit('img', {img: resultP[0].img});
                                    counter = resultP[0].time;
                                    io.sockets.to(data).emit('totalTimer', { totalTimer: resultP[0].time })
                                    turnIndex += 1;
                                });
                                break;

                            case "MultipleOptions":
                                let queryPromptMO = "SELECT id,text,img,time,option_1,option_2,option_3,option_4,option_correct FROM MultipleOptions WHERE idInteraction = " + data + " AND turn = " + turnIndex;
                                databaseConnection.connection.query(queryPromptMO, function (err, resultP) {
                                    if (err) {
                                        return 0
                                    }
                                    io.sockets.to(data).emit('text', { text: resultP[0].text })
                                    io.sockets.to(data).emit('img', {img: resultP[0].img});
                                    counter = resultP[0].time;
                                    io.sockets.to(data).emit('option_1', { option_1: resultP[0].option_1 })
                                    io.sockets.to(data).emit('option_2', { option_2: resultP[0].option_2 })
                                    io.sockets.to(data).emit('option_3', { option_3: resultP[0].option_3 })
                                    io.sockets.to(data).emit('option_4', { option_4: resultP[0].option_4 })
                                    io.sockets.to(data).emit('option_correct', { option_correct: resultP[0].option_correct })
                                    turnIndex += 1;
                                });
                                break;
                            default:
                            // code default
                        }
                });
                }
                

                if (finishInteraction) {
                    clearInterval(countdown)
                    io.sockets.to(data).emit('finish', { finish: 1 })
                    
                }

            }
        }, 1000);
        console.log("start")
        }
        else{
            console.log("Ya se ha iniciado la interaccion: " + data)
        }
    });
});

//module.exports = app