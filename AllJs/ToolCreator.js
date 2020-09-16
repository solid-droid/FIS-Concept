/* ///////////////////////////////////////////
AEP Monitoring (Visualizer)
Author: JNIKHIL
Final Update: 23-AUG-20
///////////////////////////////////////////// */
var table2,table1;

//Constructor function for Asset Block
function AssetBlock(id,top,left,name="Asset ",color="Asset State")
{
    this.ref_id=id;
    this.type="AssetBlock";
    this.id="btn"+String(id);
    this.path="Undefined";
    this.nodeid=null;
    this.areaid=null;
    this.z_index=20;
    this.top=String(top)+"px";
    this.left=String(left)+"px";
    this.width='100px';
    this.height='30px';
    this.name=name+String(id);
    this.alias=this.name;
    this.color=color;
    //connected to refrencing
    this.connections=[];
    this.connectionName=[[]];
    //connections from refrencing
    this.fromConnections=[];
    this.lines=[];
    this.dragable;
    this.deleted=false;
}

//Constructor function for Label Block
function LabelBlock(id,top,left,name="Label ")
{
    this.ref_id=id;
    this.type="LabelBlock";
    this.id="lbl"+String(id);
    this.path;
    this.z_index=20;
    this.nodeid=null;
    this.areaid=null;
    this.top=String(top)+"px";
    this.left=String(left)+"px";
    this.width='200px';
    this.height='50px';
    this.name=name+String(id);
    this.alias=this.name;
    this.properties=[[]];
    this.dragable;
    this.Style_Border_type="solid";
    this.Style_Font_Size="16px";
}

//Constructor function for Tabel Block
function StaticTableBlock(id,top,left,name="Detailed Table ")
{
    this.ref_id=id;
    this.type="StaticTableBlock";
    this.id="table-wrapper"+String(id);
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
    this.propertyList="";
    this.nodeidList=[];
    this.areaskeylist=[];
    this.assetNameList=[];
    this.dragable;
}

function TimeTableBlock(id,top,left,name="Time-Series Table ")
{
    this.ref_id=id;
    this.type="TimeTableBlock";
    this.id="Ttable-wrapper"+String(id);
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
    this.interval=10;
    this.nodeidList=[];
    this.areaskeylist=[];
    this.dragable;
    this.rawData=[];
    this.itemlist=[{"id" : id+"#0", "parent" : "#", "text" : "All Items", state: {selected: true,opened: false}}];
}


