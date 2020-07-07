
const express = require('express'),
    fs = require('fs'),
    image = express.Router(),
    multer = require("multer"),
    path = require("path")

const server = `http://localhost:4444`;
// const server = 'https://testcheckfiletype.herokuapp.com'

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "routes/uploads/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
            "_" +
            file.originalname
                .split(" ")
                .join()
                .replace(",", "_")
        );
    }
});
checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("images only");
    }
};
let uploader = multer({
    storage,
    limits: { fileSize: 100000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).array("file");



image.get('/upload/:path', (req, res) => {
    return res.sendFile(req.params.path, { root: "routes/uploads/" });
})
image.post('/upload', (req, res) => {
    uploader(req, res, err => {
        if (err) res.json({ message: "error", details: err });
        else {
            if (req.files == undefined) {
                res.json({ message: "error", details: "no file selected" });
            } else {
                const files = req.files
                const urlImage = []
                for (const key in req.files) {
                    if (key) {
                        // console.log(files[key].filename);
                        urlImage.push(`${server}/uploads/upload/${files[key].filename}`)
                    }
                }

                res.send(urlImage)
                // res.json({
                //     message: "file uploaded",
                //     url: `${urlImage}`
                // });
            }
        }
    });
})

module.exports = image
module.exports.uploader = uploader