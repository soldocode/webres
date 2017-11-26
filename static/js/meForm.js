// meForm - JavaScript Module     //
// Riccardo Soldini  2015-2017    //
// 							      //


var meForm={LastUpdate:'06-11-2017'};
meForm.Widget={}

function appendTag(name,tag)
{
 var ll=name.slice(-1)
 if (ll==']'){var result=name.slice(0,-1)+"_"+tag+"]"}
 else{var result=name+"_"+tag}
 return result
}

meForm.hiddenField = function(vars,values='{}')
{
    var vars = vars || {};
    var label = vars.label || '';
    var name = vars.name || '';
    var width = vars.width || 'auto';
    var args = vars.args || {};
    var form_name='"'+name+':string" '
    var row='<tr hidden id='+form_name
    for (arg in args) {row+=' '+arg+'="'+args[arg]+'"'}
    row+='>'+
         '<th colspan="2" id='+form_name+'>'+label+'</th>'+
         '<td>'+
         '<input class="value"'+
         'name='+form_name+
         ' id='+form_name+' value='+values+
         ' type="string" '+
         ' style="width:'+width+'%" >'+
         '</input></td></tr>';
    return row
}

meForm.writeString=function(vars)
// vars.label
// vars.text
// vars.width
// vars.name
{
    var form_name='"'+name+':string" '
    row='<tr id='+form_name+'>'+
         '<th colspan="2" id='+form_name+'>'+vars.label+'</th>'+
         '<td name='+form_name+'id='+form_name+
         ' style="width:'+vars.width+'%" >'+vars.text+'</td></tr>';
    return row
}

meForm.editList = function(vars,v=-1)
  {
    var vars = vars || {};
    var label = vars.label || '';
    var value = String(v);
    var name = vars.name || '';
    var options = vars.values || {};
    var size = vars.size || 'auto';
    var args = vars.args || {};
    var type = vars.type || 'number'

    var form_name='"'+name+':'+type+'" '
    var row='<tr id='+form_name+'>'+
            '<th colspan="2" id='+form_name+'>'+label+'</th>'+
            '<td>'+
            '<select name='+form_name+' ';
    for  (arg in args)
    {
        row +=arg+"='"+args[arg]+"'";
    }
    row += ' >';
    for  (index in options)
     {
         row +='<option '
         if (options[index].value==value){row += ' selected '}
         row +='value='+options[index].value+'>'+options[index].text+'</option>'

     }
    row +='</select></td></tr>';
    return row
  }


meForm.editSwitchFields = function(vars,value) //crea selezione da un elenco che cambia i campi visualizzati//
 {
  var args = vars.args || {};
  var switch_function='meForm.switchFields("'+vars.name+'",'+JSON.stringify(vars.switch)+')';
  args.onchange=switch_function;
  vars.args=args;
  return meForm.editList(vars,value)
 }


meForm.switchFields = function(name,vars) //visualizzazione dinamica dei campi//
 {
  var value= $("select[name='"+name+":number']").val();
  var switch_on =vars[value].on;
  var switch_off= vars[value].off;
  for (index in switch_off)
   {
    $('tr[id="'+switch_off[index]+':number"]').fadeOut();
   }
  for (index in switch_on)
   {
    $('tr[id="'+switch_on[index]+':number"]').fadeIn();
   }
  update_shape();
 }

//meForm.editNumber
//make number field
meForm.editNumber = function(vars,value=0)
  {
    var vars = vars || {};
    var label = vars.label || '';
    var name = vars.name || '';
    var width = vars.width || 'auto';
    var onchange = vars.onchange || ''
    var args = vars.args || {};
    var style = args.style || '';
    var form_name='"'+name+':number" '
    var row='<tr id='+form_name
    for (arg in args) {row+=' '+arg+'="'+args[arg]+'"'}
    row+='>'+
         '<th colspan="2" id='+form_name+'>'+label+'</th>'+
         '<td>'+
         '<input class="number value"'+
         'name='+form_name+
         ' id='+form_name+' value='+value+
         ' type="number" '+
         ' style="width:'+width+'%" >'+
         '</input></td></tr>';

    return row
  }


