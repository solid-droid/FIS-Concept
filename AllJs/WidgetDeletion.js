

function initDeleteWidget()
{

$("#delete").on("click tap",deleteWidget)

}

function deleteWidget()
{
  layout.pause()
switch(selectedAsset.type)
    {
        case "AssetBlock"       : if(selectedAsset.fromConnections.length<1 && selectedAsset.connections.length<1)
                                  {
                                   
                                    Swal.fire({
                                      text: "Do you want to delete the Asset-box",
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Delete',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        
                                        $("#"+selectedAsset.id ).remove();
                                        selectedAsset.deleted=true;
                                        delete OnscreenAssetList[selectedAsset.ref_id]
                                        ClearSelection()
                                        clearProperties()
                                        layout.resume()
                                      }
                                    })
                                    
                                  }
                                  else
                                  {
                                    Swal.fire({
                                      icon: 'error',
                                      text: 'Please remove all connections to and from the asset before deleting',
                                    }).then((result) => {
                                      if (result.isConfirmed) {layout.resume()}})
                                   
            
                                  }  


        break;
        case "LabelBlock"       : 
        

                                Swal.fire({
                                  text: "Do you want to delete the Label",
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#3085d6',
                                  cancelButtonColor: '#d33',
                                  confirmButtonText: 'Delete'
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    
                                  $("#"+selectedAsset.id ).remove();
                                  delete Label[selectedAsset.ref_id]
                                  ClearSelection()
                                  clearProperties()
                                  layout.resume()
                                  }
                                })


        break;
        case "StaticTableBlock" : 
        
                                  Swal.fire({
                                  text: "Do you want to delete the Detailed Table",
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#3085d6',
                                  cancelButtonColor: '#d33',
                                  confirmButtonText: 'Delete'
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    
                                    $("#"+selectedAsset.id ).remove();
                                    delete STable[selectedAsset.ref_id]
                                    ClearSelection()
                                    clearProperties()
                                    layout.resume()
                                  }
                                })
        break;
        case "TimeTableBlock"   : 
                                  
                                  Swal.fire({
                                  text: "Do you want to delete the Time Series Table",
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#3085d6',
                                  cancelButtonColor: '#d33',
                                  confirmButtonText: 'Delete'
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                     $("#"+selectedAsset.id ).remove();
                                     delete TTable[selectedAsset.ref_id]
                                     ClearSelection()
                                     clearProperties()
                                     layout.resume()
                                  }})
        
        break;

    }

    
}




function deleteWidget__()
{

switch(selectedAsset.type)
    {
        case "AssetBlock"       : if(selectedAsset.fromConnections.length<1 && selectedAsset.connections.length<1)
                                  {
                                                                     
                                    var r = confirm("Are you sure you want to delete the Asset-box");
                                    if (r == true) {
                                        $("#"+selectedAsset.id ).remove();
                                        selectedAsset.deleted=true;
                                        delete OnscreenAssetList[selectedAsset.ref_id]
                                    } 
                                  }
                                  else
                                  {
                                      alert("Please remove all connections to and from the asset before deleting")
                                  }  


        break;
        case "LabelBlock"       : var r = confirm("Are you sure you want to delete the Label");
                                 if (r == true) {
                                  $("#"+selectedAsset.id ).remove();
                                  delete Label[selectedAsset.ref_id]
                                 }


        break;
        case "StaticTableBlock" : var r = confirm("Are you sure you want to delete the Detailed Table");
                                  if (r == true) {
                                    $("#"+selectedAsset.id ).remove();
                                    delete STable[selectedAsset.ref_id]
                                  }
        break;
        case "TimeTableBlock"   : var r = confirm("Are you sure you want to delete the Time-series Table");
                                  if (r == true) {
                                     $("#"+selectedAsset.id ).remove();
                                     delete TTable[selectedAsset.ref_id]
                                  }
        
        break;

    }
    ClearSelection()
    clearProperties()
}
