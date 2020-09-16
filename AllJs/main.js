/* ///////////////////////////////////////////
AEP Monitoring (Visualizer)
Author: JNIKHIL
Final Update: 23-AUG-20
///////////////////////////////////////////// */ 

let menuID=["#Tools","#layers","#Notifications","#AssetTree","#Settings"];
let layout, pstate=0, cid=0
let REST_trigger_interval=1000;
let AssetTree_REST=[];
let max_zindex=20,min_zindex=20;
let Assetbox=[], Label=[], STable=[],TTable=[];
let dataTable=[],TimeTable=[];
let nameList=[],referenceList=[], OnscreenList=[],OnscreenAssetList=[];
let table,selectedAsset="none",selectedPath;
let __assetTree=[],menuAssetTree;

let RestAPI_urlList={
 AssetRefernceList        : "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/allassetinfowithPathandID",
 DetailedTableFetch       : "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/DV/",
 TimeSeriesTableFetch     : "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/accumulators/",
 Hierarchy_AssetInfo      : "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/assetinfo",
 Hierarchy_GroupInfo      : "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/groupinfo",
 Label_AssetProperties    : "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/assetproperties/byareakeyandid/"
}
// Table DATA SHAPE
let DS_events = [
  {title:"Detailed View - Events", columns:[
      {title:"Event Name "    ,field:"eventName"    ,headerFilter:"input", headerFilterPlaceholder:"Filter..",minWidth:200  },
      {title:"Value"          ,field:"value"        ,headerFilter:"input", headerFilterPlaceholder:"Filter.."  },
      {title:"Record Time"    , field:"recordTime"  ,headerFilter:"input", headerFilterPlaceholder:"Filter..",minWidth:300  },
  ]}];
let DS_incidents = [
      {title:"Detailed View - Incidents", columns:[
          {title:"Catagory "      ,field:"incidentCategory"   ,minWidth:200 ,headerFilter:"input", headerFilterPlaceholder:"Filter.."},
          {title:"Description"    ,field:"incidentDescription" ,headerFilter:"input", headerFilterPlaceholder:"Filter.."   },
          {title:"Duration"       ,field:"duration"            ,headerFilter:"input", headerFilterPlaceholder:"Filter.."},
          {title:"Start Time"     ,field:"startTime"           ,headerFilter:"input", headerFilterPlaceholder:"Filter.."},
          {title:"End Time"       ,field:"endTime"             ,headerFilter:"input", headerFilterPlaceholder:"Filter.."},    
      ]}];

//Standard Property list for Autocompletion in label properties.
let PropertyList=["JPH ","Good Cycles ","Bad Cycles "];

//call function init() when all files are loaded
window.addEventListener('load', init);

function init(){
//Initiates on click and on touch event listeners for menu buttons-MenuEvents.js
    initMenu();

//Intitiate touch responce for input tags MenuEvents.js
    initInput();
//creates assetTree-Hierarchy.js

    REST_AssetTree();

//Rest service to fetch path and referance data of all the assets in the plant-HandleRest.js
    initRESTservices();

//Initiates on click and on touch event listeners for reset button-MenuEvents.js
    initReset();

//Initiates inputfields and buttons inside properties-ToolProperties.js
    initPropertiesContent();

//Initiates property window effects and events-MenuEvents.js
    initProperties();

//Initiates on click and on touch event listeners for tools inside tools menu-ToolCreater.js
    initTools();

//Initiates pan zoom capabilities to the screen.
    initPanZoom();

//Initiates digital clock
    initClock();

//Initiates Keyboard events
    initKeyboard();

//Initialize delete events
    initDeleteWidget();

//clear property menu
    clearProperties()

//Init z-index front back buttons in style-editor
    initzindex()

//Edit-mode in MenuEvents.js
    initEditMode()

//Temporary function to change color of assets-ToolProperties.js
    setInterval(restcall, REST_trigger_interval);
////////////////////


};

function resetLayout()
{
    layout.moveTo(0,0);
    layout.zoomAbs(0, 0, 1);

};
function initKeyboard()
{
document.onkeydown = checkKey;
function checkKey(e) {
  e = e || window.event;
  // if(e.keyCode == '46'&&$("#properties:hover").length < 1)
  // deleteWidget()
  // else
  {
  let top=parseInt($("#"+selectedAsset.id).css('transform').split(',')[5].slice(0,-1))
  let left=parseInt($("#"+selectedAsset.id).css('transform').split(',')[4])
   
    if(selectedAsset!="none"&&$("#properties:hover").length < 1)
    if (e.keyCode == '38') // up arrow      
        top=top-1>0?top-1:0
    
    else if (e.keyCode == '40') // down arrow
      top+=1

    else if (e.keyCode == '37')// left arrow
       left=left-1>0?left-1:0

    else if (e.keyCode == '39') // right arrow
       left+=1;
         
    $("#"+selectedAsset.id).css('transform','translate('+left+'px,'+top+'px)');
    updateLine()
}}
}

function initPanZoom()
{
    let area = document.querySelector('.layout');
    
    layout= panzoom(area,{
        bounds: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
          zoomSpeed: 0 ,
          pinchSpeed: 0 ,
        zoomDoubleClickSpeed: 1,
        
        filterKey: ()=> {
            return true;
          }
        });
      layout.on('transform', updateLine);
      layout.on('panstart', ()=> {
        if($("#properties:hover").length < 1)
        {
          ClearSelection()
          clearProperties()
          $("#styleMenu").hide();
        }
      });
        

      $(document).on('click',()=> {

        /////
        screenUpdate()
        if($("#properties:hover").length < 1 && !pstate){
            $("#options").hide();
            $("#style").hide();
            $("#save").hide();
            $("#delete").hide();
            $("#styleMenu").hide();
            $("#properties").css("width","120px");
        }
      })
      $(document).on('touchend',screenUpdate)
}

function screenUpdate()
{

  if(selectedAsset=="none")
  $("#styleMenu").hide();
  
  for(let asset of Label)
  {
    if(asset!=null)
    {
     $("#"+asset.id).width(asset.width)
     $("#"+asset.id).height(asset.height)
    } 
  }

  for(let asset of Assetbox)
  {
    if(asset!=null)
    {
      $("#"+asset.id).width(asset.width)
      $("#"+asset.id).height(asset.height) 
    }
  }
}


function initClock()
{

    clockUpdate();
    setInterval(clockUpdate, 1000);
}

function clockUpdate() {
    var date = new Date();
    // $('.digital-clock').css({'color': '#000', 'text-shadow': '0 0 6px #ff0'});
    function addZero(x) {
      if (x < 10) {
        return x = '0' + x;
      } else {
        return x;
      }
    }
  
    function twelveHour(x) {
      if (x > 12) {
        return x = x - 12;
      } else if (x == 0) {
        return x = 12;
      } else {
        return x;
      }
    }
  
    var h = addZero(twelveHour(date.getHours()));
    var m = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());
  
    $('.digitalclock').text(h + ':' + m + ':' + s)
    
  }

  