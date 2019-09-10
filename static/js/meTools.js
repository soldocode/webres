// meTools - JavaScript Module     //
// Riccardo Soldini  2019          //


///////////////////////////////// MeIndex /////////////////////////////////////

function MeIndex(id)
{
  this.divId=id
  this.id=id
  this.model=[]
  this.html='<div id='+this.divId+'><h3>Index of '+this.divId+'</h3></div>'
  this.filter_loader=""
  this.content=[]
  this.filters={}
}

MeIndex.prototype.load_model = function ()
{
  var this_obj=this
  var dfd = $.Deferred();
  $.ajax({url:this.app_url+'load_model_'+this.id,
          type:"POST",
          dataType: "json",
          success:function(result)
          {
            this_obj.model=result.model
            console.log('load_mode call successful...')
          },
          complete:function()
          {
            this_obj.render_model()
            console.log('load_mode call completed...')
            dfd.resolve();
          }
         });
  console.log('load_mode funct end...')
  return dfd.promise();
}


MeIndex.prototype.render_model = function ()
{
  //html='<div id='+this.divId+'>'
  html='<table class="table table-striped" id="grid-'+this.divId+'">'
  html+='<colgroup>'
  for (i in this.model)
  {
    html+='<col width="'+this.model[i].width+'%">'
  }
  html+='</colgroup>'
  html+='<thead>'
  html+='<tr>'
  for (i in this.model)
  {
    html+='<th>'+this.model[i].label+'</th>'
  }
  html+='</tr>'
  html+='<tr>'
  for (i in this.model)
  {
    html+='<th id="filter_'+this.model[i].field+'"></th>'
  }
  html+='</tr>'
  html+='</thead>'
  html+='<tbody id="rows_'+this.divId+'"></tbody>'
  html+='</table>'
  //html+='</div'
  this.html=html;

  $("div#"+this.divId).html(this.html);

}


MeIndex.prototype.load_filters = function ()
{
  var dfd = $.Deferred();
  var filters=[]
  for (i in this.model)
  {
    filter=this.model[i].filter
    if (filter!=null)
    {
      filters.push([filter,this.model[i].field])
    }
  }
  $.when(this.load_filter(filters)).done(function(){dfd.resolve()})
  return dfd.promise()
}


MeIndex.prototype.load_filter = function (filters)
{
  var dfd = $.Deferred();
  var this_obj=this
  if (filters.length==0)
  {
      dfd.resolve();
  }
  else
  {
      var filter=filters.pop()
      $.ajax({url:this.filter_loader+filter[0].origin,
          type:"POST",
          data:null,
          dataType: "json",
          success:function(result)
           {
             this_obj.filters[filter[1]]=result.options
           },
          complete:function(result){
             console.log('load filter'+filter[0].origin+' complete...')
             $.when(this_obj.load_filter(filters)).done(function(){dfd.resolve()})
             this_obj.render_filter(filter[1],filter[0].default)
          }
        });
  }
  return dfd.promise()
}


MeIndex.prototype.render_filter=function (id,value)
{
  var opts= this.filters[id];
  var selected=''
  html='<select class="border-0" onchange="update_content()">'
  for (i in opts)
  {
    selected=''
    if (opts[i][1]==value){selected='selected="selected"'}
    html+='<option '+selected+' value="'+opts[i][1]+'">'+opts[i][0]+'</option>'
  }
  html+="</select>"
  $("th#filter_"+id).html(html);
  console.log('render filter complete...')
}


MeIndex.prototype.load_content = function(rec_min,rec_range,filters)
{
  values={}
  values.rec_min=rec_min
  values.rec_range=rec_range
  values.filters=filters
  var this_obj=this
  $.ajax({url:this.app_url+'load_content',
          type:"POST",
          data:values,
          dataType: "json",
          success:function(result)
           {
             console.log('load_content call succsefull...')
             this_obj.content=result.rows
           },
          complete:function(result)
          {
            this_obj.render_content()
            console.log('load_content call completed...')
          },
        });
}


