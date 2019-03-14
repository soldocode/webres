// meTools - JavaScript Module     //
// Riccardo Soldini  2019          //

function MeIndex(divId)
{
  this.divId=divId
  this.model=[]
  this.html='<div id='+this.divId+'><h1>Index of '+this.divId+'</h1></div>'
};


MeIndex.prototype.render = function ()
{
  console.log('running')
  html='<div id='+this.divId+'><p>Ciao</p></div>'
  $("div#"+this.divId).html(html);
};

MeIndex.prototype.show = function ()
{
  $("div#"+this.divId).html(this.html);
};

MeIndex.prototype.hide = function ()
{
  console.log('hiding')
};
