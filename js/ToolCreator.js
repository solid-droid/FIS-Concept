/* ///////////////////////////////////////////
Next-Gen Factory Information System concept 
Author: Nikhil M Jeby
Final Update: 31-JUL-20
///////////////////////////////////////////// */
var table2,table1;

//Constructor function for Asset Block
function AssetBlock(id,top,left,name="Asset ",color="Asset State")
{
    this.ref_id=id;
    this.type="AssetBlock";
    this.id="btn"+String(id);
    this.path="Undefined";
    this.nodeid;
    this.areaid;
    this.top=String(top)+"px";
    this.left=String(left)+"px";
    this.name=name+String(id);
    this.alias=this.name;
    this.color=color;
    this.connections=[[]];
    this.connectionName=[[]];
    this.lines=[];
}

//Constructor function for Label Block
function LabelBlock(id,top,left,name="Label ")
{
    this.ref_id=id;
    this.type="LabelBlock";
    this.id="lbl"+String(id);
    this.path;
    this.nodeid;
    this.areaid;
    this.top=String(top)+"px";
    this.left=String(left)+"px";
    this.name=name+String(id);
    this.alias=this.name;
    this.properties=[[]];
}

//Constructor function for Tabel Block
function TableBlock(id,top,left,name="Table ")
{
    this.ref_id=id;
    this.type="TabelBlock";
    this.id="table"+String(id);
    this.nodeid;
    this.areaid;
    this.top=String(top)+"px";
    this.left=String(left)+"px";
    this.name=name+String(id);
    this.alias=this.name;
    this.assetTree;
    this.dataTable;
    this.startDate;
    this.endDate;
    this.propertyList=[""];
    this.nodeidList=[];
    this.areaskeylist=[];
}


//function to add a table to the screen
function addTable(asset) //passing reference of cre
{
    let id= String(asset.ref_id);
    console.log(id);
    let table='<div id="table-wrapper'+id+'" style="position:absolute;top:'+asset.top+';left:'+asset.left+';width: 600px; height: 340px;">'+
              '<div style="position: absolute; padding-left:40px;">'+
              
              '<button id="assetToggle'+id+'"style="position: absolute; top:-10px;height:28px;  margin-left:165px;width: 90px;">Asset</button>'+
              
              '<p style="position: absolute; top:-50px;height:28px;  margin-left:260px;width: 400px;">Start Date: <input type="datetime-local" style="width:200px;"id="sdate'+id+'"></p>'+
              '<p style="position: absolute; top:-20px;height:28px;  margin-left:260px;width: 400px;">End Date : <input  type="datetime-local" style="width:200px;"id="edate'+id+'"></p>'+
              
              '<button id="tableClear'+id+'" style="position: absolute; top:-40px;height:28px;  margin-left:560px;width: 90px;">Clear</button>'+
              '<button id="tableRefresh'+id+'" style="position: absolute; top:-40px;height:28px;  margin-left:165px;width: 90px;">Refresh</button>'+
              '<button class="drag'+id+'"style="position: absolute; top:-10px;height:28px;  margin-left:560px;width: 90px;">Drag</button>'+

              '<select style="position: absolute; top:-40px; margin-left:660px;width:100px;height:24px;"id="prop'+id+'">'+
              '<option value="Incidents">Incidents</option>'+
              '<option value="Events">Events</option>'+
              '</select>'+

              '<p id="status'+id+'" style="font-size: 13px;position: absolute; top:-15px;height:28px;  margin-left:660px;width:300px"></p>'+
              '</div>'+

              '<div id="assetTree'+id+'" style="display:none;position: absolute; top:25px;"></div>'+
              '<div id="table-wrapper-exp'+id+'" style="min-width: 600px; position: absolute; top:25px;margin-left:205px;border-style: solid;border-width:2px ;">'+
              '<div id="dataTable'+id+'" style="width: 100%;"></div></div>'+
              '</div>';
    $("#layout").append(table);
   
    $("#assetToggle"+id).on('click touchend', function(e){     
              $("#assetTree"+id).fadeToggle();
    });
    $("#tableRefresh"+id).on('click touchend', function(e){ 

        $("#status"+id).text("Status: Refreshing..."); 
        asset.assetTree.setData(__assetTree);
        asset.startDate=$("#sdate"+String(asset.ref_id)).val().replace("T", '%20')+":00";
        asset.endDate=$("#edate"+String(asset.ref_id)).val().replace("T", '%20')+":00";
        asset.propertyList[0]=$("#prop"+String(asset.ref_id)).val();
        if(asset.propertyList[0]=="Events")
            asset.dataTable.setColumns(DS_events);
        else if(asset.propertyList[0]=="Incidents")
            asset.dataTable.setColumns(DS_incidents);
            asset.dataTable.setData();
    for(var i=0;i<asset.nodeidList.length;++i)
    {
        let _url_=String(asset.areaskeylist[i]) + "/" + String(asset.nodeidList[i]) + "/" + asset.startDate + "/" + asset.endDate;
        REST_IncidentEventservice(asset.propertyList[0],_url_,id);
    }
    if(asset.nodeidList.length==0)
        $("#status"+id).text("Status: ok");
    });

    $("#tableClear"+id).on('click touchend', function(e){      
        asset.dataTable.setColumns([{title:"Select Properties"}]);
        asset.dataTable.setData();
        asset.propertyList[0]="";
        asset.nodeidList=[];
        asset.areaskeylist=[];
    });
    new PlainDraggable(document.getElementById('table-wrapper'+id),
    {handle: document.querySelector('#table-wrapper'+id+' .drag'+id)});

    $( "#table-wrapper-exp"+id ).resizable({
        start: function( event, ui ) {layout.pause(); },
        stop: function( event, ui ) {layout.resume();},
        minHeight: 300,
        minWidth:500,
        });
    
    asset.assetTree= new Tabulator("#assetTree"+id, {
            layout:"fitDataFill",
            movableRows:true,
            movableRowsConnectedTables:"#dataTable"+id,
            movableRowsReceiver: "add",
            tooltips:true,
           movableRowsSendingStart:function(){
                layout.pause(); 
                
            },
             movableRowsSendingStop:function(){
                layout.resume();
            },
            data: __assetTree,
            dataTree:true,
            dataTreeStartExpanded:false,
            columns:
            [
            {title:"Asset Tree", field:"name", minWidth :200, responsive:0}, //never hide this column
            ],
        });
        
              
        let _table = new Tabulator("#dataTable"+id, {
            height:"100%",
            placeholder:"Drag Assets Here",
            movableRowsReceived:function(fromRow, toRow, fromTable){
                let id=asset.dataTable.getData().length-1;
                let row=asset.dataTable.getData()[id];
                handleTableDate(row.nodeid,row.area_SAKEY,asset);
                asset.dataTable.getRows()[id]._row.delete();
                },
            groupBy:"assetName",
            data:[],
            autoResize:false,
             layout:"fitData",
            columns:[
                        {title:"Select Properties"}
                    ],
        });
        dataTable.push(_table);
        asset.dataTable=_table;


}