//meForm.editString
//make string field
meForm.editString = function(vars,value='')
  {
    var vars = vars || {};
    var label = vars.label || '';
    var name = vars.name || '';
    var width = vars.width || 'auto';
    var onchange = vars.onchange || ''
    var args = vars.args || {};
    var style = args.style || '';
    var form_name='"'+name+':string" '
    var row='<tr id='+form_name
    for (arg in args) {row+=' '+arg+'="'+args[arg]+'"'}
    row+='>'+
         '<th colspan="2" id='+form_name+'>'+label+'</th>'+
         '<td>'+
         '<input class="number value"'+
         'name='+form_name+
         ' id='+form_name+' value="'+value+
         '" type="string" '+
         ' style="width:'+width+'%" >'+
         '</input></td></tr>';

    return row
  }


meForm.selectJsonList = function(vars,value=-1)
{
    var vars = vars || {};
    var label = vars.label || '';
    var value = String(value);
    var name = vars.name || '';
    var options = vars.values || {};
    var size = vars.size || 'auto';
    var args = vars.args || {};

    var form_name='"'+name+':number" '
    var row='<tr id='+form_name+'>'+
            '<th colspan="2" id='+form_name+'>'+label+'</th>'+
            '<td>'+
            '<select name='+form_name+' ';
    for  (arg in args)
    {
        row +=arg+"='"+args[arg]+"'";
    }
    row += ' >';
    row +='</select></td></tr>';
    return row
}


meForm.getJson = function (obj,urlPath,jsonPath,destination,callback,cbParam)
{
    obj.DataLoading=true
    $.ajax(
    {
        url: urlPath,
        type: "POST",
        data: {'jsonPath':jsonPath},
        dataType: "json",
        success:function(result)
        {
            //console.log(result.source);
            destination=JSON.parse(result.source)
            console.log(obj)
            //obj.DataLoaded=true
            //callback(cbParam);
        },
        complete:function()
        {
           obj.DataLoaded=true
           callback(cbParam);
        }
    })
}


meForm.makeSubFormHeader = function(sfId,sfCount,sfLabel,sfCallBack)
{
    row='<tr id="header_'+sfId+sfCount+'"><th>'+sfLabel+' n° '+(parseInt(sfCount)+1).toString()+'</th>'
    row+="<th class='expand' status='on' id='"+sfId+sfCount+"'>"
    row+=this.makeIcon(
                        "glyphicon-collapse-up",
                        "meForm.expandSubForm('"+sfId+sfCount+"')",
                        "id='"+sfId+sfCount+"'"
                       )
    row+="<span>&nbsp</span>"
    row+=this.makeIcon(
                        "glyphicon-remove",
                        "meForm.deleteSubForm('"+sfId+sfCount+"',"+sfCallBack+")"
                      )
    row+="</th></tr>"
    return row
}


meForm.changeFields = function(vars)
{
}


meForm.makeSubForm = function (vars)// sub-form singolo - da sistemare!!!!!
{

  var SFid=vars.id;
  var rows='<tr id="header_'+vars.id+'"><th>'+vars.label+'</th>'
  rows +=  '<th class="expand" id="'+vars.id+'"'
  rows += ' onclick=meForm.expand("'+SFid+'")>-</th></tr>';
  rows=rows+"<tr id="+SFid
  if (vars.visible=="false"){rows += ' style="display: none;"'};
  rows+= "><td colspan=3><table class='makEasy' width='100%'>"+
           "<colgroup><col width='50%'><col width='5%'><col width='45%'></colgroup>"+
           "<tbody>";

  for (index in vars.form_data)
  {
    form_data=vars.form_data[index];
    switch(form_data.class)
    {
     case 'list':
       rows += this.editList(form_data);
       break;
     case 'number':
       rows += this.editNumber(form_data);
       break;
     case 'multiple-subform':
       rows += this.makeMSForm(form_data);
       break;
     case 'button':
       rows += '<tr><td><a class="button">'+form_data.label+'</a></td></tr>';
       break;
     default:
       rows += '';
    }
  }
  rows += '</body></table></td></tr>';

  return rows

}


meForm.addSForm = function(vars,values={}) //aggiunge un sub-form o maschera annidata//
{
    var count=$("input[name='id_"+vars.id+"']").val();
    count++;
    $("input[name='id_"+vars.id+"']").val(count);

    $('tr#'+vars.id).before(this.makeSubFormHeader(vars.id,count,vars.label,vars.after_deletion_callback));

    for(index in vars.form){values[vars.form[index].name]=vars.form[index].value}
    $('tr#'+vars.id).before(this.makeSubFormWidget(vars.id,count,vars.form,values));
    update_all();
}