MeIndex.prototype.render_content = function()
{
 html=''
 for (var i in this.content)
 {
   html+='<tr id="'+i+'">'
   var row=this.content[i]
   for (var c in this.model)
   {
      var field=this.model[c].field
      var cls=this.model[c].class
      html+='<td>'
      switch (cls)
      {
        case 'link':
          html+='<a class="link text-decoration-none" '
          html+='href="'+this.model[c].url+'?id='+row.id+'">'
          html+='<b>'+row[field]+'</b>'
          html+='</a>'
          break;
        case 'select':
          var options=this.filters[field]
          var cnt='Indefinito'
          for (o in options)
          {
            if (options[o][1]==row[field])
            {
              cnt=options[o][0]
            }
          }
          html+=cnt
          break;
        case 'text':
          html+=row[field]
          break;
      }
      html+='</td>'
   }
   html+='</tr>'
 }
 $("tbody#rows_"+this.divId).html(html);
}


MeIndex.prototype.show = function ()
{
  $("div#"+this.divId).html(this.html);
}


MeIndex.prototype.hide = function ()
{
  console.log('hiding')
}


///////////////////////////////// MeForm /////////////////////////////////////

function MeForm(id)
{
  this.divId=id
  this.id=id
  this.model=[]
  this.html='<div id='+this.id+'><h3>Form of '+this.id+'</h3></div>'
  this.fields={}
  this.widgets={}
  this.values={}
}

MeForm.prototype.load_model = function ()
{
  var this_obj=this
  var dfd = $.Deferred();
  $.ajax({url:this.app_url+'load_model_'+this.id,
          type:"POST",
          dataType: "json",
          success:function(result)
          {
            this_obj.model=result.model
            console.log('load_mode call successful...')
          },
          complete:function()
          {
            this_obj.render_model()
            console.log('load_mode call completed...')
            dfd.resolve();
          }
         });
  console.log('load_mode funct end...')
  return dfd.promise();
}


MeForm.prototype.render_model = function ()
{
  var html='<form id="form-'+this.divId+'">'
  for (i in this.model)
  {
    fmodel=this.model[i]
    this.fields[fmodel.field]={}
    wdg=new FormWidget[fmodel.class](this,fmodel)
    html+=wdg.html
    this.widgets[wdg.id]=wdg
  }
  html+='</form>'
  this.html=html;

  var script='<script id="form-'+this.divId+'">'
  script+='</script>'

  $("div#"+this.divId).html(this.html+script);


  for (w in this.widgets) {this.widgets[w].afterRender()}
}



MeForm.prototype.load_content = function(id)
{
  values={}
  values.id=id
  var this_obj=this
  $.ajax({url:this.app_url+'load_content_'+this.id,
          type:"POST",
          data:values,
          dataType: "json",
          success:function(result)
           {
             console.log('load_content call succsefull...')
             for (v in result.values)
             {
               this_obj.fields[v].value=result.values[v]
             }
             for (w in this_obj.widgets)
             {
               //console.log(w)
               k=this_obj.widgets[w].model.field
               value=this_obj.fields[k].value
               $("#"+w).val(value)
               values[k]=value
             }
             //this_obj.values=values
           },
          complete:function(result)
          {
            console.log('load_content call completed...')
            this_obj.values=values
          },
        });
}


MeForm.prototype.updateData = function()
{
  console.log(this.values)
  var this_obj=this
  $.ajax({url:this.app_url+'update_data_'+this.divId,
          type:"POST",
          data:this.values,
          dataType: "json",
          success:function(result)
           {
             console.log('updateData called...')
             alert(result.msg)
           },
          complete:function(result)
          {
            console.log('updateData call completed...')
          },
        });
}



/////////////////////////////////// MeTable ///////////////////////////////////


function MeTable(id)
{
  this.id=id
  this.model=[]
  this.html='<div id='+this.id+'><h3>Index of '+this.id+'</h3></div>'
  this.content=[]
}

