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

    reset=document.getElementById('Reset');
    FastClick.attach(reset);
    reset.addEventListener('touchend', function(e) {
        if(!Document.fullscreen)
        document.documentElement.requestFullscreen();
        resetLayout();}, false);
    reset.addEventListener('click', function(e) {
        if(!Document.fullscreen)
        document.documentElement.requestFullscreen();
        resetLayout();}, false);
     
    itm=document.getElementById("btn-menu-close");
    FastClick.attach(itm);
    itm.addEventListener('touchend', function(e) {
        closesubmenu();}, false);
    itm.addEventListener('click', function(e) {
        closesubmenu();}, false);

    
    
    FastClick.attach(document.getElementById(menuID[0]+"btn"));
    document.getElementById(menuID[0]+"btn").addEventListener('touchend', function(e) {
        enablesubmenu(menuID[0]);}, false);
    document.getElementById(menuID[0]+"btn").addEventListener('click', function(e) {
        enablesubmenu(menuID[0]);}, false);

    FastClick.attach(document.getElementById(menuID[1]+"btn"));
    document.getElementById(menuID[1]+"btn").addEventListener('touchend', function(e) {
        enablesubmenu(menuID[1]);}, false);
    document.getElementById(menuID[1]+"btn").addEventListener('click', function(e) {
        enablesubmenu(menuID[1]);}, false);

    FastClick.attach(document.getElementById(menuID[2]+"btn"));
    document.getElementById(menuID[2]+"btn").addEventListener('touchend', function(e) {
        enablesubmenu(menuID[2]);}, false);
    document.getElementById(menuID[2]+"btn").addEventListener('click', function(e) {
        enablesubmenu(menuID[2]);}, false);

    FastClick.attach(document.getElementById(menuID[3]+"btn"));
    document.getElementById(menuID[3]+"btn").addEventListener('touchend', function(e) {
        enablesubmenu(menuID[3]);}, false);
    document.getElementById(menuID[3]+"btn").addEventListener('click', function(e) {
        enablesubmenu(menuID[3]);}, false);

    FastClick.attach(document.getElementById(menuID[4]+"btn"));
    document.getElementById(menuID[4]+"btn").addEventListener('touchend', function(e) {
        enablesubmenu(menuID[4]);}, false);
    document.getElementById(menuID[4]+"btn").addEventListener('click', function(e) {
        enablesubmenu(menuID[4]);}, false);
    

        


  
    

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
        console.log(id);
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

