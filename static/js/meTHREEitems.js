

function make_sheet(item)
    {
     var meObject;        
     if (item.Project.Path)
     {
         meObject=ITEMS3D(item.Project.Path)(item);
     }   
     return meObject;
    };
    

function make_profile(item)
    {
     var meObject = new THREE.Object3D();

     return meObject;
    };


function make_component(item)
    {
     var meObject = new THREE.Object3D();

     return meObject;
    };
    
function make_assembly(item)
    {
     var meObject = new THREE.Object3D();

     return meObject;
    };
    