MeTable.prototype.load_model = function ()
{
  var this_obj=this
  var dfd = $.Deferred();
  $.ajax({url:this.app_url+'load_model_'+this.id,
          type:"POST",
          dataType: "json",
          success:function(result)
          {
            this_obj.model=result.model
            console.log('load_mode call successful...')
          },
          complete:function()
          {
            this_obj.render_model()
            console.log('load_mode call completed...')
            dfd.resolve();
          }
         });
  console.log('load_mode funct end...')
  return dfd.promise();
}


MeTable.prototype.render_model = function ()
{
  html='<table class="table table-striped" id="table_'+this.id+'">'
  html+='<colgroup>'
  for (i in this.model)
  {
    html+='<col width="'+this.model[i].width+'%">'
  }
  html+='</colgroup>'
  html+='<thead>'
  html+='<tr>'
  for (i in this.model)
  {
    html+='<th>'+this.model[i].label+'</th>'
  }
  html+='</tr>'
  html+='</thead>'
  html+='<tbody id="rows_'+this.id+'"></tbody>'
  html+='</table>'
  this.html=html;

  $("div#"+this.id).html(this.html);

}



//////////////////////////////// FormWidget ///////////////////////////////////


function FWidget(form,field)
{
  this.form=form
  this.model=field
  this.id=form.divId+'_'+field.field
  this.class=field.class
  this.html=''
  this.json=null
}


function FWHidden(form,field)
{
  FWidget.call(this,form,field);
  this.html='<div hidden="true" class="form-group row"></div>'
}

FWHidden.prototype.afterRender=function(){}



function FWText(form,field)
{
  FWidget.call(this,form,field);
  this.html='<div class="form-group row">'
             +'<label for="'+this.model.field+'" class="col-sm-2 col-form-label">'
             +this.model.label+'</label>'
             +'<div class="col-sm-'+this.model.width+'">'
             +'<input type="text" onchange="FWTextOnChange(\''+form.divId+'\',\''+this.model.field+'\',event)"'
             +'class="form-control" id="'+this.id+'">'
             +'</div></div>'
}

FWText.prototype.afterRender=function()
{
  this.form.fields[this.model.field]={'value':''}
}

function FWTextOnChange(container,field,event)
{
    v=$("#"+container+"_"+field).val()
    frm=eval(container+'_form')
    frm.values[field]=v
    frm.fields[field].json=v
    frm.updateData()
}



function FWNumber(form,field)
{
  FWidget.call(this,form,field);
  this.html='<div class="form-group row">'
             +'<label for="'+this.model.field+'" class="col-sm-2 col-form-label">'
             +this.model.label+'</label>'
             +'<div class="col-sm-'+this.model.width+'">'
             +'<input type="number" onchange="FWNumberOnChange(\''+form.divId+'\',\''+this.model.field+'\',event)"'
             +'class="form-control" id="'+this.id+'">'
             +'</div></div>'
}

FWNumber.prototype.afterRender=function()
{
  this.form.fields[this.model.field]={'value':''}
}

function FWNumberOnChange(container,field,event)
{
    v=$("#"+container+"_"+field).val()
    //wdg=eval(container+'_form.fields.'+field)
    frm=eval(container+'_form')
    frm.values[field]=v
    frm.fields[field].json=v
    frm.updateData()
}


function FWSelect(form,f,value_is_int=true)
{
  FWidget.call(this,form,f);
  this.html='<div class="form-group row">'
            +'<label for="'+f.field+'" class="col-sm-2 col-form-label">'
            +f.label+'</label>'
            +'<div class="col-sm-'+f.width+'">'
            +'<select onchange="FWSelectOnChange(\''+form.divId+'\',\''+this.model.field+'\')"'
            +'class="form-control" id="'+this.id+'">'
  for (o in f.values){
    this.html+='<option value="'+f.values[o][1]+'">'+f.values[o][0]+'</option>'
  }
  this.html+='</select></div></div>'
  this.value_is_int=value_is_int
}

FWSelect.prototype.afterRender=function()
{
  this.form.fields[this.model.field]={'value':'','value_is_int':this.value_is_int}
}

