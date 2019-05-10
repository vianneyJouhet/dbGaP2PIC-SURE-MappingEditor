function updateDbGap(studyId,type,objectId,typeFolder){
  console.log(studyId,type,objectId,typeFolder);
  var uriDgbap = "https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/GetFolderView.cgi?current_study_id="+studyId+"&current_type="+type+"&current_object_id="+objectId+"&current_folder_type="+typeFolder+";"
  console.log(uriDgbap);
  $.ajax({
    url: uriDgbap,
    type: 'GET',
  }).done(function(data){
    // console.log(data);
    $('#dbgap').empty();
    $('#dbgap').append(data);
    $('#dbgap').find("div > ul ").each(function (index){
      console.log(index);
      if (index == 0) {
        $(this).attr("id","hierarchie")
      }else{
        $(this).attr("id","details")
      }
    })
    $('.studyNode').each(function(index){
     var label = $(this).text().replace(";", ".").replace(",", " ").replace("\"", "").replace(/[\n\r]/g, " ");
     $(this).attr("onClick",$(this).attr("onClick").replace("updateAssociatedBox","updateDbGap"));
     $(this).append('\t\t<a href=# onClick = \'createFolder(event,"'+label+'")\'" title ="Add vars to class"><img src="https://img.icons8.com/metro/15/000000/add-folder.png"></a> \t \t');
    });

    var groupNodes = $('.groupNode');
    groupNodes.each(function (index) {
      var label = $(this).text().replace(";", ".").replace(",", " ").replace("\"", "").replace(/[\n\r]/g, " ");
      $(this).attr("onClick",$(this).attr("onClick").replace("updateAssociatedBox","updateDbGap").replace(/setState\([^\)]*\)\;/,""));
      $(this).append('\t\t<a href=# onClick = \'createFolder(event,"'+label+'")\'" title ="Add vars to class"><img src="https://img.icons8.com/metro/15/000000/add-folder.png"></a> \t \t');
    });
   var groupNodesH = $('#hierarchie').find('.groupNode');
   groupNodesH.each(function (index) {
     console.log($(this).text())
     var label = $(this).text().replace(";", ".").replace(",", " ").replace("\"", "").replace(/[\n\r]/g, " ");
     if ($(this)[0] == groupNodesH.last()[0]){
       $(this).append('\t\t<a href=# onClick = \'feedVars(event,"'+label+'")\'" title ="Add vars to class"><img src="https://img.icons8.com/metro/10/000000/nui2.png"></a> \t \t');
     }
   });
 })
}

function feedVars(event,label){

  event.preventDefault();
  var text="";
  $('#details').children().each(function(index){
    text+=$(this).text()+"\n";
    console.log($(this).text());
  })
  var value = $('#autoNumber').val();
  if(value){
    var index = parseInt(value);
    var indexAfter = index + 1;
    if (index < 10){
      value = "0"+index;
    }else{
      value = index;
    }
  }
  label = value + " - " + label;
  if ($('#addMethods').find(".active")[0].id == "dbgapAdd"){
    $("#fatherLab").val(label);
    $("#listeVar").val(text);
    $("#autoNumber").val(indexAfter);
  }
}