//function to add a static table(Detailed View Table) to the screen
function addSTable(asset) //passing reference of Table object
{
    let id= String(asset.ref_id);
    //HTML code for table
    let table='<div id="table-wrapper'+id+'" style="position:absolute;transform: translate('+asset.top+','+asset.left+');" class="TableGlobal">'+
              '<div style="position: absolute;" class="dragTable drag'+id+'"></div>'+
              '<p style="position: absolute; margin-top:5px;margin-left:5px;">'+asset.name+'</p>'+
              
              '<button id="assetToggle'+id+'"style="position: absolute; top:60px;height:28px;  margin-left:0;width: 90px;">Asset</button>'+
              
              '<p style="position: absolute; top:20px;height:28px;  margin-left:95px;width: 400px;">Start Date: <input type="datetime-local" style="width:200px;"id="sdate'+id+'"></p>'+
              '<p style="position: absolute; top:50px;height:28px;  margin-left:95px;width: 400px;">End Date : <input  type="datetime-local" style="width:200px;"id="edate'+id+'"></p>'+
              
              '<button id="tableClear'+id+'" style="position: absolute; top:30px;height:28px;  margin-left:395px;width: 90px;">Clear</button>'+
              '<button id="tableRefresh'+id+'" style="position: absolute; top:30px;height:28px;  margin-left:0;width: 90px;">Refresh</button>'+

              '<select style="position: absolute; top:63px; margin-left:395px;width:100px;height:24px;"id="prop'+id+'">'+
              '<option value="Incidents">Incidents</option>'+
              '<option value="Events">Events</option>'+
              '</select>'+

              '<p id="status'+id+'" style="font-size: 13px;position: absolute; top:55px;height:28px;  margin-left:505px;width:300px"></p>'+
              

              '<div id="assetTree'+id+'" style="margin-left:-215px;width:210px;height:300px;display:none;position: absolute; top:95px;"></div>'+
              '<div id="table-wrapper-exp'+id+'" style="min-width: 600px; position: absolute; height:300px;top:95px;border-style: solid;border-width:2px ;">'+
              '<div id="dataTable'+id+'" style="width: 100%; height:300px;"></div></div>'+
              '</div>';

    //adding the table HTML code to layout
    $("#layout").append(table);
   
    //Initializing asset Tree toggle
    $("#assetToggle"+id).on('click touchend', ()=>{     
              $("#assetTree"+id).fadeToggle();
    });

    //Initializing Refresh button
    $("#tableRefresh"+id).on('click touchend', ()=>{ 
        $("#status"+String(asset.ref_id)).text("Status: Refreshing..."); 
        asset.assetTree.setData(__assetTree);
        asset.startDate=$("#sdate"+String(asset.ref_id)).val().replace("T", '%20')+":00";
        asset.endDate=$("#edate"+String(asset.ref_id)).val().replace("T", '%20')+":00";
        asset.propertyList=$("#prop"+String(asset.ref_id)).val();
        if(asset.propertyList=="Events")
            asset.dataTable.setColumns(DS_events);
        else if(asset.propertyList=="Incidents")
            asset.dataTable.setColumns(DS_incidents);
            asset.dataTable.setData();
        for(var i=0;i<asset.nodeidList.length;++i)
        {
            let _url_=String(asset.areaskeylist[i]) + "/" + String(asset.nodeidList[i]) + "/" + asset.startDate + "/" + asset.endDate;
            REST_IncidentEventservice(asset.assetNameList[i],asset.propertyList,_url_,id);
        }

        if(asset.nodeidList.length==0)
            $("#status"+String(asset.ref_id)).text("Status: Ok");
    });
    //Initializing clear button
    $("#tableClear"+id).on('click touchend', ()=>{      
        asset.dataTable.setColumns([{title:"Select Properties"}]);
        asset.dataTable.setData();
        asset.propertyList="";
        asset.nodeidList=[];
        asset.areaskeylist=[];
        asset.assetNameList=[];
    });

    //Making the table drag-able
    asset.dragable=new PlainDraggable(document.getElementById(asset.id),
    {handle: document.querySelector('#'+asset.id+' .drag'+id),
    onDragStart: ()=>{
        ClearSelection()
        $("#"+asset.id).css("animation", "selected 1s infinite");
        selectedAsset=asset;}
    });

    //Making the table Resizable
    $( "#table-wrapper-exp"+id ).resizable({
        start: ( event, ui )=> {layout.pause(); },
        stop: ( event, ui )=> {layout.resume();},
        minHeight: 300,
        minWidth:500,
        });
    
    //setting up tabulator based asset-tree   
    asset.assetTree= new Tabulator("#assetTree"+id, {
            layout:"fitDataFill",
            movableRows:true,
            movableRowsConnectedTables:"#dataTable"+id,
            movableRowsReceiver: "add",
            tooltips:true,
           movableRowsSendingStart:()=>{
                layout.pause(); 
                
            },
             movableRowsSendingStop:()=>{
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
        
        //setting up tabulator based table for detailed view      
        let _table = new Tabulator("#dataTable"+id, {
            height:"100%",
            placeholder:"Drag Assets Here",
            movableRowsReceived:(fromRow, toRow, fromTable)=>{
                let id=asset.dataTable.getData().length-1;
                let row=asset.dataTable.getData()[id];
                handleTableDate(row.nodeid,row.area_SAKEY,asset,row.name);
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

        $('#'+asset.id).on('click touchend', ()=>{
            
            ClearSelection()
            $("#"+asset.id).css("animation", "selected 1s infinite");
            selectedAsset=asset;
            $( "#tags0" ).show();$( "#option0" ).show();
            $( "#tags2" ).show();$( "#option2" ).show();
            $("#option0").text("Table id");
            $("#edittable").hide();
            $( "#tags0" ).val(asset.name);
            $( "#tags1" ).hide();$( "#option1" ).hide();
            $( "#tags3" ).hide();$( "#option3" ).hide();
            $( "#tags4" ).hide();$( "#option4" ).hide();
            $( "#tags2" ).val(asset.alias);    
        });


}








function addAssetBox(asset)
    {
        //HTML tag for asset-box button
        let _assetbox='<div id="'+asset.id+'"class="AssetGlobal"style="width:100px;z-index:'+asset.z_index+';height:30px;text-align: center;transform: translate('+asset.top+','+asset.left+');"><h4 style ="margin-top:5px;" id="'+asset.id+'Title">'+asset.alias+'</h4></div>'
        
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
        asset.dragable=new PlainDraggable(document.getElementById(asset.id),
            {onMove: updateLine,
            onDragStart :()=>{
            ClearSelection()
            $("#"+asset.id).css("animation", "selected 1s infinite");
            selectedAsset=asset;},
            onDragEnd:()=>{
                $("#"+asset.id).css("z-index",  asset.z_index);
            }
            });//when asset box are dragged updateLine() will be called

        //Resize
        $( "#"+asset.id ).resizable({
            // handles: "se",
            // grid: 60,
            resize: updateLine,

            start: ( event, ui )=> {
                layout.pause();
                asset.dragable.disabled=true;
                

             },
            stop: ( event, ui )=> {
                layout.resume();
                asset.dragable.disabled=false;
                asset.width=$("#"+asset.id).width();
                asset.height=$("#"+asset.id).height(); 
                
            }
        });
        
        //Initializing 'on click' and 'on touch' event listeners on the asset box.
        $('#'+asset.id).on('click touchend', ()=>{
            
            ClearSelection()
            $("#"+asset.id).css("animation", "selected 1s infinite");
            table.update(['Connected To'],['text'])
            table.reset()

            //Properties that should be shown when the asset-box is clicked.
            selectedAsset=asset;
            $( "#tags0" ).show();$( "#option0" ).show();
            $( "#tags2" ).show();$( "#option2" ).show();
            $( "#tags4" ).show();$( "#option4" ).show();
            $("#option3").show();
            $("#tags3").show();
            $( "#tags1" ).show();$( "#option1" ).show();
            $("#edittable").show();
            $("#option0").text("Asset ID");
            OnscreenList=OnscreenAssetList.filter(x => x!=null && x!=selectedAsset.name);
            //setting autocomplete field
            table.loadData(asset.connectionName);//loading the existing connections
            $( "#tags0" ).val(asset.name);
            $( "#tags1" ).val(asset.path);
            $( "#tags2" ).val(asset.alias);
            $( "#tags3" ).val(asset.color);            
        });

    }

function addLabel(asset)
    {
       
        //HTML tag for label div
        let  _label='<div id="'+asset.id+'"class="LabelGlobal"style="width:200px;z-index:'+asset.z_index+';height:50px;text-align: center;transform: translate('+asset.top+','+asset.left+');"><h4 style ="margin-top:5px;" id="'+asset.id+'Title">'+asset.alias+'</h4>'+
        '<p id="'+asset.id+'Prop0"></p>'+
        '<p id="'+asset.id+'Prop1"></p>'+
        '<p id="'+asset.id+'Prop2"></p>'+
        '<p id="'+asset.id+'Prop3"></p>'+
        '<p id="'+asset.id+'Prop4"></p>'+
        '<p id="'+asset.id+'Prop5"></p>'+
        '</div>';
        $("#"+asset.id).css("border-style", asset.Style_Border_type);
        //appending _label to layout div
        $("#layout").append(_label);

        
        //pushing the asset.name(primary key) to OnscreenLabelList
        //OnscreenLabelList.push(asset.name);
        
        //making the label dragable
        asset.dragable=new PlainDraggable(document.getElementById(asset.id),{
        onDragStart: ()=>{
            ClearSelection()
            $("#"+asset.id).css("animation", "selected 1s infinite");
            selectedAsset=asset;},
        onDragEnd:()=>{
            $("#"+asset.id).css("z-index",  asset.z_index);
            }
        });

        //resize
        $( "#"+asset.id ).resizable({
            // handles: "se",
            // grid: 60,
            start: ( event, ui )=> {
                layout.pause();
                asset.dragable.disabled=true;
                

             },
            stop: ( event, ui )=> {
                layout.resume();
                asset.dragable.disabled=false;
                asset.width=$("#"+asset.id).width();
                asset.height=$("#"+asset.id).height(); 
                
            }
        });

        
            
        //Initializing 'on click' and 'on touch' event listeners on this label
        $('#'+asset.id).on('click touchend', ()=>{
            table.update(['Properties'],['text','checkbox'])
            table.reset()
            ClearSelection()
            $("#"+asset.id).css("animation", "selected 1s infinite");
            OnscreenList=[]
            $("#"+asset.id ).resizable('enable');
            RestAssetProperties(asset.areaid,asset.nodeid);
            $("#edittable").show();
            $( "#tags0" ).show();$( "#option0" ).show();
            $( "#tags2" ).show();$( "#option2" ).show();
            $( "#tags1" ).show();$( "#option1" ).show();
            $( "#tags3" ).hide();$( "#option3" ).hide();
            $( "#tags4" ).hide();$( "#option4" ).hide();
            //Properties that should be shown when label is clicked
            selectedAsset=asset;
            $("#option0").text("Label ID");
            //OnscreenList=Labelproperties; //setting autocomplete field
            table.loadData(asset.properties);//loading the existing properties
            $( "#tags0" ).val(asset.name);
            $( "#tags1" ).val(asset.path);
            $( "#tags2" ).val(asset.alias);    
        });
    }

//function to add a time table(Detailed View Table) to the screen
function addTTable(asset) //passing reference of Table object
{
    let id= String(asset.ref_id);
    //HTML code for table
    let table='<div id="'+asset.id+'" style="position:absolute;transform: translate('+asset.top+','+asset.left+');" class="TableGlobal">'+
              '<div style="position: absolute;" class="dragTable drag'+id+'"></div>'+
              '<p style="position: absolute; margin-top:5px;margin-left:5px;">'+asset.name+'</p>'+
              
              '<button id="TassetToggle'+id+'"style="position: absolute; top:60px;height:28px;  margin-left:0;width: 90px;">Asset</button>'+
              
              '<p style="position: absolute; top:20px;height:28px;  margin-left:95px;width: 400px;">Start Date: <input type="datetime-local" style="width:200px;"id="Tsdate'+id+'"></p>'+
              '<p style="position: absolute; top:50px;height:28px;  margin-left:95px;width: 400px;">End Date : <input  type="datetime-local" style="width:200px;"id="Tedate'+id+'"></p>'+
              
              '<button id="TtableClear'+id+'" style="position: absolute; top:30px;height:28px;  margin-left:395px;width: 90px;">Clear</button>'+
              '<button id="TtableRefresh'+id+'" style="position: absolute; top:30px;height:28px;  margin-left:0;width: 90px;">Refresh</button>'+

              '<select style="position: absolute; top:63px; margin-left:395px;width:100px;height:24px;"id="Tprop'+id+'">'+
              '<option value="10">10 Minutes</option>'+
              '<option value="60">Hourly</option>'+
              '</select>'+

              '<p id="Tstatus'+id+'" style="font-size: 13px;position: absolute; top:55px;height:28px;  margin-left:505px;width:300px"></p>'+
              

              '<div id="TassetTree'+id+'" style="margin-left:-215px;width:210px;height:300px;display:none;position: absolute; top:95px;"></div>'+
              '<div id="TitemFilter'+id+'" style="overflow: auto;border:3px solid rgba(65, 68, 65, 0.438) ;margin-left:-215px;width:208px;height:195px;display:none;position: absolute; top:400px;">'+
              '</div>'+
              '<div id="Ttable-wrapper-exp'+id+'" style="width: 800px; position: absolute; height:500px;top:95px;border-style: solid;border-width:2px ;">'+
              '<div id="TdataTable'+id+'" style="width: 800px; height:500px;"></div></div>'+
              '</div>';

    //adding the table HTML code to layout
    $("#layout").append(table);
   
    $("#TitemFilter"+id).on("touchstart",()=> layout.pause())
    $("#TitemFilter"+id).on("touchend",  ()=> layout.resume())

    $("#TassetTree"+id).on("touchstart",()=> layout.pause())
    $("#TassetTree"+id).on("touchend",()=> layout.resume())

    $("#TdataTable"+id).on("touchstart",()=> layout.pause())
    $("#TdataTable"+id).on("touchend",()=> layout.resume())

    

        //Initilizing Item tree
        $("#TitemFilter"+id).jstree({
            "core":{
                'data' : asset.itemlist,
        expand_selected_onload : false
            },
            "plugins": ["checkbox"],
            "checkbox": {
                "keep_selected_style": false
            },
        });
    
    //Initializing asset Tree toggle
    $("#TassetToggle"+id).on('click touchend', ()=>{     
              $("#TassetTree"+id).fadeToggle();
              $("#TitemFilter"+id).fadeToggle();
    });

    //Initializing Refresh button
    $("#TtableRefresh"+id).on('click touchend', ()=>{
        $("#Tstatus"+id).text("Status: Refreshing..."); 
        asset.assetTree.setData(__assetTree);
        asset.startDate=$("#Tsdate"+String(asset.ref_id)).val().replace("T", ' ')+":00";
        asset.endDate=$("#Tedate"+String(asset.ref_id)).val().replace("T", ' ')+":00";
        asset.interval=parseInt($("#Tprop"+String(asset.ref_id)).val());
        
        asset.dataTable.clearData();
        asset.rawData=[]
        for(var i=0;i<asset.nodeidList.length;++i)
        {
         RESTAccumulatorService(asset.nodeidList[i],asset.areaskeylist[i],asset.startDate,asset.endDate,asset.interval,asset.ref_id);
        }

        if(asset.nodeidList.length==0)
            $("#Tstatus"+id).text("Status: Ok");
    });
    //Initializing clear button
    $("#TtableClear"+id).on('click touchend', ()=>{  
        asset.dataTable.setColumns([{title:"Select Properties"}]);
        asset.dataTable.clearData();
        asset.rawData=[]
        asset.propertyList="";
        asset.nodeidList=[];
        asset.areaskeylist=[];
    });

    //Making the table drag-able
    asset.dragable=new PlainDraggable(document.getElementById(asset.id),
    {handle: document.querySelector('#'+asset.id+' .drag'+id),
    onDragStart: ()=>{
        ClearSelection()
        $("#"+asset.id).css("animation", "selected 1s infinite");
        selectedAsset=asset;
    }});

    //Making the table Resizable
    $( "#Ttable-wrapper-exp"+id ).resizable({
        start: ( event, ui )=> {layout.pause(); },
        stop:  ( event, ui )=> {layout.resume();},
        minHeight: 300,
        minWidth:800,
        maxWidth:800
        });
    
    //setting up tabulator based asset-tree   
    asset.assetTree= new Tabulator("#TassetTree"+id, {
            layout:"fitDataFill",
            movableRows:true,
            movableRowsConnectedTables:"#TdataTable"+id,
            movableRowsReceiver: "add",
            tooltips:true,
           rowClick:(e, row)=>{
                //e - the click event object
                //row - row component
                asset.startDate=$("#Tsdate"+String(asset.ref_id)).val().replace("T", ' ')+":00";
                asset.endDate=$("#Tedate"+String(asset.ref_id)).val().replace("T", ' ')+":00"; 
                asset.itemlist=createItemList(row._row.data.nodeid,row._row.data.area_SAKEY,asset.startDate,asset.endDate,asset.ref_id)
  //              console.log($("#TitemFilter"+id).jstree(true).get_selected())
                },
           movableRowsSendingStart:()=>{
           layout.pause(); 
                
            },
             movableRowsSendingStop:()=>{
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
        
        //setting up tabulator based table for detailed view      
        let _table = new Tabulator("#TdataTable"+id, {
            height:"100%",
            placeholder:"Drag Assets Here",
            movableRowsReceived:(fromRow, toRow, fromTable)=>{
                let id=asset.dataTable.getData().length-1;
                let row=asset.dataTable.getData()[id];
                let list=$("#TitemFilter"+asset.ref_id).jstree(true).get_selected()
                if(list[0]=="0#0")
                handleTableDate(row.nodeid,row.area_SAKEY,asset);
                else 
                {
                list=list.filter(x=>x.split("#")[1].charAt(0)=='c').map(x=>x.split('#c')[1])
                handleTableDate(row.nodeid,row.area_SAKEY,asset,null,list);
                }

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
        TimeTable.push(_table);
        asset.dataTable=_table;


        $( "#Tprop"+id ).change(()=> {
            console.log("Processing Data")
            let d1=$("#Tsdate"+String(asset.ref_id)).val().replace("T", ' ')+":00";
            let d2=$("#Tedate"+String(asset.ref_id)).val().replace("T", ' ')+":00"; 
            if(asset.rawData.length>0&&asset.startDate==d1&&asset.endDate==d2)
            {
                
                asset.dataTable.clearData();
                asset.interval=parseInt($("#Tprop"+String(asset.ref_id)).val());
                let _totalMinutes = (((addMinutes(asset.endDate,0)-addMinutes(asset.startDate,0))/1000)/60)/asset.interval
                
                TimeSeriesTable_process1(asset.rawData,asset.startDate,asset.interval,_totalMinutes,id)
            }  
          });

        $('#'+asset.id).on('click', ()=>{
            
            ClearSelection()
            $("#"+asset.id).css("animation", "selected 1s infinite");
            
            selectedAsset=asset;
            $( "#tags0" ).show();$( "#option0" ).show();
            $( "#tags2" ).show();$( "#option2" ).show();
            $("#option0").text("Table id");
            $("#edittable").hide();
            $( "#tags0" ).val(asset.name);
            $( "#tags1" ).hide();$( "#option1" ).hide();
            $( "#tags3" ).hide();$( "#option3" ).hide();
            $( "#tags4" ).hide();$( "#option4" ).hide();
            $( "#tags2" ).val(asset.alias);   
        });

    }


//Enable event-listeners on tools
function initTools()
{
    $('#AssetBox').on('click tap', ()=>{
        
        let top= -parseInt($('.layout').css('transform').split(',')[5].slice(0,-1))+50; //offsetting top
        let left= -parseInt($('.layout').css('transform').split(',')[4])+500;              //offsetting left
        
        let box=new AssetBlock(Assetbox.length,left,top); //Creating a new AssetBlock object
        
        Assetbox.push(box);  // pushing the reference of the new object to the assetbox array
        
        addAssetBox(Assetbox[Assetbox.length-1]); //calling addAssetBox function to create new asset-box by passing the new AssetBlock object reference
    });

    $('#Label').on('click tap', ()=>{
        
        let top= -parseInt($('.layout').css('transform').split(',')[5].slice(0,-1))+50;//offsetting top
        let left= -parseInt($('.layout').css('transform').split(',')[4])+500;             //offsetting left
        
        let box=new LabelBlock(Label.length,left,top);
        
        Label.push(box);
        
        addLabel(Label[Label.length-1]);
    });


    $('#S_Table').on('click tap', ()=>{
        
        let top= -parseInt($('.layout').css('transform').split(',')[5].slice(0,-1))+50; //offsetting top
        let left= -parseInt($('.layout').css('transform').split(',')[4])+500; //offsetting left
        
        let box=new StaticTableBlock(STable.length,left,top); //creating new static tableblock object
    
        STable.push(box); //pushing the object reference to global variable -Table
        
        addSTable(STable[STable.length-1]); //calling addSTable function to create new table by passing the new table object reference
    });

    $('#T_Table').on('click tap', ()=>{
        
        let top= -parseInt($('.layout').css('transform').split(',')[5].slice(0,-1))+10; //offsetting top
        let left= -parseInt($('.layout').css('transform').split(',')[4])+400; //offsetting left
        
        let box=new TimeTableBlock(TTable.length,left,top); //creating new time-series tableblock object
    
        TTable.push(box); //pushing the object reference to global variable -Table
        
        addTTable(TTable[TTable.length-1]); //calling addTTable function to create new table by passing the new table object reference
    });


}