function FWSelectOnChange(container,field)
{
    v=$("#"+container+"_"+field).val()
    frm=eval(container+'_form')
    vsi=(frm.fields[field].value_is_int)
    if (vsi)frm.values[field]=parseInt(v);
    else frm.values[field]=v
    frm.fields[field].json=v
    frm.updateData()
}



function FWFlowchart(form,f)
{
  FWidget.call(this,form,f);
  this.html='<div class="form-group row">'
       +'<label for="'+this.model.field+'" class="col-sm-2 col-form-label">'
       +this.model.label+'</label>'
       +'<div class="col-sm-'+this.model.width+'">'
       +'<div class="input-group mb-1">'
       +'<div class="input-group-prepend">'
       +'<button class="btn btn-outline-secondary"'
       +'onclick="FWFlowchartAddNode(\''+form.divId+'\',\''+this.model.field+'\')" type="button">Aggiungi</button>'
       +'</div>'
       +'<input type="text" class="form-control col-sm-3" id="'+this.id+'_add">'
       +'<a class="btn btn-outline-secondary d-inline align-middle"'
       +'href="#" onclick="edit_node()" role="button">Modifica</a></div>'
       +'<div class=form-control>'
       +'<div id="'+this.id+'"></div>'
       +'</div></div></div>'
}

FWFlowchart.prototype.afterRender=function(){
   var nodes=new vis.DataSet(this.model.values.nodes);
   var edges=new vis.DataSet(this.model.values.edges);
   var container = document.getElementById(this.id);
   var data = {
       nodes: nodes,
       edges: edges
   };

   var options = {
     height:'350px',
     layout: {
       randomSeed: undefined,
       improvedLayout:true,
       hierarchical:
       {
         enabled:true,
         levelSeparation: 150,
         nodeSpacing: 50,
         treeSpacing: 50,
         blockShifting: true,
         edgeMinimization: true,
         parentCentralization: true,
         direction: 'LR',        // UD, DU, LR, RL
         sortMethod: 'directed'   // hubsize, directed
       },
     },
     manipulation: {
       enabled: true,
       initiallyActive: false,
       addNode: true,
       addEdge: true,
       editEdge: true,
       deleteNode: true,
       deleteEdge: true,
     },
     nodes:{
       shape: 'box',
     }
   }

   var network = new vis.Network(container, data, options);
   network.on("selectNode",function(){console.log('cambiatto!!')})
   this.form.fields[this.model.field]={'network':network,'node_field':this.model.node_field}
 }

 function FWFlowchartAddNode(container,field)
 {
        wdg=eval(container+'_form.fields.'+field)
        n=wdg.network
        var nodes=n.body.data.nodes._data
        var edges=n.body.data.edges._data
        nn=[]
        ee=[]
        idn=0
        for (i in nodes)
        {
          nn.push(nodes[i])
          if (nodes[i].id>idn){idn=nodes[i].id}
        }
        for (i in edges){ee.push(edges[i])}
        nn.push({id:idn+1,label:$("#"+container+"_"+field+"_add").val()})
        ee.push({from:idn, to:idn+1})
        n.setData({nodes:new vis.DataSet(nn),edges:new vis.DataSet(ee)})
        wdg.value={nodes:nn,edges:ee}
        json_node={}
        json_flow={}
        for (i in nodes)
        {
          json_node[nodes[i].id]={'Title':nodes[i].label}
          json_flow[nodes[i].id]=[]
        }
        console.log(json_flow)
        for (i in edges)
        {
          console.log(edges[i].to)
          json_flow[edges[i].to].push(edges[i].from)
        }
        wdg.json={}
        wdg.json[wdg.node_field]=json_node
        wdg.json['Flow']=json_flow
 }



