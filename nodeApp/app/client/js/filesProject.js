$('#save').click(function(){
  var json = $('#tree').jstree(true).get_json();
  // var modifFile = $('#SaveModifFile').val();
  var project = $('#projectLabel').val();
  // var version = $('#projectVersion').val();
  var data = {};
  data.json = json;
  data.project = project;
  // data.version = version;
  // data.modifFile = modifFile;
  $.ajax({
    url: "http://localhost:3000/save",
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(data)
  }).done(function(){
    readProject(project);
  });

  // var modif = buildPathFromJsTree(json);
  // var blob = new Blob([JSON.stringify(modif)], {type: "text/plain;charset=utf-8"});

  // saveAs(blob, "modif.json");
})

$('#build').click(function(){
  var json = $('#tree').jstree(true).get_json();
  // var modif = buildPathFromJsTree(json);
  // var blob = new Blob([JSON.stringify(modif)], {type: "text/plain;charset=utf-8"});
  var project =  $('#projectLabel').val();
  var version = $('#projectVersion').val();
  console.log(project + " - " + version);
  var url = "http://localhost:3000/build?project="+project+"&version="+version;
  console.log(url);
  var uri = encodeURI(url);
  $.ajax({
    url: uri,
    type: 'GET',
  }).done(function(data){
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "built-mapping.csv");
  });
    // saveAs(blob, "modif.json");
})

var to = false;
$('#search').keydown(function (e) {
  if (e.keyCode == 13){
    if ($('#search').val().length > 2){
      var v = $('#search').val();
      $('#tree').jstree(true).search(v);
    }
  }
});

$("#listProjects").on('click',"a",function(event){
  event.preventDefault();
  var project = event.currentTarget.id;
  console.log(project);
  readProject(project,-1);
});


$('#previous').click(function(){
  var project =  $('#projectLabel').val();
  var version = $('#projectVersion').val();
  if (version>0){
    version = version -1;
  }
  $('#projectVersion').val(version);
  console.log($('#projectVersion').data("lastVersion"));
})
$('#next').click(function(){
  var project =  $('#projectLabel').val();
  var version = parseInt($('#projectVersion').val());
  if (version<$('#projectVersion').data("lastVersion")){
    version = version + 1;
  }
  $('#projectVersion').val(version);
})
$('#show').click(function(){
   var project =  $('#projectLabel').val();
   var version = parseInt($('#projectVersion').val());
  readProject(project,version);
})
