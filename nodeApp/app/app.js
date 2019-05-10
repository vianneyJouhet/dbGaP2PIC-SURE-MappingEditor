// app.js
const express = require("express");
const path = require('path');
const fs = require('fs');
const rl = require('readline');
const pathBuilder = require('./server/scripts/pathBuilder');
// const treeBuilder = require('./server/scripts/treeBuilder');
const app = express();
const bodyParser = require('body-parser');

// Tell the bodyparser middleware to accept more data

app.use(express.static('client/js'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get("/", (req, res) => res.sendFile(path.join(__dirname+"/client/index.html")));

function addChildrens(currentNode){
    var children = [];
    // console.log(currentNode);
    for(i in nodes[currentNode].children){
        var nodeLocal ={};
        nodeLocal.text = nodes[nodes[currentNode].children[i]].text;
        nodeLocal.data = {};
        nodeLocal.data.varName = nodeLocal.text;
        if ( nodes[nodes[currentNode].children[i]].initialPath){
          nodeLocal.data.initialPath =  nodes[nodes[currentNode].children[i]].initialPath;
          nodeLocal.data.varIdentifier =  nodes[nodes[currentNode].children[i]].varIdentifier;
          nodeLocal.data.varName =  nodes[nodes[currentNode].children[i]].varName;
        }
        nodeLocal.children = addChildrens(nodes[currentNode].children[i]);
        if (nodeLocal.children.length == 0){
            nodeLocal.data.path = nodes[currentNode].children[i];
            nodeLocal.data.varIdentifier =  nodes[nodes[currentNode].children[i]].varIdentifier;
            nodeLocal.data.varName =  nodes[nodes[currentNode].children[i]].varName;
            // nodeLocal.text = nodeLocal.text + "("+nodes[nodes[currentNode].children[i]].variable+")";
        }
        children.push(nodeLocal);
        // console.log(nodes[currentNode].children[i]);
    }
    return children;
}

app.put('/save',function(req,res){
  console.log(`Building json file`);
  // console.log(req.body);
  var project = req.body.project;
  var filePath = path.join(__dirname+'/data/'+project+'/');
  // var version = parseInt(req.body.version);
  var fileVersion = filePath+'.version';
  var versionFile = JSON.parse(fs.readFileSync(fileVersion));
  var version = versionFile.version;
  version = version + 1;

  console.log(filePath);
  var fileVersion = filePath + ".version";
  console.log(fileVersion);
  var fileName = filePath + version +'-modif.json';
  console.log(fileName);
  var modif = pathBuilder.buildPathFromJsTree(req.body.json);
  var blob = JSON.stringify(modif);
  fs.writeFileSync(fileName,blob,(err) =>{
     if (err) throw err;
  });
  fs.writeFileSync(fileVersion,'{"version":'+version+',"project":"'+project+'"}',(err) =>{
     if (err) throw err;
  });
  console.log(`Done`);
  res.send("ok");
})

app.get('/build',function(req,res){

  var project =req.query.project;
  var version =req.query.version;
  var filePath = path.join(__dirname+'/data/'+project+'/');
  var fileMappingPath =filePath + 'mapping.csv';
  if (fs.existsSync(fileMappingPath)) {
    var fileStream = fs.createReadStream(fileMappingPath)
    var modifPath = filePath + version +'-modif.json';

    console.log(modifPath);

    var pathModifs = [];

    var tree = []
    var level = [];
    nodes = [];
    var rootNode = [];

    if (fs.existsSync(modifPath)) {
        var modifs = JSON.parse(fs.readFileSync(modifPath))
        for( i in modifs){
          // console.log(modifs[i].before);
          pathModifs[modifs[i].varIdentifier] = modifs[i].after;
        }
        // console.log(pathModifs);
    }
    var lineReader = rl.createInterface({
      input: fileStream
    });
    var n = 0;
    var fileDef;
    lineReader.on('line', function (line) {
      var newLine = line;
      if (n> 0){
        // console.log(pathModifs[line.split(',')[5].replace(/\"/g,'')]);
         if (pathModifs[line.split(',')[5].replace(/\"/g,'')]){
           newLine = newLine.replace(line.split(',')[1].replace(/\"/g,''),pathModifs[line.split(',')[5].replace(/\"/g,'')]);
         }
         fileDef += "\n" + newLine.replace(/,[^,]*$/,"");
         // console.log(newLine);
        }else{
          // console.log(newLine);
          fileDef = newLine.replace(/,[^,]*$/,"");
        }
        n++
    })
    .on('close', function(){
      res.send(fileDef);
    });
  }
});


app.get('/projects',function(req,res){
  fs.readdir(path.join(__dirname+'/data/'), function(err, items) {
    console.log(items);
    var projects = [];
    for (var i=0; i<items.length; i++) {
        var file = path.join(__dirname+'/data/'+items[i]);
        if (fs.statSync(file).isDirectory()){
          projects.push(items[i]);
        }
    }
    res.send(projects)
  });
});

app.get('/project',function(req,res){
    var project = req.query.project;
    var v = req.query.version;
    var dir = path.join(__dirname+'/data/'+project+'/');
    var version ={};
    console.log(project);
    var fileMappingPath =dir+'dictionnary.csv';

    if (fs.existsSync(fileMappingPath)) {
      var fileVersion = dir+'.version';

      if (!fs.existsSync(fileVersion)) {
        fs.writeFileSync(fileVersion,'{"version":0,"project":"'+project+'"}',(err) =>{
          if (err) throw err;
        });
      }
      version = JSON.parse(fs.readFileSync(fileVersion));
      console.log(version);
      console.log(version.version);
      console.log(version.project);
      var lastVersion=version.version;
      console.log("lastVersion ==>" + lastVersion);
      if(v != -1 && v <version.version){
        version.version =v;
      }

      if (version.version > 0){
        var modifPath = path.join(__dirname+'/data/'+project+'/'+version.version+'-modif.json');
      }
      var fileStream = fs.createReadStream(fileMappingPath);

      console.log(modifPath);

      var pathModifs = [];

      var tree = []
      var level = [];
      nodes = [];
      var rootNode = [];
      var studyIdentifier = "test";
      if (fs.existsSync(modifPath)) {
          var modifs = JSON.parse(fs.readFileSync(modifPath))
          for( i in modifs){
            // console.log(modifs[i].before);
            if (modifs[i].before != modifs[i].after){
              pathModifs[modifs[i].varIdentifier] = modifs[i].after;
            }
          }
          // console.log(pathModifs);
      }
      var lineReader = rl.createInterface({
        input: fileStream
      });

      var n = 0;
      lineReader.on('line', function (line) {
        n ++;
        var path = line.split(';')[1].replace(/\"/g,'');
        var varIdentifier = line.split(";")[0].replace(/\"/g,'');
        var varName = line.split(";")[7].replace(/\"/g,'');
        studyIdentifier = line.split(";")[4].replace(/\"/g,'') + ".p" + line.split(';')[13].replace(/\"/g,'');

        // console.log(varIdentifier);

        // console.log(path);
        var initialPath = path

        if (pathModifs[varIdentifier]){
          // if(! pathModifs[path].includes("MESA_Exam1Main")){
          // console.log("Match ==> " + path +" " +pathModifs[path] );
          path = pathModifs[varIdentifier];
          // }
        }
        // console.log(path);
        // var variable = line.split(",")[6];
        var splitPaths = path.split("\\");
        var curentPath = "\\";


        for(i in splitPaths){
          if (i> 0 && splitPaths[i] != "" ){
            var text =splitPaths[i];
            var priorPath = curentPath;
            curentPath += text+"\\";
            if (i == 1 && !rootNode.includes(curentPath)){
              rootNode.push(curentPath);
            }
            if(!nodes[curentPath]){
                var node ={};
                node.text = text;
                node.children = [];
                node.varIdentifier = varIdentifier;
                node.varName = varName;
                if(curentPath == path){
                  node.initialPath = initialPath;
                  // console.log("intitial path " + initialPath);
                }
                // node.variable = variable
                nodes[curentPath] = node;
            }
            if(nodes[priorPath]){
              if(!nodes[priorPath].children.includes(curentPath)){
                nodes[priorPath].children.push(curentPath);
              }
            }
          }
        }
      }).on('close', function(){
          lineReader.close();
          // console.log(tree);
          // console.log(nodes);
          for (i in rootNode){
              var node ={};
              node.text = nodes[rootNode[i]].text;
              // node.data.initialPath = nodes[rootNode[i]].initialPath;
              // console.log(nodes[rootNode[i]]);
              node.data = {};
              node.data.varName=node.text;
              if (nodes[rootNode[i]].initialPath){
                node.data.initialPath = nodes[rootNode[i]].initialPath;
                node.data.path = rootNode[i];
              }
              node.children = addChildrens(rootNode[i]);
              tree.push(node);
          }


          // console.log(tree[0].children);
          version.tree =[];
          version.tree = tree;
          version.studyId = studyIdentifier;
          version.lastVersion = lastVersion;
          console.log("lastVersion ==>" + lastVersion);
          res.send(version);
      });
    }else{
      version = {};
      version.project = project;
      version.version = -1;
      version.tree = [{text:"Pas de mapping"}];
      version.studyId = "";
      version.lastVersion = lastVersion;
      res.send(version);
    }
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000!`);
});
