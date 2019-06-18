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


MeForm.prototype.render_model_old = function ()
{
  html='<table class="table table-borderless" id="form-'+this.divId+'">'
  html+='<colgroup><col width="50%"><col width="5%"><col width="45%"></colgroup>'
  html+='<tbody id="fields_'+this.divId+'">'
  for (i in this.model)
  {
    html+='<tr>'
    html+='<th>'+this.model[i].label+'</th>'
    html+='<td></td>'
    html+='<td><input type="text"></td>'
    html+='</tr>'
  }
  html+='</tbody>'
  html+='</table>'
  this.html=html;

  $("div#"+this.divId).html(this.html);

}


MeForm.prototype.render_model = function ()
{
  html='<form id="form-'+this.divId+'">'
  for (i in this.model)
  {
    fmodel=this.model[i]
    html+=FormWidget[fmodel.class](fmodel)
    html+='</div>'
  }
  html+='</form>'
  this.html=html;

  $("div#"+this.divId).html(this.html);
}


//////////////////////////////// FormWidget ///////////////////////////////////

FormWidget={}

FormWidget['text']=function(f){
  html='<div class="form-group row">'
  html+='<label for="'+f.field+'" class="col-sm-2 col-form-label">'
  html+=f.label+'</label>'
  html+='<div class="col-sm-'+f.width+'">'
  html+='<input type="text" class="form-control" id="'+f.field+'">'
  html+='</div></div>'
  return html
}


FormWidget['select']=function(f){
  html='<div class="form-group row">'
  html+='<label for="'+f.field+'" class="col-sm-2 col-form-label">'
  html+=f.label+'</label>'
  html+='<div class="col-sm-'+f.width+'">'
  html+='<select class="form-control" id="'+f.field+'">'
  for (o in f.values){
    html+='<option value="'+f.values[o]['value']+'">'+f.values[o]['text']+'</option>'
  }
  html+='</select></div></div>'
  return html
}
