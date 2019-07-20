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
  this.after_render_calls=[]
  this.after_rendering_callback=function(){console.log('rendered')}
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
  html='<form id="form-'+this.divId+'">'
  for (i in this.model)
  {
    fmodel=this.model[i]
    this.fields[fmodel.field]={'values':0}
    var widget=FormWidget[fmodel.class](this,fmodel)
    html+=widget.html
    this.after_render_calls.push(widget.after_render)
  }
  html+='</form>'
  this.html=html;

  $("div#"+this.divId).html(this.html);

  for (c in this.after_render_calls)
  {
    this.after_render_calls[c]()
  }
}


//////////////////////////////// FormWidget ///////////////////////////////////

FormWidget={}


FormWidget['text']=function(form,f)
{
  idf=form.divId+'_'+f.field
  result={
      'html':'<div class="form-group row">'
             +'<label for="'+f.field+'" class="col-sm-2 col-form-label">'
             +f.label+'</label>'
             +'<div class="col-sm-'+f.width+'">'
             +'<input type="text" class="form-control" id="'+idf+'">'
             +'</div></div>',
      'after_render':function(a=form.divId,b=f.field){console.log(a,b)}
    }
  return result
}


FormWidget['select']=function(form,f)
{
  idf=form.divId+'_'+f.field
  result={}
  result['html']='<div class="form-group row">'
                +'<label for="'+f.field+'" class="col-sm-2 col-form-label">'
                +f.label+'</label>'
                +'<div class="col-sm-'+f.width+'">'
                +'<select class="form-control" id="'+idf+'">'
  for (o in f.values){
    result.html+='<option value="'+f.values[o]['value']+'">'+f.values[o]['text']+'</option>'
  }
  result.html+='</select></div></div>'
  result['after_render']=function(){console.log('select')}
  return result
}


FormWidget['flowchart']=function(form,f)
{
  idf=form.divId+'_'+f.field
  result={}
  result['html']='<div class="form-group row">'
                +'<label for="'+f.field+'" class="col-sm-2 col-form-label">'
                +f.label+'</label>'
                +'<div class="col-sm-'+f.width+'">'
                +'<div class="input-group mb-1">'
                +'<div class="input-group-prepend">'
                +'<button class="btn btn-outline-secondary"'
                +' onclick="add_node_'+f.field+'()" type="button">Aggiungi</button>'
                +'</div>'
                +'<input type="text" class="form-control col-sm3" id="'+idf+'_add">'
                +'<a class="btn btn-outline-secondary d-inline align-middle"'
                +'href="#" onclick="edit_node()" role="button">Modifica</a></div>'
                +'<div class=form-control>'
                +'<div id="'+idf+'"></div>'
                +'</div></div></div>'

  result['after_render']=function(){
     var nodes=new vis.DataSet(f.values.nodes);
     var edges=new vis.DataSet(f.values.edges);
     var container = document.getElementById(idf);
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

     // initialize your network!
     var network = new vis.Network(container, data, options);
     form.fields[f.field]={'network':network}
     network.on("select", function (params) {console.log('select Event:', params);})
   }
  return result
}
