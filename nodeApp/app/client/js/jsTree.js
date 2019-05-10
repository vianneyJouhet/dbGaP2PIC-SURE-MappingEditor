$(document)
.on('dnd_stop.vakata', function (e, data) {
if ($('#addMethods').find(".active")[0].id == "manualAdd"){
 var t = $(data.event.target);
 if(t.is("#targetClass")){
   console.log("drop on targetClass");
   var prev = $("#targetClass").val();
   var keys = [];
   var lines = prev.split("\n")
   for ( i in lines){
     keys.push(lines[i].split(" - ")[0]);
   }
   console.log(keys);
   if (!keys.includes(data.element.id)){
     $("#targetClass").val(prev + data.element.id + " - " + data.element.innerText + "\n");
   }

 }
}
});

$(function(){
  $('#tree').jstree({
    'core' : {
      "check_callback" : true,
      'data' : [{"text" : "Select a file"
      }],
    },
    "plugins" : ["contextmenu","dnd","sort","search"],
  });
})

$('#readFiles').click(function() {
  var mappingFile = $('#mappingFile').val();
  console.log(mappingFile);
  if (mappingFile!=""){
    var modifFile = $('#modifFile').val();
    var uri = encodeURI(url);
    var url = "http://localhost:3000/tree?mapping="+mappingFile+"&modif="+modifFile;
    $('#tree').jstree('destroy');
    $('#tree').jstree({
      'core' : {
        "check_callback" : true,
        'data' : {
          'url' : uri,
           "dataType" : "json"
        },
      },
      "plugins" : ["contextmenu","dnd","sort","search"],
    });
  }else{
    console.log("Pas de fichier")
  }
});

$('#addFils').click(function () {
 console.log($('#tree').jstree("get_selected",true)[0].text);
 var instance = $('#tree').jstree(true);
 var selected = instance.get_selected()[0];
 var childs = instance.get_node(selected).children;
 var strSearch = $('#listeVar').val().split('\n')
 var nodeName = $('#fatherLab').val()

 console.log(strSearch);
 var newNode = instance.create_node(selected,nodeName);
 for( j in strSearch){
   for (i in childs){
     // console.log(instance.get_node(childs[i]).text +" - " + strSearch[j].trim());
     // console.log(instance.get_node(childs[i]).text == strSearch[j].trim());
     // console.log(instance.get_node(childs[i]).text === strSearch[j].trim());
     // if (instance.get_node(childs[i]).text.endsWith('('+strSearch[j].trim()+')') || instance.get_node(childs[i]).text.trim() == strSearch[j].trim()){
     if(instance.get_node(childs[i]).data){
       if (instance.get_node(childs[i]).data.varName.trim() == strSearch[j].trim()){
           // console.log(instance.get_node(childs[i]));
           // console.log(instance.get_node('j1_1'));
           instance.move_node(instance.get_node(childs[i]),newNode)
       }
     }

   }
   $('#listeVar').val("") ;
   $('#fatherLab').val("");
   $('#listeVar').text("") ;
   $('#fatherLab').text("");
 }
});


function customMenu(node){
  var items = $.jstree.defaults.contextmenu.items();
  items.order = {
       "label" : "Extract order",
       "action" : function (obj) {
         $('#orderModal').modal('toggle');
         $("#executeOrdering").addClass('invisible');
         $('#orderTargetClass').val(node.id);
         $('#orderTargetLabel').val(node.text);
         $('#regex').val("^(.*\\[[^0-9]*)([0-9]+)([^0-9]*\\].*)$");
         $('#regexResult').val("");
         $('#simpleOrderResult').val("");
       }
 }
  items.detail = {
   "label" : "Show data",
   "action" : function (obj) {
       $('#dataModal').modal('toggle');
       $('#detailNodeIdentifier').val(node.data.varIdentifier);
       $('#detailNodeLabel').val(node.text);
       $('#detailNodeVarName').val(node.data.varName);
   }
 }
 console.log(items)
 return items;
}

function readProject(project,version){
  console.log("read");
  var url = "http://localhost:3000/project?project="+project+"&version="+version;
  var uri = encodeURI(url);
  $('#tree').jstree('destroy');
  $.ajax({
    url: uri,
    type: 'GET',
  }).done(function(data){
    console.log($.jstree.defaults.contextmenu);
    $('#projectLabel').val(data.project);
    $('#projectVersion').val(data.version);
    $('#projectVersion').data("lastVersion",data.lastVersion);
    console.log(data.tree);
    $('#tree').jstree({
        'core' : {
          "check_callback" : true,
          'data' : data.tree
         },
        "plugins" : ["contextmenu","dnd","sort","search"],
        "contextmenu": { "items": customMenu }
   });
   var tree = $('#tree').jstree(true);


   // $('#tree').jstree.defaults.contextmenu.items.custom_entry = {
   //   label : "test"
   // };

   if(data.version==-1){
     $("#build").addClass('invisible');
     $("#save").addClass('invisible');
   }else{
     $("#build").removeClass('invisible');
     $("#save").removeClass('invisible');
     $('#studyId').text(data.studyId + " - " + data.studyId.split(".")[0].replace(/phs[^1-9]*/,""));
     updateDbGap(data.studyId,"0",data.studyId.split(".")[0].replace(/phs[^1-9]*/,""),"102");
   }
  })
}

function createFolder(event, label){
  event.preventDefault();
  var value = $('#autoNumber').val();
  if(value){
    var index = parseInt(value);
    var indexAfter = index + 1;
    console.log("Hey " + value + index);
    if (index < 10){
      value = "0"+index;
    }else{
      value = index;
    }
  }
  label = value + " - " + label;
  $("#fatherLab").val(label);
  $("#listeVar").val();
  $("#autoNumber").val(indexAfter);
}
