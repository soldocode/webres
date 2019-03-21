// meTools - JavaScript Module     //
// Riccardo Soldini  2019          //

function MeIndex(divId)
{
  this.divId=divId
  this.model=[]
  this.html='<div id='+this.divId+'><h3>Index of '+this.divId+'</h3></div>'
  this.filter_loader=""
  this.content=[]
  this.filters={}
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
  //html+='</div>'
  this.html=html;

  $("div#"+this.divId).html(this.html);
  //for (var i in this.filter)
  //{
  //  console.log(i)
  //  this.render_filter('evaso')
  //}
}


MeIndex.prototype.load_filters = function (path)
{
  for (i in this.model)
  {
    var filter=this.model[i].filter
    if (filter!=null)
    this.load_filter(filter,this.model[i].field)
  }
}


MeIndex.prototype.load_filter = function (filter,id)
{
  var this_obj=this
  $.ajax({url:this.filter_loader+filter.origin,
          type:"POST",
          data:null,
          dataType: "json",
          success:function(result)
           {
             this_obj.filters[id]=result.options
             this_obj.render_filter(id,filter.default)
           }
        });
}


MeIndex.prototype.render_filter=function (id,value)
{
  var opts= this.filters[id];
  var selected=''
  html='<select class="border-0" onchange="deploy_content(0,200)">'
  for (i in opts)
  {
    selected=''
    if (i==opts[i][1]){selected='selected="selected"'}
    html+='<option '+selected+' value="'+opts[i][1]+'">'+opts[i][0]+'</option>'
  }
  html+="</select>"
  $("th#filter_"+id).html(html);
}


MeIndex.prototype.load_content = function(rec_min,rec_range,filters)
{
  values={}
  values.rec_min=rec_min
  values.rec_max=rec_range
  values.filters=filters
  var this_obj=this
  $.ajax({url:this.filter_loader+'load_content',
          type:"POST",
          data:null,
          dataType: "json",
          success:function(result)
           {
             this_obj.content=result.rows
             this_obj.render_content()
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
