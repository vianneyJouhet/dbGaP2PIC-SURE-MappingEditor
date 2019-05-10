$('#executeOrdering').click(function(e,data){
  var instance = $('#tree').jstree(true);
  var selected = instance.get_selected()[0];
  var childs = instance.get_node($('#orderTargetClass').val()).children;
  var changes = $('#regexResult').data("changes");
  console.log(changes);
  for(i in changes){
    str = changes[i].targetOrder;
    instance.get_node(changes[i].id).text = str + " - " + instance.get_node(changes[i].id).text;
  }
  instance.redraw(true);
  instance.sort(instance.get_node($('#orderTargetClass').val()), true);
  $('#orderModal').modal('toggle');
  $("#executeOrdering").addClass('invisible');
// }
})


$('#previewOrdering').click(function(e,data){
    var instance = $('#tree').jstree(true);
    var selected = instance.get_selected()[0];
    var childs = instance.get_node($('#orderTargetClass').val()).children;
    var changes = [];
    // console.log(childs);
    if ($('#orderingMethods').find(".active")[0].id == "regexOrder"){

      var regex = $('#regex').val();
      // console.log(regex);
      var rx = new RegExp(regex,"");
      maxLength = 0;
      for (i in childs){
        var res = instance.get_node(childs[i]).text.match(rx);
        var extract = "-1";
        if (res != null){
          // console.log(res);
          extract = res[2];
          if (extract.length > maxLength) {
            maxLength = extract.length;
          }
        }
        change = {
          id : childs[i],
          extract: extract,
          targetSort: instance.get_node(childs[i]).text
        }
        changes.push(change);
        // if (i > 15){
        //   break;
        // }
      }
      console.log(maxLength);
      console.log(changes);

      for(i in changes){
        var change = changes[i];
        var extract =change.extract;
        if (change.extract != "-1"){
          if (change.extract.length < maxLength) {
            var j = 0
            while (j < (maxLength - change.extract.length)){
              extract = "0"+extract;
              j++
            };
          }
        }
        changes[i].targetSort = changes[i].targetSort.replace(rx,"$1"+extract+"$3")
        // instance.get_node(change.id).text =
        // instance.redraw(true)
      }
    }else{
      for (i in childs){
        var change = {
          id : childs[i],
          extract: "",
          targetSort: instance.get_node(childs[i]).data.varIdentifier
        }
        changes.push(change)
      }
    }
    changes.sort(compareTarget);
    console.log(changes)
    var changeLength = changes.length.toString().length
    var preview = ""
    for(i in changes){
      var n = parseInt(i) + 1;
      var str = n.toString();

      // console.log("i ==> " + i + " str " + str)  ;
      var j = 0
      // console.log(changeLength + " - " + str.length);
      // console.log(changeLength - str.length)
      var lenStr = str.length
      while (j < changeLength - lenStr){
        str = "0"+str;
        // console.log(j);
        // console.log(j < changeLength - str.length);
        j++
      };
      // if (i<2){
        // console.log(str);
      // }
      changes[i].targetOrder = str;
      if (i<15){
        preview += str + " - " + instance.get_node(changes[i].id).text + "\n";
      }
    }

    //   preview += instance.get_node(change.id).text.replace(rx,"$1"+extract+"$3") +"\n";

    $('#regexResult').val(preview);
    $('#simpleOrderResult').val(preview);
    $('#regexResult').data("changes",changes);
    $('#simpleOrderResult').data("changes",changes);
    $("#executeOrdering").removeClass('invisible');
})

function compareTarget(a, b){
  if (a.targetSort > b.targetSort) return 1;
  if (b.targetSort < a.targetSort) return -1;

  return 0;
}