meForm.makeFormWidget = function(fwData,fwValues)

{
    var row=''
    for (index in fwData)
    {
        var data=fwData[index];
        switch(data.class)
        {
            case 'list':
                row+=this.editList(data,fwValues[data.name]);
                break;
            case 'number':
                row+=this.editNumber(data,fwValues[data.name]);
                break;
            case 'multiple-subform':
                row+=this.makeMSForm(data,fwValues[data.name],fwValues[data.id]);
                break;
            case 'switch-fields':
                row+=this.editSwitchFields(data,fwValues[data.name]);
                break;
            case 'json-list':
                row+=this.selectJsonList(data,fwValues[data.name]);
        }
        if (this.Widget.hasOwnProperty(data.class))
        {   row+=this.Widget[data.class].makeEditField(data,fwValues[data.name])}

    }
    return row
}


meForm.makeSubFormWidget = function(sfId,sfCount,sfData,sfValues={}) //crea un sub-form o maschera annidata//
{

    var row="<tr id="+sfId+sfCount+"><td colspan=3><table class='makEasy' width='100%'>"+
              "<colgroup><col width='50%'><col width='5%'><col width='45%'></colgroup>"+
              "<tbody>";

    var indexedData=JSON.parse(JSON.stringify(sfData))
    for (rename in indexedData){indexedData[rename].name=sfId+'['+sfCount+']['+sfData[rename].name+']'}

    var indexedValues={}
    for (key in sfValues){indexedValues[sfId+'['+sfCount+']['+key+']']=sfValues[key]}

    row += this.makeFormWidget(indexedData,indexedValues);
    row += '</body></table></td></tr>';
    return row
}


// ----------- meForm.makeMSForm - widget for multiple subform ---------------
meForm.makeMSForm = function(vars,msName,msValues)
{
    var vars = vars || {};
    var row_id = vars.id || '';
    var args = vars.add_button.args || {};
    var row=''
    var countForm="-1"
    var count=0


    if (msValues)
    {
        for (fIndex in msValues)
        {
            if (msValues[fIndex])
            {
                var sfId='"'+vars.id+count+'"'
                var sfForm=JSON.parse(JSON.stringify(vars.form));
                row+='<tr id="header_'+vars.id+count+'"><th>'+vars.label+' n° '+(parseInt(count)+1).toString()+'</th>'
                row+="<th class='expand' status='on' id='"+vars.id+count+"'>"
                row+=this.makeIcon(
                                    "glyphicon-collapse-up",
                                    "meForm.expandSubForm("+sfId+")",
                                    "id='"+vars.id+count+"'"
                                   )
                row+="<span>&nbsp</span>"
                row+=this.makeIcon(
                                    "glyphicon-remove",
                                    "meForm.deleteSubForm("+sfId+","+vars.after_deletion_callback+")"
                                  )

                row+="</th></tr>"
                row+=this.makeSubFormWidget(vars.id,count,vars.form,msValues[fIndex]);
                count=count+1;
            }
        }
        countForm=(count-1).toString()
    }
    row+='<tr id='+row_id+'>'+
          '<td colspan="2" style="padding-top:10px;" >'+
          '<a class="button"'
    for  (arg in args)
    {
        row +=arg+'="'+args[arg]+'"';
    }
    row += "onclick='meForm.addSForm("+JSON.stringify(vars)+")'"
    row += ' >';
    row += vars.add_button.label+'</a><input name="id_'+vars.id+'" type="hidden" value='+countForm+'></td></tr>';
    return row
}


meForm.expandSubForm = function(sform) //espande e contrae un form multiplo //
{
    var tag='[id="'+sform+'"]'
    if ($('th'+tag).attr('status')=='on')
    {
     $('tr'+tag).fadeOut();
     $('th'+tag).attr('status','off');
     $('span'+tag).attr('class','glyphicon glyphicon-collapse-down');
    }
    else
    {
     $('tr'+tag).fadeIn();
     $('th'+tag).attr('status','on');
     $('span'+tag).attr('class','glyphicon glyphicon-collapse-up');
    }
}


meForm.deleteSubForm = function(sForm,afterDel) //elimina un form multiplo //
{
    $('tr[id="'+sForm+'"]').fadeOut();
    $('tr[id="'+sForm+'"]').remove();
    $('tr[id="header_'+sForm+'"]').fadeOut();
    $('tr[id="header_'+sForm+'"]').remove();
    afterDel();
}