function FWRangeNumber(form,f)
// permette di definire un range a cui associare un numero
{
  FWidget.call(this,form,f);
  this.html='<div class="form-group row">'
       +'<label for="'+this.model.field+'" class="col-sm-2 col-form-label">'
       +this.model.label+'</label>'
       +'<div class="col-sm-8" id="'+this.id+'" tcount=1>'

       +'<div class="form-group row" row="0" id="'+this.id+'_0">'
       +'<label for="'+f.field+'" class="col-sm-2 col-form-label">fino a</label>'
       +'<div class="col-md-3">'
       +'<input type="number" onchange="FWRangeNumberRangeOnChange'
       +'(\''+form.divId+'\',\''+this.model.field+'\',\''+0+'\')"'
       +'class="form-control" id="'+this.id+'_range_0">'
       +'</div>'
       +'<p class="col-sm-1 col-form-label">vale</p>'
       +'<div class="col-md-4">'
       +'<input type="number" onchange="FWRangeNumberOnChange(\''+form.divId+'\',\''+this.model.field+'\')"'
       +'class="form-control" id="'+this.id+'_value_0">'
       +'</div>'
       +'<div class="col-form-label col-md-1">'
       +'<a class="btn btn-outline-secondary d-inline align-middle col-sm-1" '
       +'id="'+this.id+'_0" '
       +'onclick="FWRangeNumberInsertRow'
       +'(event,\''+form.divId+'\',\''+this.model.field+'\',\''+0+'\')" role="button">+</a>'
       +'</div>'
       +'</div>'

       +'<div class="form-group row" row="1" id="'+this.id+'_1">'
       +'<label for="'+f.field+'" class="col-sm-5 col-form-label" id="'+this.id+'_1">oltre a 1000</label>'
       +'<p class="col-sm-1 col-form-label">vale</p>'
       +'<div class="col-md-4">'
        +'<input type="text" onchange="FWRangeNumberOnChange(\''+form.divId+'\',\''+this.model.field+'\')"'
        +'class="form-control" id="'+this.id+'_value_1">'
       +'</div>'
       +'</div>'

       +'</div></div>'
}

FWRangeNumber.prototype.afterRender=function()
{
  this.form.fields[this.model.field]={'value':{1:0}}
}


function FWRangeNumberOnChange(container,field)
{
    wdg=eval(container+'_form.fields.'+field)
    wdg_id=container+'_'+field
    tcount=parseInt($("#"+wdg_id).attr("tcount"))
    var value={}
    value[0]=$("input#"+wdg_id+"_value_0")  .val()
    for (i=0; i<=tcount; i++)
    {
      console.log(i)
      trg="#"+wdg_id+"_"+i
      r=$("input#"+wdg_id+"_range_"+parseInt(i)).val()
      v=$("input#"+wdg_id+"_value_"+parseInt(i+1)).val()
      value[r]=v
    }

    wdg.value=value
    wdg.json=wdg.value
    frm.updateData()
}


function FWRangeNumberRangeOnChange(container,field,count)
{
    wdg=eval(container+'_form.fields.'+field)
    wdg_id=container+'_'+field
    step=1
    tcount=parseInt($("#"+wdg_id).attr("tcount"))
    newcount=parseInt(count)+1
    range_value=parseFloat($("input#"+wdg_id+"_range_"+count).val())+step
    if (count==tcount-1)
    {
      $("label#"+wdg_id+"_"+newcount).text('oltre a '+range_value)
    }
    else
    {
      $("label#"+wdg_id+"_"+newcount).text('da '+range_value+' fino a')
    }
    //console.log($("label#"+wdg_id+"_range_"+count).val())
    frm.updateData()
}


