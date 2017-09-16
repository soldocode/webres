/////////////////////////////////////////////////////////////////////////////////////////
//
// meTHREEfunctions.js - function for makEasy-THREE.js scene
//
// riccardo.soldini@gmail.com
//
// last update: 01/05/17
//
/////////////////////////////////////////////////////////////////////////////////////////


var meTHREE={}


function make_rect_path(length,width)
    {
     var path = [{X:-length/2,Y:-width/2},
                 {X:length/2,Y:-width/2},
                 {X:length/2,Y:width/2},
                 {X:-length/2,Y:width/2}];

     return path
    };



function make_circle_path(diameter)
   {
     var segmentCount = 36;
     var radius = diameter/2;
     var path =[];
     for (var i = 0; i < segmentCount; i++)
       {
        var theta = (i / segmentCount) * Math.PI * 2;
        path.push({X:Math.cos(theta) * radius,
                   Y:Math.sin(theta) * radius});
       }
      return path
   };



function make_hole_path(diameter,x,y)
    {
     var segmentCount = 24;
     var radius = diameter/2;
     var hpath =[];
     for (var i = 0; i < segmentCount; i++)
      {
       var theta = -(i / segmentCount) * Math.PI * 2;
       hpath.push( {X:x + Math.sin(theta) * radius,
                    Y:y + Math.cos(theta) * radius } );
      }
     return hpath
    };


function makeRect(x,y,length,width)
{
    var shape = new THREE.Shape();
    shape.moveTo( x,y );
    shape.lineTo( x+length,y  );
    shape.lineTo( x+length,y+width  );
    shape.lineTo( x,y+width  );
    shape.lineTo( x,y );
    return shape
}


function make_rect(length,width)
    {
     var shape = new THREE.Shape();
     shape.moveTo( -length/2,-width/2 );
     shape.lineTo( length/2,-width/2  );
     shape.lineTo( length/2,width/2  );
     shape.lineTo( -length/2,width/2  );
     shape.lineTo( -length/2,-width/2 );
     return shape
    }


function make_circle(diameter)
   {
     var segmentCount = 36;
     var radius = diameter/2;
     var shape = new THREE.Shape();
     shape.moveTo( Math.cos(0) * radius,Math.sin(0) * radius );
     for (var i = 1; i <= segmentCount; i++)
       {
        var theta = (i / segmentCount) * Math.PI * 2;
        shape.lineTo( Math.cos(theta) * radius,Math.sin(theta) * radius  );
       }
      return shape
    }


function make_hole(diameter,x,y)
    {
     var segmentCount = 24;
     var radius = diameter/2;
     var hpath = new THREE.Path();
     hpath.moveTo(x + Math.sin(0) * radius,y + Math.cos(0) * radius );
     for (var i = 1; i <=segmentCount; i++)
      {
       var theta = -(i / segmentCount) * Math.PI * 2;
       hpath.lineTo( x + Math.sin(theta) * radius,y + Math.cos(theta) * radius  );
      }
     return hpath
    }


function createPath(chain,nodes)
       {
           var path=[];
           var geom;
           var idnode1=chain[0][1];
           var idnode2,idnode3;
           var circle;
           var p1,p2,p3;
           var v1,v2,v3;
           path.push([nodes[idnode1].X,nodes[idnode1].Y]);
           for (idx=0; idx<chain.length; idx++)
               {
                   geom=chain[idx][0];
                   switch(geom)
                       {
                           case 'Line':
                            idnode1=chain[idx][1];
                            idnode2=chain[idx][2];
                            path.push([nodes[idnode2].X,nodes[idnode2].Y]);
                            break;
                           case 'Arc':
                            idnode1=chain[idx][1];
                            idnode2=chain[idx][2];
                            idnode3=chain[idx][3];
                            p1=nodes[idnode1];
                            p2=nodes[idnode2];
                            p3=nodes[idnode3];
                            circle=CircleFrom3Points(p1,p3,p2);
                            v1=PointsVector(circle.Center,p1);
                            v2=PointsVector(circle.Center,p2);
                            v3=PointsVector(circle.Center,p3);
                            var CW=TriangleDirection(p1,p3,p2);
                            var ri=RadialInterpolation(circle.Center,circle.Radius,v1[1],v2[1],CW);
                            path=path.concat(ri.slice(1,ri.lenght));
                            break;
                           case 'Circle':
                            idnode1=chain[idx][1];
                            idnode2=chain[idx][2];
                            p1=nodes[idnode1];
                            p2=nodes[idnode2];
                            v1=PointsVector(p1,p2);

                            path=RadialInterpolation(p1,v1[0],0,Math.PI*2,-1);
                            break;
                           default:
                        }
               }
           return path;
       }



function drawShape(chains,nodes,boundbox)
            {
                 centerx=boundbox.Xmin+(boundbox.Xmax-boundbox.Xmin)/2
                 centery=boundbox.Ymin+(boundbox.Ymax-boundbox.Ymin)/2
                 $('table#dbmanage tbody').html('<tr></tr>');
                 var shape= new THREE.Shape();
                 var geom,idnode1,idnode2,idnode3;
                 var p1,p2,p3;
                 var v1,v2,v3;
                 var circle,center;
                 var chain=chains[0];
                 var path=createPath(chain,nodes);
                 console.log(path);
                 shape.moveTo(path[0][0]-centerx,path[0][1]-centery);
                 for (l=1; l<path.length-1; l++)
                     {shape.lineTo(path[l][0]-centerx,path[l][1]-centery);}
                 shape.lineTo(path[0][0]-centerx,path[0][1]-centery);

                 var shapeHolesPath;
                 for (cc=1; cc<chains.length; cc++)
                 {
                     var chain=chains[cc];
                     path.reverse();
                     var path=createPath(chain,nodes);
                     console.log(path);
                     var shapeHolesPath = new THREE.Path();
                     shapeHolesPath.moveTo(path[0][0]-centerx,path[0][1]-centery);
                     for (l=1; l<path.length-1; l++)
                         {shapeHolesPath.lineTo(path[l][0]-centerx,path[l][1]-centery);}
                     shapeHolesPath.lineTo(path[0][0]-centerx,path[0][1]-centery);
                     shape.holes.push(shapeHolesPath);
                 }
                 return shape;
            };


function exportSTL(object)
    {
     var exSTL = new THREE.STLExporter;
     return exSTL.parse(object);
    }


function rotateCamera(position)
      {
       var from =
           {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
            upX:camera.up.x,
            upY:camera.up.y,
            upZ:camera.up.z
           };


       var to=VIEW_POSITION[position]

       var tween = new TWEEN.Tween(from).to(to, 2000)
            .easing(TWEEN.Easing.Bounce.Out)
            .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            camera.up.set(this.upX,this.upY,this.upZ)

            camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
            .onComplete(function () {
            camera.lookAt(new THREE.Vector3(0, 0, 0));

        })
            .start();

      }


meTHREE.makeRect=makeRect
