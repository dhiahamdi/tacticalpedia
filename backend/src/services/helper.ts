const path = require('path');
const fs = require('fs');


export default class HelperService {

    public static getAssetPath(filePath: string) {
        return path.dirname(require.main.filename) + '/assets/' + filePath;
    }
}