/* ///////////////////////////////////////////
Next-Gen Factory Information System concept 
Author: Nikhil M Jeby
Final Update: 12-JUL-20
///////////////////////////////////////////// */

function initMenu()
{
//making menu draggable
    menu = new PlainDraggable(document.getElementById('menu'));
   
//making the dragging restricted in only vertical plane
    menu.containment = {left: 0, top: 100, width: 0, height: '80%'};

//Initialising the toggle of each menu button.

   for(i of menuID)
        $(i+"btn").on('click touchend', function(){//adding event listener to all menu buttons
 
            // e.preventDefault();
                    
            $('#'+this.id.slice(0,-3)).fadeToggle(); //id of sub-menu of clicked menu is made to fadetogle
            
            hideSubMenu(this.id.slice(0,-3));//hides rest of the sub-menus.
        });
//Initialise menu asset tree
    initMenuAssetTree()

//Layers Menu
    initLayers()

}

function initLayers()
{
    $("#properties").hide() 
    $("#LayerSave").on('click touchend',LayerUpdation);

    $( "#PlantLayer" ).selectable({
        selected: function( event, ui ) {
            $('#MyLayer .ui-selected').removeClass('ui-selected')
        },
        selecting: function(event, ui){
            if( $("#PlantLayer .ui-selected,#PlantLayer .ui-selecting").length > 1){
                  $(ui.selecting).removeClass("ui-selecting");
            }
      }
    });

    $( "#MyLayer" ).selectable({
        selected: function( event, ui ) {
            $('#PlantLayer .ui-selected').removeClass('ui-selected')
        },
        selecting: function(event, ui){
            if( $("#MyLayer .ui-selected,#MyLayer .ui-selecting").length > 1){
                  $(ui.selecting).removeClass("ui-selecting");
            }
      }
    });

}

function initInput()
{
    $("#tags1").on('click touchend', function () {
        $(this).select();
    });
    $("#tags2").on('click touchend', function () {
        $(this).select();
    });
    $("#tags3").on('click touchend',  function () {
        $(this).select();
    });
    $("#border-type").on('click touchend',  function () {
        $(this).select();
    });
    $("#Bg-color").on('click touchend',  function () {
        $(this).select();
    });
    $("#font-color").on('click touchend',  function () {
        $(this).select();
    });
    $("#font-size").on('click touchend',  function () {
        $(this).select();
    });
    $("#font-type").on('click touchend',  function () {
        $(this).select();
    });

    $(".FullMenu").on('touchstart', function () {
        layout.pause();
    });
    $(".FullMenu").on('touchend', function () {
        layout.resume();
    });
    
    $("#properties").on('mousedown touchstart', function () {
        layout.pause();
    });
    $("#properties").on('mouseup touchend', function () {
        layout.resume();
    });


}

function hideSubMenu(open="all")
{
    if(open=="all")  //Making all sub-menus hidden by default
        for(i of menuID)
            $(i).hide();
    else
        for(i of menuID) //if open has an id, makes all submenus hidden exept for the submenu with open as id.
            if(i!='#'+open)
                $(i).hide();
}

function initReset()
{
    $("#Reset").on('click touchend', resetLayout);
    
    $("#Reset").on('click touchend', resetLayout);
}

function initProperties()
{
    //autocomplete for the path
    $("#tags1").autocomplete({ 
        source: nameList });

    //updateBlock() will be called when save button inside properties is clicked
    $('#save').on('click touchend', ()=>{
        
        updateBlock();
    });

    $('#style').on('click touchend', ()=>{
        if(selectedAsset!="none")
        $("#styleMenu").toggle();
    });
   
    //Make the propertiess stick to the screen open using the check-box
    $('.neumorphic-checkbox').on('click touchend', function(){
        
        $(this).toggleClass('neumorphic-checkbox_active');
    
        pstate=!pstate;
        
    });
      
    //togle on hower of properties
    $('#properties').on('touchend', function(){
       
        if($(this).width()!="300")
        {
            $(this).css("width","300px");
            $("#options").show();
            $("#save").show();
            $("#delete").show();
            $("#style").show();
            $("#LayerSave").show();
        }
        else
        {
            if(!pstate){
                $("#options").hide();
                $("#style").hide();
                $("#save").hide();
                $("#delete").hide();
                $("#styleMenu").hide();
                $("#LayerSave").hide();
                $("#properties").css("width","120px");
            }
        }
        
    });

    $("#properties").hover(function(e) {         
        
        if(!pstate)
        {
            if(e.type=== "mouseenter")
            {
                
                $(this).css("width","300px");
                
                $("#options").show();
                $("#save").show();
                $("#delete").show();
                $("#style").show();
                $("#LayerSave").show();
            }
            else
            {
                // $("#options").hide();
                // $("#style").hide();
                // $("#save").hide();
                // $("#delete").hide();
                // $("#styleMenu").hide();
                
                // $(this).css("width","120px");
            }
        }
    });


}


function initMenuAssetTree() //Creates Asset Tree Menu
{
    menuAssetTree =new Tabulator("#hierarchy_Menu", {
        layout:"fitDataFill",
        tooltips:true,
        data: __assetTree,
        dataTree:true,
        height:450,
        dataTreeStartExpanded:false,
        rowClick:(e, row)=>{

            let id=row._row.data.nodeid
            let sakey=row._row.data.area_SAKEY
//              console.log($("#TitemFilter"+id).jstree(true).get_selected())
            },
        columns:
        [
        {title:"", field:"name", minWidth:180,width :'99%', responsive:0}, //never hide this column
        ],
    });

    
    
}

function initEditMode()
{
    $('#Edit-mode').change(()=>{
    if($('#Edit-mode').prop('checked')==true)
    {
        $("#properties").show() 
        $("#Toolsbtn").show() 
    }
    else
    {
       $("#properties").hide() 
       $("#Toolsbtn").hide() 
    }
    })
}


async function LayerUpdation()
{  
    layout.pause()
    Swal.fire({
        title: 'Save / Export Layer',
        html:
          '<input id="swal-input1" class="swal2-input" value="MycustomLayer1">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value
          ]
        },
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        denyButtonText: `Import`,
        cancelButtonText: `Export`,
        cancelButtonColor: '#3085d6',
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#3085d6',
        allowOutsideClick: false,
        showCloseButton: true
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        console.log(result)
        if (result.isConfirmed) {
          Swal.fire('Saved to cloud!', '', 'success').then((result) => {
            if (result.isConfirmed) {layout.resume()}})

        } else if (result.isDenied) {
            LayerImport()
        }
        else if (result.isDismissed&&result.dismiss== "cancel") {
            Swal.fire('Export Success!', '', 'success').then((result) => {
                if (result.isDenied) {layout.resume()}})
        }
    })
      


}

async function LayerImport()
{

    await Swal.fire({
        text: 'Select layer config file for import',
        input: 'file',
        inputAttributes: {
          'accept': 'application/JSON',
          'aria-label': 'Upload your local Layer.json'
        },
        showCancelButton: true,
        confirmButtonText: `Import`,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#3085d6',
      }).then((result) => {
        if(result.isConfirmed)
        {
            layout.resume()
            if (result.value) { 
                Swal.fire('Import Success!', '', 'success').then((result) => {
                    if (result.isConfirmed) {layout.resume()}})
              }
              else
              {
                Swal.fire('File not recognised', '', 'error').then((result) => {
                    if (result.isConfirmed) {layout.resume()}}) 
              }
        }
      })

}