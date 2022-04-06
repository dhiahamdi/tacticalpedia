/*
MULTER
*/
var multer  = require('multer');

const path = require('path');

const fs = require('fs');


export default class FileManagerService{

    private storage;
    public upload;

    constructor(type: string) {
        

        this.storage = multer.diskStorage({

            destination: function (req, file, cb) {
                cb(null, path.dirname(require.main.filename) + '/uploads/'+type);
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
            });
        
        this.upload = multer({ storage: this.storage });

    }


    public static async removeFiles(filePaths: string[]): Promise<void>{


        for(let fpath of filePaths){

            // delete a file
            fs.unlink(fpath, (err) => {
                if (err) {
                    throw err;
                }
            });
        }
    }


    public static async getFileExtension(filename): Promise<string>{

        return path.extname(filename);
    }

}