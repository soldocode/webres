// meTools - JavaScript Module     //
// Riccardo Soldini  2019          //

function MeIndex(divId)
{
  this.divId=divId
  this.model=[]
  this.html='<div id='+this.divId+'><h1>Index of '+this.divId+'</h1></div>'
  this.filter_loader=""
};


MeIndex.prototype.render = function ()
{
  console.log('running')
  html='<div id='+this.divId+'>'
  html+='<table class="table table-striped" id="grid-'+this.divId+'">'
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
  html+='<tbody id="rows"></tbody>'
  html+='</table>'
  html+='</div>'
  this.html=html;
};


MeIndex.prototype.load_filters = function (path)
{
  for (i in this.model)
  {
    var path=this.model[i].filter
    if (path!=null)
    this.load_filter(path,this.model[i].field)
  }
}


MeIndex.prototype.load_filter = function (path,id)
{
  $.ajax({url:this.filter_loader+path,
          type:"POST",
          data:null,
          dataType: "json",
          success:function(result)
           {
             var opts= result.options;
             html='<select onchange="deploy_content(0,200)">'
             for (i in opts)
             {
               html+='<option value="'+opts[i][1]+'">'+opts[i][0]+'</option>'
             }
             html+="</select>"
             $("th#filter_"+id).html(html);
           }
        });
}


MeIndex.prototype.deploy_content = function(rec_min,rec_max)
{
  values={}
  values.rec_min=rec_min
  values.rec_max=rec_max
  $.ajax({url:this.filter_loader+'deploy_content',
          type:"POST",
          data:null,
          dataType: "json",
          success:function(result)
           {
             console.log(result.content);
           }
        });
};


MeIndex.prototype.show = function ()
{
  $("div#"+this.divId).html(this.html);
};


MeIndex.prototype.hide = function ()
{
  console.log('hiding')
};
