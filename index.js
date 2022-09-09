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


app.get("/", (req,res) => {
    console.log(req)
    res.send("Paika API v1.0")
})

app.post("/interaction", (req, res) => {
    interactionsController.insert(req,res)
});

app.post("/votes", (req, res) => {
    votesController.insert(req,res)
});
app.post("/multipleOptions", (req, res) => {
    multipleOptionsController.insert(req,res)
});
app.post("/textOnly", (req, res) => {
    TextOnlyController.insert(req,res)
});


const helperImage = (filePath, fileName, size) => {
    return sharp(filePath)
    .resize(size)
    .toFile(`./public/optimize/${fileName}`)
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./uploads')
    },
    filename:(req,file,cb) => {
        const ext = file.originalname.split('.').pop()
        cb(null,`${Date.now()}.${ext}`);
    }
})



const upload = multer({storage})

app.post("/upload",upload.single('file'),(req,res) => {
    helperImage(req.file.path, `resize-${req.file.filename}`, 300)
    res.send({data: `resize-${req.file.filename}`});
})

const staticRoute = path.join(__dirname, './public/optimize');

app.use('/image', express.static(staticRoute));

app.use(express.static(path.join(__dirname,'public')));


const PORT = process.env || 8080

const server = app.listen(PORT, () => {
    console.log("Listening on port: " + 9000);
    databaseConnection.connectionToDatabase();
});


const io = require('socket.io')(server)

connections =  [];

io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connect: %s sockets are connected', connections.length);

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket),1)
        console.log('Disconnect: %s sockets are connected', connections.length);
    })

    socket.on('NodeJS Server Port', function(data){
        console.log(data)
        io.sockets.emit('iOS Client Port', {msg: 'Hi iOS Client'})
    })

    socket.on('join', function(idRoom) {
        console.log('joining room', idRoom);
        socket.join(idRoom);
    });

    socket.on('start', function(data) {
        
        console.log(data)
        io.sockets.to(data).emit('start', {start: 1})
        var i = 0;
        var counter = 0
        var time = 0
        var turnIndex = 0
        var text = ""
        var img = ""
        var numberOfPlayers


        
        let query = "SELECT total_prompts FROM Interactions WHERE id = "+data;
        databaseConnection.connection.query(query, function (err, result){
            if(err) { 
                return -1
                }
                let number = JSON.stringify(result[0].total_prompts)
                turnIndex = number
                return number
        });
                let queryOrder = "SELECT idPrompt, type FROM Paika.Order WHERE idInteraction = "+data+" AND turn = 1";
                databaseConnection.connection.query(queryOrder, function (err, result){
                    console.log("seleccionando prompt")
                    if(err) { 
                        return 0
                    }
                    io.sockets.to(data).emit('type', result[0].type);
                    let queryPrompt = "SELECT id, text,img,time FROM "+result[0].type+" WHERE idInteraction = "+data;
                    databaseConnection.connection.query(queryPrompt, function (err, resultP){
                        console.log("Obtener datos del promp")
                        if(err) { 
                            return 0
                        }
                        io.sockets.to(data).emit('text', {text: resultP[0].text})
                        io.sockets.to(data).emit('img', resultP[0].img)
                        counter = resultP[0].time ;
                        io.sockets.to(data).emit('totalTimer', {totalTimer: resultP[0].time})
                    });
                });

       
        var countdown = setInterval(function(){
            
            
            counter--
            console.log("***")
            console.log(counter)
            console.log("***")
            io.sockets.to(data).emit('timer', {timer: counter+1})
            
            if(counter ===0){
                let queryOrder = "SELECT idPrompt, type FROM Paika.Order WHERE idInteraction = "+data+" AND turn = 1";
                databaseConnection.connection.query(queryOrder, function (err, result){
                    console.log("seleccionando prompt")
                    if(err) { 
                        return -1
                    }
                    io.sockets.to(data).emit('type', {type: result[0].type});
                    let queryPrompt = "SELECT id, text,img,time FROM "+result[0].type+" WHERE idInteraction = "+data;
                    databaseConnection.connection.query(queryPrompt, function (err, resultP){
                        console.log("Obtener datos del promp")
                        if(err) { 
                            return -1
                        }
                        console.log("Textoo" + resultP[0].text)
                        io.sockets.to(data).emit('text', {text: resultP[0].text})
                        io.sockets.to(data).emit('img', resultP[0].img)
                        counter = resultP[0].time;
                        io.sockets.to(data).emit('totalTimer', {totalTimer: resultP[0].time})
                    });
                });
                console.log("turno "+turnIndex)
                console.log("vuelta: "+i)
                    i++
                if (turnIndex < i){
                    clearInterval(countdown)
                    io.sockets.to(data).emit('finish', {finish: 1})
                    io.sockets.to(data).emit('text', {text: "Winner is "})
                }
            }
        },1000);
        console.log("start")
    });
});

//module.exports = app