meForm.deployForm= function (id,title,form,data)
{
    $("h2#title").text(title);
    $("table#"+id+" tbody").html('<tr>');
    $('#'+id+' tr:last').before(meForm.makeFormWidget(form,data))
    $('#'+id).on("change",function(){update_all()})
    this.afterDeployForm()
}


meForm.afterDeployForm= function()
{

}


meForm.makeIcon = function (ibName,iOnClick,iArgs)
{
    row="<span class='glyphicon "+ibName+"' "+iArgs+" style='display:inline;' onclick="+iOnClick+"></span>"
    return row
}


meForm.makeTableFields_deprecated = function(vars) //crea subform a tabella ???? usato da qualche parte? bo?
{
  var vars = vars || {};
  var TFid = vars.id || '';
  var buttons = vars.buttons || [];


  var row='<tr id="header_'+vars.id+'"><th>'+vars.label+'</th>'
  row +=  "<th class='expand' id='"+vars.id+"' onclick=meForm.expand('"+vars.id+"')>";
  if (vars.visible=="false")
     {
         row +="+</th></tr><tr id="+vars.id +" style='display: none;'"
     }
  else
     {
         row +="-</th></tr><tr id="+vars.id;
     }

  row +="><td colspan=3><table class='makEasy' id='"+vars.id+"' width='100%'><colgroup>"

  for (w in vars.col_width) {row +='<col width="'+vars.col_width[w]+'%">'}
  row +="</colgroup><tbody><tr>";

  for (h in vars.col_header) {row +='<th>'+vars.col_header[h]+'</th>'}
  row += '</tr>'
  row += '</tbody></table>'
  row += '<div style="margin:10px;">'
  for (i in buttons)
  {
      if (buttons[i].class=="load")
      {
          var onclickcont='"$(&quot;#selectfiles'+i+'&quot;).trigger(&quot;click&quot;)"'
          row+='<a onclick='+onclickcont+
               ' id="'+vars.id+'_button_'+buttons[i].id+'"'+
               ' class="button">'+buttons[i].label+'</a>'
          row+='<input type="file" name="files[]" id="selectfiles'+i+'" style="display:none">'
          row+='<span> </span>'
      }
      else
      {
          row+='<a onclick='+buttons[i].onclick+
               ' id="'+vars.id+'_button_'+buttons[i].id+'"'+
               ' class="button">'+buttons[i].label
          row+='</a><span> </span>'
      }
  }
  row += '</div>';
  row += '</td></tr>';

  return row
}

// ----------- meForm.editCheckList - widget for editing checklist ---------------

meForm.editCheckList = function (vars)
// vars.label
// vars.rows=[{'id':1,'title':'ELEMENT1','selected':true},{'id':2,'title':'ELEMENT2','selected':false}]
// vars.width
// vars.name
{
    var name=vars.name
    var html="<tr id=header_"+vars.name+"><th colspan=2 id=header_"+vars.name+">"+vars.label+"</th></tr>"
    html+= "<tr><td colspan=3><table><tbody>"
    for (i in vars.rows)
    {
        check_name=name+"["+i+"]"
        vars.name=check_name
        html+= '<tr>'
        h_values={'selected':true}
        html+= this.hiddenField(vars,JSON.stringify(h_values))
        html+='<th>'
        html+= this.makeIcon("glyphicon-check",
                             "meForm.invertCheckSelection('"+vars.name+"')",
                             "id='"+vars.name+"'")
        html+= '</th><td>'
        html+= vars.rows[i].title
        html+= '</td></tr>'
    }
    html+= '</tbody></table></td></tr>';
    return html
}


meForm.invertCheckSelection= function(name)
{
    var selector="[name='"+name+":string']"
    var values=JSON.parse($("input"+selector).val())
    values.selected=!(values.selected)
    $("input"+selector).val(JSON.stringify(values))
    if (values.selected)
    {
        $("span.glyphicon[id='"+name+"'").replaceWith(this.makeIcon("glyphicon-check",
                             "meForm.invertCheckSelection('"+name+"')",
                             "id='"+name+"'"))
    }
    else
    {
        $("span.glyphicon[id='"+name+"'").replaceWith(this.makeIcon("glyphicon-unchecked",
                             "meForm.invertCheckSelection('"+name+"')",
                             "id='"+name+"'"))
    }
}


