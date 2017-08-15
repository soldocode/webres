// meForm - JavaScript Module     //
// Riccardo Soldini  2015-2017    //
// 							      //
// TODO: tutto da sistemare!!     //


var meForm={LastUpdate:'15-08-2017'};


//meForm.editList
//make select from list

meForm.editList = function(vars,v=-1)
  {
    //alert(v);
    var vars = vars || {};
    var label = vars.label || '';
    var value = String(v);
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
    //var value = vars.value || 0;
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


meForm.SFormHeader = function(vars)
 {
  var count=$("input[name='id_"+vars.id+"']").val();
  count++;
  $("input[name='id_"+vars.id+"']").val(count);

  var SFid='"'+vars.id+count+'"'
  var row='<tr id="header_'+vars.id+count+'"><th>'+vars.label+' n° '+(count+1)+'</th>'
  row +=  "<th class='expand' id='"+vars.id+count+"' onclick='meForm.expand("+SFid+")'>-</th></tr>";
  return row
}


meForm.changeFields = function(vars)
{
}


meForm.makeSubForm = function (vars)// sub-form singolo
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
       rows += '<tr><td><a class="button" data-w2p_disable_with="default">'+form_data.label+'</a></td></tr>';
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
  alert (JSON.stringify(values));
  $('tr#'+vars.id).before(this.SFormHeader(vars));
  var count=$("input[name='id_"+vars.id+"']").val();
  var SFid='"'+vars.id+count+'"'
  var field_value

  var rows="<tr id="+SFid+"><td colspan=3><table class='makEasy' width='100%'>"+
           "<colgroup><col width='50%'><col width='5%'><col width='45%'></colgroup>"+
           "<tbody>";

  for (index in vars.form)
  {
    var fData=JSON.parse(JSON.stringify(vars.form[index]));
    //if (values)
    //{
    //    if (vars.values[fData.name]){fData.value=vars.values[fData.name]}
    //}
    field_value=values[fData.name] || fData.value
    alert(field_value)
    fData.name=vars.id+'['+count+']['+fData.name+']';

    switch(fData.class)
    {
     case 'list':
       rows += this.editList(fData,field_value);
       break;
     case 'number':
       rows += this.editNumber(fData,field_value);
       break;
     case 'multiple-subform':
       rows += this.makeMSForm(fData);
       break;
     default:
       rows += '';
    }
  }
  rows += '</body></table></td></tr>';
  $('tr#'+vars.id).before(rows);

}


meForm.makeTableFields = function(vars) //crea subform a tabella
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
               ' class="button" data-w2p_disable_with="default">'+buttons[i].label
          row+='</a><span> </span>'
      }
  }
  row += '</div>';
  row += '</td></tr>';

  return row
}


meForm.makeMSForm = function(vars)
{
  var vars = vars || {};
  var row_id = vars.id || '';
  var args = vars.add_button.args || {};

  var row='<tr id='+row_id+'>'+
          '<td style="padding-top:10px">'+
          '<a class="button" data-w2p_disable_with="default"'
  for  (arg in args)
    {
        row +=arg+'="'+args[arg]+'"';
    }
  row += "onclick='meForm.addSForm("+JSON.stringify(vars)+")'"
  row += ' >';
  row += vars.add_button.label+'</a><input name="id_'+vars.id+'" type="hidden" value="-1"></td></tr>';
  return row
}


meForm.expand = function(sform) //espande un form nascosto//
 {
     if ($('th[id="'+sform+'"]').text()=='-')
     {
      $('tr[id="'+sform+'"]').fadeOut();
      $('th[id="'+sform+'"]').text('+');
     }
     else
     {
      $('tr[id="'+sform+'"]').fadeIn();
      $('th[id="'+sform+'"]').text('-');
     }
    }


meForm.deployTable = function (vars)
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
               ' class="button" data-w2p_disable_with="default">'+buttons[i].label
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


meForm.deployForm = function (form_title,form_data,idForm) //dispiega form leggendo struttura json//
{
      $("h2#title").text(form_title);
      var data
      $('table#'+idForm+' tbody').html('<tr>');

      for (index in form_data)
          {
          data=form_data[index];
          switch(data.class)
              {
                  case 'list':
                      var frows=this.editList(data);
                      $('#'+idForm+' tr:last').before(frows);
                      break;
                  case 'number':
                      var frows=this.editNumber(data);
                      $('#'+idForm+' tr:last').before(frows);
                      break;
                  case 'subform':
                      var frows=this.makeSubForm(data);
                      $('#'+idForm+' tr:last').before(frows);
                      break;
                  case 'multiple-subform':
                      var frows=this.makeMSForm(data);
                      $('#'+idForm+' tr:last').before(frows);
                      break;
                  case 'table-fields':
                      var frows=this.makeTableFields(data);
                      $('#'+idForm+' tr:last').before(frows);
                      for (ib in data.buttons)
                      {
                          if (data.buttons[ib].class=="load")
                          {
                            ///da sistemare!!!!!!!!!!!!
                            document.getElementById('selectfiles0').addEventListener('change',eval(data.buttons[ib].onclick), false);
                          }
                      }
                      break;
                  case 'switch-fields':
                      var frows=this.editSwitchFields(data);
                      $('#'+idForm+' tr:last').before(frows);
                      break;
                  default:
                      var frows='';
              }
          }

    }


meForm.TR_BUTTONS = function(trId,btns,colspan)
//////////////////////////////////////////////
// btns:{"button1":{"title":"Button 1",
//                  "arg":"arg"},
//       "button2":{"title":"Button 2",
//                  "arg":"arg"}
//      }
//////////////////////////////////////////////

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


meForm.addTableRowButton = function(label,id,colspan)/// da eliminare!!!
{
    html='<tr><td colspan='+colspan+' style="border-top-width: 7px;border-bottom-width: 7px;">';
    html+='<a onclick="confirm_'+label+'()" id="'+label+'_button_ok" class="button" data-w2p_disable_with="default">Conferma</a>';
    html+='<span>  </span>';
    html+='<a onclick="delete'+label+'('+id+')" id="'+label+'_button_del" class="button" data-w2p_disable_with="default">Elimina</a>';
    html+='</td></tr>';
    return html
}


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

