// const connect =require("connect");
// const serveStatic  = require("serve-static");
const http = require("http");
const fs = require('fs');
const mime = require('mime-types');
const path = require("path");

const host = "localhost";
const port = 8080;

const handleFile = (req, res, fileName) => {
    let filePath = path.join(__dirname , (fileName || req.url));
    const handleExistingFile = (req, res) => {
        let file = fs.readFileSync(filePath);
        let fileName = path.basename(filePath);
        let mimeType = mime.lookup(fileName);
        res.writeHead(200, { 'content-type': mimeType });
        res.end(file);
    };
    const handleMissingFile = (req, res) => {
        res.writeHead(200, "Content-Type", "application/json");
        res.end(`{"message": "File not found ${filePath}"}`);
    };
    fs.existsSync(filePath) ? handleExistingFile(req, res) : handleMissingFile(req, res);
};

const handleIndex = (req, res) => {
    handleFile(req, res, "index.html");
};

const server = http.createServer((req, res) => {
    req.url.includes(".") ? handleFile(req, res) : handleIndex(req, res);
})

server.listen(port, host);