// ----------- meForm.deployTable - widget for table editing ---------------

meForm.deployTable = function (vars)
// vars.id --> id in form
// vars.buttons
// vars.rows
// vars.col_header --> columns header ['head1','head2','head3']
// vars.col_width --> columns widths in percent [10,20,40]
{

  var vars = vars || {};
  var tid = vars.id || '';
  var buttons = vars.buttons || [];
  var rows=vars.rows || [];


  var html="<table class='makEasy' id='"+vars.id+"' width='100%'><colgroup>"

  for (w in vars.col_width) {html +='<col width="'+vars.col_width[w]+'%">'}
  html +="</colgroup><tbody><tr>";

  for (h in vars.col_header) {html +='<th>'+vars.col_header[h]+'</th>'}

  html += '</tr>'
  var rowClass="sol"
  for (rIndex in rows)
  {
      html += '<tr class="'+rowClass+'">'
      var row=rows[rIndex]

      html += '<td>'
      html += '<a class="link" onclick="'+vars.edit_function+'('+rIndex+')" data-w2p_disable_with="default">'
      html += '<b>'+row[0]+'</b></a></td>'
      for (cIndex=1; cIndex<row.length; cIndex++)
      {
          html += '<td>'+row[cIndex]+'</td>'
      }
      html += '</tr>'
      if (rowClass=="sol"){rowClass="alt"}
      else{ rowClass="sol"};
  }

  html += '</tbody></table>'
  html += '<div style="margin:10px;">'
  for (i in buttons)
  {
      if (buttons[i].class=="load")
      {
          var onclickcont='"$(&quot;#selectfiles'+i+'&quot;).trigger(&quot;click&quot;)"'
          html+='<a onclick='+onclickcont+
               ' id="'+vars.id+'_button_'+buttons[i].id+'"'+
               ' class="button">'+buttons[i].label+'</a>'
          html+='<input type="file" name="files[]" id="selectfiles'+i+'" style="display:none">'
          html+='<span> </span>'
      }
      else
      {
          html+='<a onclick='+buttons[i].onclick+
               ' id="'+vars.id+'_button_'+buttons[i].id+'"'+
               ' class="button">'+buttons[i].label
          html+='</a><span> </span>'
      }
  }
  html += '</div>';
  $('#content').append(html);

  for (ib in buttons)
      {
        if (buttons[ib].class=="load")
        {
         ///da sistemare!!!!!!!!!!!!
         document.getElementById('selectfiles0').addEventListener('change',eval(buttons[ib].onclick), false);
        }
      }
}


meForm.editRowTable= function (vars)
{
  var vars = vars || {};
  var tid = vars.id || '';
  var buttons = vars.buttons || [];
  html='<tr class="sol">';
  for (h in vars.col_header) {html +='<td><input id="'+h+'" value="content"></td>'}
  html +='</tr>';
  $('table#'+tid).append(html);
}


meForm.TR_BUTTONS = function(trId,btns,colspan)
// btns:{"button1":{"title":"Button 1",
//                  "arg":"arg"},
//       "button2":{"title":"Button 2",
//                  "arg":"arg"}
//      }

{
	html='<tr class="buttons"><td colspan='+colspan+'>';
	for (btn in btns)
	{
		html+='<span>  </span>';
		html+='<a onclick="'+btn+'('+btns[btn].arg+')" id="btn_'+btn+'" class="button" >'+btns[btn].title+'</a>';
    }
    html+='</td></tr>';
    return html
}


meForm.addTableRowButton_deprecated = function(label,id,colspan)/// da eliminare!!!
{
    html='<tr><td colspan='+colspan+' style="border-top-width: 7px;border-bottom-width: 7px;">';
    html+='<a onclick="confirm_'+label+'()" id="'+label+'_button_ok" class="button" data-w2p_disable_with="default">Conferma</a>';
    html+='<span>  </span>';
    html+='<a onclick="delete'+label+'('+id+')" id="'+label+'_button_del" class="button" data-w2p_disable_with="default">Elimina</a>';
    html+='</td></tr>';
    return html
}


// ----------- meForm.SheetMaterial - widget for editing sheet material ---------------

meForm.SheetMaterial={MATERIALS:{},DataLoaded:false,DataLoading:false}