function FWRangeNumberInsertRow(event,container,field,count)
{
    target=$(event.currentTarget)
    //console.log(target[0].id)
    wdg=eval(container+'_form.fields.'+field)
    wdg_id=container+'_'+field
    step=1
    tcount=parseInt($("#"+wdg_id).attr("tcount"))
    newcount=parseInt(count)+1
    range_value=parseFloat($("input#"+wdg_id+"_range_"+count).val())+step
    html= '<div class="form-group row" row='+newcount+' id="'+wdg_id+'_'+newcount+'">'
     +'<label for="'+field+'" class="col-sm-2 col-form-label" id="'+wdg_id+'_'+newcount+'">da '
     +range_value+' fino a'
     +'</label>'
     +'<div class="col-md-3">'
     +'<input type="number" onchange="FWRangeNumberRangeOnChange(\''+container+'\',\''+field+'\',\''+newcount+'\')"'
     +'class="form-control" id="'+wdg_id+'_range_'+newcount+'">'
     +'</div>'
     +'<p class="col-sm-1 col-form-label">vale</p>'
     +'<div class="col-md-4">'
     +'<input type="number" onchange="FWRangeNumberOnChange(\''+container+'\',\''+field+'\')"'
     +'class="form-control"id="'+wdg_id+'_value_'+newcount+'">'
     +'</div>'
     +'<div class="btn-group" role="group">'
     +'<button type="button" class="btn  btn-outline-secondary">-</button>'
     +'<button type="button" class="btn  btn-outline-secondary" '
     +'id="'+wdg_id+'_'+newcount+'" '
     +'onclick="FWRangeNumberInsertRow(event,\''+container+'\',\''+field+'\',\''+newcount+'\')">+</button>'
     +'</div>'
     +'</div>'

    for (i=tcount; i>count; i--)
    {
      //console.log(i)
      trg="#"+wdg_id+"_"+i
      //console.log("input#"+wdg_id+"_range_"+parseInt(i))
      $("label"+trg).attr("id",wdg_id+"_"+parseInt(i+1))
      //$("input"+trg).attr("row",i+1)
      $("input#"+wdg_id+"_range_"+parseInt(i)).attr("onchange",
        'FWRangeNumberRangeOnChange(\''+container+'\',\''+field+'\',\''+parseInt(i+1)+'\')')
      $("input#"+wdg_id+"_value_"+parseInt(i)).attr("onchange",
        'FWRangeNumberOnChange(\''+container+'\',\''+field+'\')')
      $("button"+trg).attr("onclick",
        'FWRangeNumberInsertRow(event,\''+container+'\',\''+field+'\',\''+parseInt(i+1)+'\')')
      $("input#"+wdg_id+"_range_"+parseInt(i)).attr("id",wdg_id+"_range_"+parseInt(i+1))
      $("input#"+wdg_id+"_value_"+parseInt(i)).attr("id",wdg_id+"_value_"+parseInt(i+1))
      $("button"+trg).attr("id",wdg_id+"_"+parseInt(i+1))
      $("div"+trg).attr("row",i+1)
      $("div"+trg).attr("id",wdg_id+"_"+parseInt(i+1))
    }
    $("div#"+wdg_id+"_"+count).after(html)
    $("div#"+wdg_id).attr("tcount",tcount+1)
}


function FWSwitch(form,f)
{
  FWidget.call(this,form,f);
  this.html='<div class="form-group row">'
         +'<label for="'+this.model.field+'" class="col-sm-2 col-form-label">'
         +this.model.label+'</label>'
         +'<div class=  "col-sm-5">'
         +'<input class="form-control" id="'+this.id+'" type="checkbox" data-toggle="toggle" '
         +'data-on="'+this.model.state_labels.on+'" '
         +'data-off="'+this.model.state_labels.off+'" '
         +'data-onstyle="'+this.model.state_colors.on+'" '
         +'data-offstyle="'+this.model.state_colors.off+'" '
         +'onchange="FWSwitchOnChange(\''+form.divId+'\',\''+this.model.field+'\')"'
         +'>'
         +'</div></div>'
}

FWSwitch.prototype.afterRender=function()
{
  $('#'+this.id).bootstrapToggle();
  $('div.toggle').height('auto')
  this.form.fields[this.model.field]={'value':false}
}

function FWSwitchOnChange(container,field)
{
  frm=eval(container+'_form')
  frm.values[field]=$('#'+container+'_'+field).prop('checked')
  frm.updateData()
}


FormWidget={'text':FWText,
            'number':FWNumber,
            'select':FWSelect,
            'flowchart':FWFlowchart,
            'rangeNumber':FWRangeNumber,
            'switch':FWSwitch,
            'hidden':FWHidden,
}
