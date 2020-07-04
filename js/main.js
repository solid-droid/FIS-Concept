/* ///////////////////////////////////////////
Next-Gen Factory Information System concept 
Author: Nikhil M Jeby
Final Update: 6-JUL-20
///////////////////////////////////////////// */
let menuID=["Tools","layers","Notifications","AssetTree","Settings"];
window.addEventListener('load', function() {init();});
let layout;
let line;
function init(){

    // 'use strict';
  
    menu = new PlainDraggable(document.getElementById('menu'));
    menu.containment = {left: 0, top: 100, width: 0, height: '80%'}
    line=new LeaderLine(
        document.getElementById('label1'),
        document.getElementById('label2')
      );
    label1 = new PlainDraggable(document.getElementById('label1'),{onDragEnd: function() { line.position(); }});
    label2 = new PlainDraggable(document.getElementById('label2'),{onDragEnd: function() { line.position(); }});

    let area = document.querySelector('.layout');
    layout= panzoom(area,{
        bounds: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }
      });
    
      layout.on('transform', function(e) {
        line.position();
      });



     document.getElementById('menu1').addEventListener("touchend", enablesubmenu('Tools'));
      
};

function update()
{
    line.position();
}

function resetLayout()
{
    layout.moveTo(0, 0);
    layout.zoomAbs(0, 0, 1);
};


function enablesubmenu(id){
    var i;
    for (i of menuID)
        document.getElementById(i).style.visibility = "hidden";
    document.getElementById(id).style.visibility = "visible";
    document.getElementById("btn-menu-close").style.visibility = "visible";
};
 
function closesubmenu()
{
    var i;
    for (i of menuID)
        document.getElementById(i).style.visibility = "hidden";
        document.getElementById("btn-menu-close").style.visibility = "hidden";
};

