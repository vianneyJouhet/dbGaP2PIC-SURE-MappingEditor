exports.buildPathFromJsTree = function (json){
  var paths = [];
  for(i in json){
    var path = "\\" +json[i].text.trim() +"\\";
    if(json[i].data.initialPath){
      var pathAdd = {};
      pathAdd.before = json[i].data.initialPath;
      pathAdd.after = path;
      pathAdd.varIdentifier = json[i].data.varIdentifier;
      if (pathAdd.before != pathAdd.after){
        paths.push(pathAdd);
      }
    }
    if (json[i].children.length > 0 ){
        addChildrens(path,json[i].children,paths)
    }
  }
  // console.log(paths);
  return paths;
}

function addChildrens(pathBefore,childrens,paths){
  for(i in childrens){
    var pahtAfter = pathBefore  + childrens[i].text.trim() + "\\"
    if(childrens[i].data.initialPath){
      var pathAdd = {};
      pathAdd.before = childrens[i].data.initialPath;
      pathAdd.after = pahtAfter;
      pathAdd.varIdentifier = childrens[i].data.varIdentifier;
      if (pathAdd.before != pathAdd.after){
        paths.push(pathAdd);
      }
    }
    if (childrens[i].children.length > 0 ){
        addChildrens(pahtAfter,childrens[i].children,paths)
    }
  }
}