function handleTableDate(id,sakey,asset)
{
    asset.nodeidList.push(id);
    asset.areaskeylist.push(sakey);
    asset.startDate=$("#sdate"+String(asset.ref_id)).val().replace("T", '%20')+":00";
    asset.endDate=$("#edate"+String(asset.ref_id)).val().replace("T", '%20')+":00";
    if(asset.propertyList[0]=="")
        asset.propertyList[0]=$("#prop"+String(asset.ref_id)).val();

    if(asset.propertyList[0]=="Events")
        asset.dataTable.setColumns(DS_events);
    else if(asset.propertyList[0]=="Incidents")
        asset.dataTable.setColumns(DS_incidents);
    let _url_=String(sakey) + "/" + String(id) + "/" + asset.startDate + "/" + asset.endDate;
    console.log(_url_);
    REST_IncidentEventservice(asset.propertyList[0],_url_,String(asset.ref_id));
};






function addAssetBox(asset)
    {
        //HTML tag for asset-box button
        let _assetbox='<button id="'+asset.id+'"class="AssetGlobal"style="text-align: center;transform: translate('+asset.top+','+asset.left+');">'+asset.alias+'</button>'
        
        //appending the assetbox to layout div
        $("#layout").append( _assetbox);
        
        //Pushing asset.name(primary key) to OnscreenAssetList for autocompletion.
        OnscreenAssetList.push(asset.name);
        
        //Creates a arrow path between assets if predefined
        for (let i=0;i<asset.connections.length;i++) //asset.connection holds list of connected asset.name
        {
            let line=drawLine(asset.id,asset.connections[i][0]); //drawLine() is used to draw arrow between the connected assets
            
            if(line!=="none") //if the return is not "none" push the reference of line object to asset.lines.
                asset.lines.push(line);   
        }
        
        //making the asset box dragable
        new PlainDraggable(document.getElementById(asset.id),{onMove: updateLine});//when asset box are dragged updateLine() will be called

        //Initializing 'on click' and 'on touch' event listeners on the asset box.
        $('#'+asset.id).on('click touchend', function(){
            
            //Properties that should be shown when the asset-box is clicked.
            selectedAsset=asset;
            $("#option3").show();
            $("#tags3").show();
            $("#option0").text("Asset ID");
            OnscreenList=OnscreenAssetList; //setting autocomplete field
            table.loadData(asset.connectionName);//loading the existing connections
            $("#header0").text("Connected to");
            $( "#tags0" ).val(asset.name);
            $( "#tags1" ).val(asset.path);
            $( "#tags2" ).val(asset.alias);
            $( "#tags3" ).val(asset.color);            
        });
    }