meForm.SheetMaterial.makeEditField=function(pars,vals)
{
    var row=meForm.hiddenField(pars,vals)
    var values=JSON.parse(vals)
    var f_mat_change="meForm.SheetMaterial.updateFields(&quot;"+pars.name+"&quot;)"
    var f_thk_change="meForm.SheetMaterial.updateValues(&quot;"+pars.name+"&quot;)"
    var mpars={
        "class": "list",
        "label": "materiale",
        "name": appendTag(pars.name,"mat"),
        "width": 50,
        "value": 1,
        "type":"string",
        "values":[],
        "args":{"onchange":f_mat_change}
        }
    row+=meForm.editList(mpars,values.material)
    var tpars={
        "class": "list",
        "label": "spessore",
        "value": 5,
        "width": 30,
        "values":[],
        "name": appendTag(pars.name,"thk"),
        "args": {}
        }
    row+=meForm.editList(tpars,values.thickness)
    if (!(meForm.SheetMaterial.DataLoaded))
    {
        if(!(meForm.SheetMaterial.DataLoading))
        {
            meForm.SheetMaterial.loadData("/makeasy/item/getJson",
                                          "Materials/material_quality.json",
                                          pars.name)
        }
    }
    return row
}

meForm.SheetMaterial.loadData= function(url,json_path,name)
{
    meForm.SheetMaterial.DataLoading=true
    $.ajax(
    {
        url: url,
        type: "POST",
        data: {'jsonPath':json_path},
        dataType: "json",
        success:function(result)
        {
            meForm.SheetMaterial.MATERIALS = JSON.parse(result.source)
            meForm.SheetMaterial.DataLoaded=true
            meForm.SheetMaterial.updateMaterialField(name)
        }
    })
}

meForm.SheetMaterial.updateValues=function (name)
{
    var name_hidden="input[name='"+name+":string']"
    var name_mat="select[name='"+appendTag(name,"mat")+":string']"
    var name_thk="select[name='"+appendTag(name,"thk")+":number']"
    var new_values={'material':$(name_mat).val(),'thickness':$(name_thk).val()}
    $(name_hidden).val(JSON.stringify(new_values));
}

meForm.SheetMaterial.updateMaterialField=function (name)
{
    var name_hidden="input[name='"+name+":string']"
    var mat=JSON.parse($(name_hidden).val()).material
    var name_mat="select[name='"+appendTag(name,"mat")+":string']"
    var html_options=" ";
    for (var key in meForm.SheetMaterial.MATERIALS)
    {
        html_options+="<OPTION value='"+key+"'>"+this.MATERIALS[key].name+"</OPTION>";
    }
    var html="<SELECT name='"+appendTag(name,"mat")+":string'"
    html +=" onchange=meForm.SheetMaterial.updateThicknessField('"+name+"') >"
    html +=html_options
    html +="</SELECT>"
    $(name_mat).replaceWith(html)
    $(name_mat).val(mat)
    meForm.SheetMaterial.updateThicknessField(name)
}

meForm.SheetMaterial.updateThicknessField=function (name)
{
    var name_hidden="input[name='"+name+":string']"
    var values=JSON.parse($(name_hidden).val())
    var name_mat="select[name='"+appendTag(name,"mat")+":string']"
    var mat=$(name_mat).val()
    var name_thk="select[name='"+appendTag(name,"thk")+":number']"
    var list=meForm.SheetMaterial.MATERIALS[mat].thickness
    var html_options=" ";
    for (var key in list)
    {
        html_options+="<OPTION value='"+key+"'>"+list[key].name+"</OPTION>";
    }
    var html="<SELECT name='"+appendTag(name,"thk")+":number'"
    html +=" onchange=meForm.SheetMaterial.updateValues('"+name+"') >"
    html+=html_options
    html +="</SELECT>"
    $(name_thk).replaceWith(html);
    console.log(values)
    $(name_thk).val(values.thickness);
    meForm.SheetMaterial.updateValues(name)
    update_all();
}

meForm.Widget['sheet_material']=meForm.SheetMaterial

// ---------------- meForm.Hole - widget for editing holes ---------------------

