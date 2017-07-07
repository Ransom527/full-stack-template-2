const path = require('path');
const express = require('express');


//add-in
const bodyParser = require('body-parser');
//const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: true });
const mongoose = require('mongoose');
const morgan = require('morgan');
const {
	PORT,
	DATABASE_URL
} = require('./config/config');

mongoose.Promise = global.Promise;

const app = express();
//add
const Note = require('./models/noteModels');


// API endpoints go here!

app.get('/api/test', (req,res) => { 
    res.json({text:"Hello World"})
});

app.get('/api/getnotes', (req, res) => {
    Note.find((error, notes) => {
        if(err)
            res.send(err)
            res.json(notes)
    })
});


app.get('/getnote', (req, res) => {
	Note
		.findById(req.query.ID)
		.exec()
		.then(note => {
			res.json(note.apiRepr());
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		})
});


//Add note
app.post('/addnote', (req, res) => {
	Note
		.create({
			Title: req.body.Title,
			Body: req.body.Body,
			Username: req.body.Username
		})
		.then((post) => {
			console.log(post);
			res.status(201).json(post.apiRepr().ID);
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		});
});


//JSON.stringify
//Update note
app.post('/updatenote', (req, res) => {
	console.log(req.body);
	Note
		.findByIdAndUpdate(req.body.ID,{$set:{Title:req.body.Title,Body:req.body.Body,Username:req.body.Username}}, {new: true})
		.exec()
		.then(() => {
			res.status(200).json({
				message: 'success'
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		});
});


app.delete('/deletenote', (req, res) => {
	Note
		.findByIdAndRemove(req.query.ID)
		.exec()
		.then(() => {
			res.status(200).json({
				message: 'success'
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'something went terribly wrong'
			});
		});
});



// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));
//add
app.use(morgan('common'));
//app.use(jsonParser);
app.use(urlParser);
//app.use(express.static('public'));



// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;

function runServer(port=3001) {
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            resolve();
        }).on('error', reject);
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