function addLabel(asset)
    {
       
        //HTML tag for label div
        let  _label='<div id="'+asset.id+'"class="LabelGlobal"style="text-align: center;transform: translate('+asset.top+','+asset.left+');"><h4 style="" id="'+asset.id+'Title">'+asset.alias+'</h4>'+
        '<p id="'+asset.id+'Prop0"></p>'+
        '<p id="'+asset.id+'Prop1"></p>'+
        '<p id="'+asset.id+'Prop2"></p>'+
        '<p id="'+asset.id+'Prop3"></p>'+
        '<p id="'+asset.id+'Prop4"></p>'+
        '<p id="'+asset.id+'Prop5"></p>'+
        '</div>';
        
        //appending _label to layout div
        $("#layout").append(_label);
        
        //pushing the asset.name(primary key) to OnscreenLabelList
        OnscreenLabelList.push(asset.name);
        
        //making the label dragable
        new PlainDraggable(document.getElementById(asset.id));

        //Initializing 'on click' and 'on touch' event listeners on this label
        $('#'+asset.id).on('click', function(){

            //Properties that should be shown when label is clicked
            selectedAsset=asset;
            $("#option3").hide();
            $("#tags3").hide();
            $("#option0").text("Label ID");
            OnscreenList=PropertyList;  //setting autocomplete field
            table.loadData(asset.properties);//loading the existing properties
            $("#header0").text("Properties");
            $( "#tags0" ).val(asset.name);
            $( "#tags1" ).val(asset.path);
            $( "#tags2" ).val(asset.alias);    
        });
    }

function initTools()
{
    $('#AssetBox').on('click touchend', function(){
        
        let left= -parseInt($('.layout').css('transform').split(',')[5].slice(0,-1))+300; //offsetting left
        let top= -parseInt($('.layout').css('transform').split(',')[4])+500;              //offsetting right
        
        let box=new AssetBlock(Assetbox.length,top,left); //Creating a new AssetBlock object
        
        Assetbox.push(box);  // pushing the reference of the new object to the assetbox array
        
        addAssetBox(Assetbox[Assetbox.length-1]); //calling addTable function to create new asset-box by passing the new AssetBlock object reference
    });

    $('#Label').on('click touchend', function(){
        
        let left= -parseInt($('.layout').css('transform').split(',')[5].slice(0,-1))+300;//offsetting left
        let top= -parseInt($('.layout').css('transform').split(',')[4])+500;             //offsetting right
        
        let box=new LabelBlock(Label.length,top,left);
        
        Label.push(box);
        
        addLabel(Label[Label.length-1]);
    });


    $('#Table').on('click touchend', function(){
        
        let left= -parseInt($('.layout').css('transform').split(',')[5].slice(0,-1))+300; //offsetting left
        let top= -parseInt($('.layout').css('transform').split(',')[4])+200; //offsetting right
        
        let box=new TableBlock(Table.length,top,left); //creating new tableblock object
    
        Table.push(box); //pushing the object reference to global variable -Table
        
        addTable(Table[Table.length-1]); //calling addTable function to create new table by passing the new table object reference
    });


}



function drawLine(id1, id2)
{
    try{
        
        let line =new LeaderLine(
            document.getElementById(id1),
            document.getElementById(id2)
        );
        line.path='grid';
        return line;
    
    }catch(e)
    {
        return "none";
    }
}


function updateLine()
{
   for(x of Assetbox) 
        for(i of x.lines)
            i.position();
    
}

function updateBlock()
{
   if(selectedAsset.type=="AssetBlock")
    updateAssetBlock(selectedAsset);
   else if(selectedAsset.type=="LabelBlock")
    updateLabelBlock(selectedAsset);
}

function updateLabelBlock(asset)
{
    asset.path  = $("#tags1"). val();
    asset.alias = $("#tags2"). val();
    $("#"+asset.id+"Title").text(asset.alias);
    asset.properties=table.getData();
    for(i=0;i<6;++i)
    $("#"+asset.id+"Prop"+String(i)).text("");
    if(asset.properties[0][0]!="")
    for(i=0;i<asset.properties.length;++i)
    {
        $("#"+asset.id+"Prop"+String(i)).text(asset.properties[i][0]+" : "+String(parseInt(Math.random()*100)));
    }
}


function updateAssetBlock(asset)
{
    asset.path  = $("#tags1"). val();
    asset.alias = $("#tags2"). val();
    $("#"+asset.id).text(asset.alias);
  
    asset.connectionName=table.getData();
    asset.connections=[[]];

    
    for(x of Assetbox)
        for(y of asset.connectionName)
            if(x.name===y[0])
                asset.connections.push([x.id]);
    
    for(x of asset.lines)
        x.remove();

    asset.lines=[];
    
    for (let i=0;i<asset.connections.length;i++)
    {
        let line=drawLine(asset.id,asset.connections[i][0]);
        
        if(line!=="none")
            asset.lines.push(line);
    }
    selectedPath=asset.path ;
    let index = nameList.findIndex(checkNameList);
    if(~index)
    {
     asset.nodeid=referenceList[index].nodeid;
     asset.areaid=referenceList[index].areaSAKEY;
    }
}

function checkNameList(namelist) {
    return namelist == selectedPath;
  }
  