meForm.Hole={}
meForm.Hole.makeEditField=function(pars,vals)
{
    var row=meForm.hiddenField(pars,vals)
    var values=JSON.parse(vals)
    var f_type_change="meForm.Hole.updateFields(&quot;"+pars.name+"&quot;)"
    var f_dia_change="meForm.Hole.updateValues(&quot;"+pars.name+"&quot;)"
    var tpars={
          "class": "list",
          "label": "tipo foro",
          "name": appendTag(pars.name,"type"),
          "value":"1",
          "width": 50,
          "args": {"onchange":f_type_change},
          "values": [
            {"text": "Grezzo a Plasma", "value": "1"},
            {"text": "Ricavato a Trapano","value": "2"},
            {"text": "Filettato","value": "3"},
            {"text": "Svasato","value": "4"}
          ]
        }
    row+=meForm.editList(tpars,values.type)
    switch(values.type)
    {
        case '1':
            dvars=meForm.Hole.Types['1']
            dvars.name=appendTag(pars.name,"dia"),
            dvars["args"]={"onchange":f_dia_change}
            row+=meForm.editNumber(dvars,values.dia)
            break;
        case '2':
            dvars=meForm.Hole.Types['2']
            dvars.name=appendTag(pars.name,"dia"),
            dvars["args"]={"onchange":f_dia_change}
            row+=meForm.editList(dvars,values.dia)
            break;
        case '3':
            dvars=meForm.Hole.Types['3']
            dvars.name=appendTag(pars.name,"dia"),
            dvars["args"]={"onchange":f_dia_change}
            row+=meForm.editList(dvars,values.dia)
            break;
        case '4':
            dvars=meForm.Hole.Types['4']
            dvars.name=appendTag(pars.name,"dia"),
            dvars["args"]={"onchange":f_dia_change}
            row+=meForm.editList(dvars,values.dia)
            break;
    }
    return row
}

meForm.Hole.Types=
{   '1':
    {
        "class": "number",
        "label": "Ø foro",
        "value": 0,
        "width": 40,
        "name": "dia"
    },
    '2':
    {
        "class": "list",
        "label": "Ø foro",
        "value": 5,
        "width": 40,
        "name": "dia",
        "values":[{"text":"1,75","value":1.75},
                  {"text":"2,5","value":2.5},
                  {"text":"3,3","value":3.3},
                  {"text":"4,2","value":4.2},
                  {"text":"5","value":5},
                  {"text":"5,25","value":5.25},
                  {"text":"6","value":6},
                  {"text":"6,5","value":6.5},
                  {"text":"7","value":7},
                  {"text":"7.5","value":7.5},
                  {"text":"8","value":8},
                  {"text":"8,5","value":8.5},
                  {"text":"9","value":9},
                  {"text":"9.5","value":9.5},
                  {"text":"10","value":10},
                  {"text":"10,25","value":10.5},
                  {"text":"11","value":11},
                  {"text":"12","value":12},
                  {"text":"12,5","value":12.5},
                  {"text":"13","value":13},
                  {"text":"14","value":14},
                  {"text":"15","value":15},
                  {"text":"16","value":16},
                  {"text":"17","value":17},
                  {"text":"18","value":18},
                  {"text":"19","value":19},
                  {"text":"20","value":20},
                  {"text":"21","value":21},
                  {"text":"23","value":23},
                  {"text":"25","value":25},
                  {"text":"27","value":27},
                  {"text":"30","value":30},
                  {"text":"31","value":31},
                  {"text":"35","value":35},
                  {"text":"40","value":40},
                  {"text":"50","value":50}]
    },
    '3':
    {
        "class": "list",
        "label": "Ø filetto",
        "value": 5,
        "width": 40,
        "name": "dia",
        "values":[{"text":"3 MA","value":3},
                  {"text":"4 MA","value":4},
                  {"text":"5 MA","value":5},
                  {"text":"6 MA","value":6},
                  {"text":"8 MA","value":8},
                  {"text":"10 MA","value":10},
                  {"text":"12 MA","value":12},
                  {"text":"14 MA","value":14},
                  {"text":"16 MA","value":16},
                  {"text":"18 MA","value":18},
                  {"text":"20 MA","value":20},
                  {"text":"22 MA","value":22},
                  {"text":"24 MA","value":24},
                  {"text":"27 MA","value":27},
                  {"text":"30 MA","value":30},
                  {"text":"1&quot; GAS","value":30}]
    },
    '4':
    {
        "class": "list",
        "label": "vite svasata",
        "value": 5,
        "width": 40,
        "name": "dia",
        "values":[{"text":"4 MA","value":4},
                  {"text":"5 MA","value":5},
                  {"text":"6 MA","value":6},
                  {"text":"8 MA","value":8},
                  {"text":"10 MA","value":10},
                  {"text":"12 MA","value":12},
                  {"text":"14 MA","value":14},
                  {"text":"16 MA","value":16},
                  {"text":"18 MA","value":18},
                  {"text":"20 MA","value":20},
                  {"text":"22 MA","value":22},
                  {"text":"24 MA","value":24},
                  {"text":"27 MA","value":27},
                  {"text":"30 MA","value":30}]
    }
}

