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
        $(i+"btn").on('click touchend', function(e){//adding event listener to all menu buttons
 
            e.preventDefault();
                    
            $('#'+this.id.slice(0,-3)).fadeToggle(); //id of sub-menu of clicked menu is made to fadetogle
            
            hideSubMenu(this.id.slice(0,-3));//hides rest of the sub-menus.
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
    $('#save').on('click touchend', function(){
        
        updateBlock();
    });
   
    //Make the propertiess stick to the screen open using the check-box
    $('.neumorphic-checkbox').on('click touchend', function(){
        
        $(this).toggleClass('neumorphic-checkbox_active');
    
        pstate=!pstate;
        
    });
      
    //togle on hower of properties
    $("#properties").hover(function(e) {         
        
        if(!pstate)
        {
            if(e.type=== "mouseenter")
            {
                
                $(this).css("width","300px");
                
                $("#options").show();
            }
            else
            {
                $("#options").hide();
                
                $(this).css("width","120px");
            }
        }
    });
}

