const path = require('path');
const fs = require('fs');
const rl = require('readline');

const app = express();

function readFile(){
  var fileStream = fs.createReadStream(path.join(__dirname+'/data/dictFinal_MESA.csv'))
  var lineReader = rl.createInterface({
    input: fileStream
  });

  var tree = []
  var level = [];

  lineReader.on('line', function (line) {
    var i = 1;
    if(!level[i]){
      level[i] = [];
    }
    var path = line.split(",")[0];
    var node = {};
    var text =path.split("\\")[i];
    node.text = text;
    if(!level[i].includes(text) && node.text){
      level[i].push(text);
      tree.push(node)
    }
  })
    .on('close', function(){
      lineReader.close();
      console.log(tree);
  });
}
