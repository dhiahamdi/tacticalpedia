var fs = require("fs");
function cleanFile(path){
    var text = fs.readFileSync(path, 'utf8');
    var textByLine = text.split("\n")
    var result = []
    textByLine.forEach(line => {
        if(!(line.includes("_id") || line.includes("ISODate") || line.includes("NumberInt"))){
            result.push(line)
        }
    })
    return result;
}


const path = "C:\\Users\\LENOUUUUUUVO\\Desktop\\users.txt"
const data = cleanFile(path).join('\n')
fs.writeFileSync("C:\\Users\\LENOUUUUUUVO\\Desktop\\users-clean.txt", data);