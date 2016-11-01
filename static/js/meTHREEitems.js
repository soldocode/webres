

function draw_sheet(item)
    {
     var meObject;        
     if (item.Project.Path)
     {
         meObject=ITEMS3D(item.Project.Path)(item);
     }   
     return meObject;
    };
    

function draw_profile(item)
    {
     var meObject = new THREE.Object3D();

     return meObject;
    };


function draw_component(item)
    {
     var meObject = new THREE.Object3D();

     return meObject;
    };
    
function draw_assembly(item)
    {
     var meObject = new THREE.Object3D();

     return meObject;
    };
    