meForm.Hole.updateFields=function(name)
{
    var name_hidden="input[name='"+name+"]:string']"
    var name_type="select[name='"+appendTag(name,"type")+":number'"
    var del_type="tr[id='"+name.slice(0,-1)+"_type]:number'"
    var name_replace="tr[id='"+name.slice(0,-1)+"]:string'"
    var new_values={'type':$(name_type).val()}
    var name_dia="input[name='"+name.slice(0,-1)+"_dia]:number'"
    var del_dia="tr[id='"+name.slice(0,-1)+"_dia]:number'"
    new_values.dia=$(name_dia).val()
    if (new_values.dia==undefined)
    {
        name_dia="select[name='"+name.slice(0,-1)+"_dia]:number'"
        del_dia="tr[id='"+name.slice(0,-1)+"_dia]:number'"
        new_values.dia=$(name_dia).val()
    }
    var json_values=JSON.stringify(new_values)
    var pars={
        "class":"hole",
        "name":name,
        "value":json_values
        }
    row=meForm.Hole.makeEditField(pars,json_values)
    $(del_type).remove();
    $(del_dia).remove();
    $(name_replace).replaceWith(row);
    update_all();
}

meForm.Hole.updateValues=function(name)
{
    var name_hidden="input[name='"+name+":string'"
    var name_type="select[name='"+name.slice(0,-1)+"_type]:number'"
    var new_values={'type':$(name_type).val()}
    if (new_values.type=='1')
    {name_dia="input[name='"+name.slice(0,-1)+"_dia]:number'"}
    else
    {name_dia="select[name='"+name.slice(0,-1)+"_dia]:number'"}
    new_values.dia=$(name_dia).val()
    $(name_hidden).val(JSON.stringify(new_values));
}

meForm.Widget['hole']=meForm.Hole

//---------------------------------------------MENU FUNCTION----------------------------------------//

meForm.loadMenu=function(menu) {this.menu=menu;}

meForm.updateMenu=function()
{
    var subMenu=function(sub_menu)
    {
         menu_html="<ul style='width: 250px;'>"
         for (var opt in sub_menu)
         {
                if (sub_menu[opt].show)
                    {
                        var action=""
                        if (sub_menu[opt].on_click){action="onclick="+'"'+sub_menu[opt].on_click+'"'}
                        menu_html+="<li id='"+opt+"'><a "+action+" class='menu'>"+opt+"</a>";
                        if (sub_menu[opt].child) {menu_html+=subMenu(sub_menu[opt].child)}
                        menu_html+="</li>";
                    }
          }
          menu_html+="</ul>"
          return menu_html
     }

     var menu_html="<ul id='menu' style='display:inline;'>"
     for (var opt in this.menu)
            {
                if (this.menu[opt].show)
                {
                    var action=""
                    if (this.menu[opt].on_click){action="onclick="+'"'+this.menu[opt].on_click+'"'}
                    menu_html+="<li id='"+opt+"'><a "+action+" class='menu'>"+opt+"</a>";
                    if (this.menu[opt].child) {menu_html+=subMenu(this.menu[opt].child)}
                    menu_html+="</li>";
                }
            }
            menu_html+="</ul>"
            $("ul#menu").replaceWith(menu_html);
}


meForm.enableMenuOption=function(opt)
        {
          var enableOption=function(menu,opt)
          {
            for (var seek_opt in menu)
                {
                    if (seek_opt==opt) {menu[seek_opt].show=true;}
                    else {enableOption(menu[seek_opt].child,opt)}
                }
          }
          enableOption(this.menu,opt);
        }



meForm.disableMenuOption=function(opt)
        {
          var disableOption=function(menu,opt)
          {
            for (var seek_opt in menu)
                {
                    if (seek_opt==opt) {menu[seek_opt].show=false;}
                    else {disableOption(menu[seek_opt].child,opt)}
                }
          }
          disableOption(this.menu,opt);
        }

