// meTools - JavaScript Module     //
// Riccardo Soldini  2019          //


///////////////////////////////// MeIndex /////////////////////////////////////

function MeIndex(divId)
{
  this.divId=divId
  this.model=[]
  this.html='<div id='+this.divId+'><h3>Index of '+this.divId+'</h3></div>'
  this.filter_loader=""
  this.content=[]
  this.filters={}
}

MeIndex.prototype.load_model = function (model_name)
{
  var this_obj=this
  var dfd = $.Deferred();
  $.ajax({url:this.app_url+'load_model_'+model_name,
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


MeIndex.prototype.load_filters = function (path)
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
  $.ajax({url:this.filter_loader+'load_content',
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
          html+='<a class="link text-decoration-none" href="">'
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

function MeForm(divId)
{
  this.divId=divId
  this.model=[]
  this.html='<div id='+this.divId+'><h3>Form of '+this.divId+'</h3></div>'
  this.values=[]
  this.fields={}
  this.widgets={}
}

MeForm.prototype.load_model = function (model_name)
{
  var this_obj=this
  var dfd = $.Deferred();
  $.ajax({url:this.app_url+'load_model_'+model_name,
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
    this.fields[fmodel.field]={'values':0}
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


//////////////////////////////// FormWidget ///////////////////////////////////


function FWidget(form,field)
{
  this.form=form
  this.model=field
  this.id=form.divId+'_'+field.field
  this.class=field.class
  this.html=''
  this.scripts={}
}


function FWText(form,field)
{
  FWidget.call(this,form,field);
  this.html='<div class="form-group row">'
             +'<label for="'+this.model.field+'" class="col-sm-2 col-form-label">'
             +this.model.label+'</label>'
             +'<div class="col-sm-'+this.model.width+'">'
             +'<input type="text" class="form-control" id="'+this.id+'">'
             +'</div></div>'
}

FWText.prototype.afterRender=function(){console.log(this.id + ' created')}

function FWSelect(form,f)
{
  FWidget.call(this,form,f);
  this.html='<div class="form-group row">'
            +'<label for="'+f.field+'" class="col-sm-2 col-form-label">'
            +f.label+'</label>'
            +'<div class="col-sm-'+f.width+'">'
            +'<select class="form-control" id="'+this.id+'">'
  for (o in f.values){
    this.html+='<option value="'+f.values[o]['value']+'">'+f.values[o]['text']+'</option>'
  }
  this.html+='</select></div></div>'
}

FWSelect.prototype.afterRender=function(){console.log('select widget created')}

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
       +'<input type="text" class="form-control col-sm3" id="'+this.id+'_add">'
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
     height:'250px',
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
   this.form.fields[this.model.field]={'network':network}
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
        nn.push({id:idn+1,label:$("#"+container+"_workflow_add").val()})
        ee.push({from:idn, to:idn+1})
        n.setData({nodes:new vis.DataSet(nn),edges:new vis.DataSet(ee)})
        wdg.values={nodes:nn,edges:ee}

 }



FormWidget={'text':FWText,
           'select':FWSelect,
           'flowchart':FWFlowchart,
}
