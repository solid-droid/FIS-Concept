/* ///////////////////////////////////////////
Next-Gen Factory Information System concept 
Author: Nikhil M Jeby
Final Update: 31-JUL-20
///////////////////////////////////////////// */

let menuID=["#Tools","#layers","#Notifications","#AssetTree","#Settings"];
let layout, pstate=0, cid=0;
let REST_trigger;
let REST_trigger_interval=1000;
let AssetTree_REST=[];
let Assetbox=[], Label=[], Table=[];
let dataTable=[];
let nameList=[],referenceList=[], OnscreenList=[], OnscreenLabelList=[],OnscreenAssetList=[];
let table,selectedAsset,selectedPath;
let __assetTree=[];

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
 //creates assetTree-Hierarchy.js
    REST_AssetTree();

//Rest service to fetch path and referance data of all the assets in the plant-HandleRest.js
    initRESTservices();

//Initiates on click and on touch event listeners for menu buttons-MenuEvents.js
    initMenu();

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
 
//Temporary function to change color of assets-ToolProperties.js
    REST_trigger = setInterval(restcall, REST_trigger_interval);

//function will be triggered when all ajax calls are complete.
    $( document ).ajaxStop(function() {
      for(i=0;i<Table.length;++i)
        $("#status"+String(i)).text("Loading Complete.");
    });

};

function resetLayout()
{
    layout.moveTo(0, 0);
    layout.zoomAbs(0, 0, 1);
};


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
        
        zoomDoubleClickSpeed: 1,
        
        filterKey: function() {
            return true;
          }
        });
     
      layout.on('transform', updateLine);
}

