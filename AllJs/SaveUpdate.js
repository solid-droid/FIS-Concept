//function to handle the data changes of detailed table
function handleTableDate(id,sakey,asset,name,list=null)
{
    console.log("Data URL forming")
    for(let i of asset.nodeidList)
    for(let j of asset.areaskeylist)
    {
        if(i==id&&j==sakey)
        return 0
    }
    asset.nodeidList.push(id);
    asset.areaskeylist.push(sakey);
    

    if(asset.type=="StaticTableBlock")
    {       
        if(asset.propertyList=="")
        asset.propertyList=$("#prop"+String(asset.ref_id)).val();
        asset.assetNameList.push(name)
        asset.startDate=$("#sdate"+String(asset.ref_id)).val().replace("T", '%20')+":00";
        asset.endDate=$("#edate"+String(asset.ref_id)).val().replace("T", '%20')+":00"; 
        if(asset.propertyList=="Events")
            asset.dataTable.setColumns(DS_events);
        else if(asset.propertyList=="Incidents")
            asset.dataTable.setColumns(DS_incidents);
        let _url_=String(sakey) + "/" + String(id) + "/" + asset.startDate + "/" + asset.endDate;
        REST_IncidentEventservice(name,asset.propertyList,_url_,String(asset.ref_id));
    }
    else if(asset.type=="TimeTableBlock")
    {
        asset.startDate=$("#Tsdate"+String(asset.ref_id)).val().replace("T", ' ')+":00";
        asset.endDate=$("#Tedate"+String(asset.ref_id)).val().replace("T", ' ')+":00"; 
        asset.interval=parseInt($("#Tprop"+String(asset.ref_id)).val());
       if(list==null)
        RESTAccumulatorService(id,sakey,asset.startDate,asset.endDate,asset.interval,String(asset.ref_id));
       else
        list.forEach(x => RESTAccumulatorService(id,sakey,asset.startDate,asset.endDate,asset.interval,String(asset.ref_id),x))
       
    }

};


//function to draw arrow path between assets
function drawLine(id1, id2)
{
    try{
        
        let line =new LeaderLine(
            document.getElementById(id1),
            document.getElementById(id2)
        );
        line.path='grid';
        line.size= 3;
        line.color='black';
        // line.setOptions({startSocket: 'right', endSocket: 'left'});
        line.setOptions({
            startSocketGravity: [0,0],
            endSocketGravity: [0, 0]
          });
        return line;
    
    }catch(e)
    {
        return "none";
    }
}

//function to update arrow path 
function updateLine()
{
   for(x of Assetbox)
    // if(x!=null)
        for(i of x.lines)
            i.position();

}

//function to update a block on clicking save button in properties
function updateBlock()
{
   if(selectedAsset.type=="AssetBlock")
    updateAssetBlock(selectedAsset);
   else if(selectedAsset.type=="LabelBlock")
    updateLabelBlock(selectedAsset);

if(selectedAsset.type=="AssetBlock"||selectedAsset.type=="LabelBlock")
   Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Properties Applied Locally',
    footer: 'Save layer for latter use',
    showConfirmButton: false,
    timer: 1500
      }) 
}

//function to update Label block
function updateLabelBlock(asset)
{
    asset.path  = $("#tags1"). val();
    asset.alias = $("#tags2"). val();
    $("#"+asset.id+"Title").text(asset.alias);

    asset.properties=table.getData();
    for(i=0;i<6;++i)
    $("#"+asset.id+"Prop"+String(i)).text("");
    
    asset.Style_Border_type = $("#border-type"). val();
    $("#"+asset.id).css("border-style", asset.Style_Border_type);

    asset.Style_Font_Size = $("#font-size"). val();
    $("#"+asset.id).css("font-size", asset.Style_Font_Size);

    asset.z_index=$("#z_idx"). val(); //z_idx
    max_zindex=asset.z_index>max_zindex?asset.z_index:max_zindex
    min_zindex=asset.z_index<min_zindex?asset.z_index:min_zindex
    $("#"+asset.id).css("z-index",  asset.z_index);

    selectedPath=asset.path ;
    let index = nameList.findIndex(checkNameList);
    if(~index)
    {
     asset.nodeid=referenceList[index].nodeid;
     asset.areaid=referenceList[index].areaSAKEY;
    }

let finalPropertyData=[];
if(asset.properties[0][0]!="")
{
    for (i of asset.properties)
    {
        selectedPath=i[0] ;
        let index = Labelproperties.findIndex(checkNameList);
        if(~index)
        {
            finalPropertyData.push(LabelpropertyList[index].value);
        } 
    }
    for(i=0;i<asset.properties.length;++i)
    {
        $("#"+asset.id+"Prop"+String(i)).text(asset.properties[i][0]+" : "+finalPropertyData[i]);
    }
}
RestAssetProperties(asset.areaid,asset.nodeid);
}

//function to update Asset block
function updateAssetBlock(asset)
{
    

    asset.path  = $("#tags1"). val();
    asset.alias = $("#tags2"). val();
    $("#"+asset.id+"Title").text(asset.alias);
  
    asset.connectionName=table.getData();
    var prevConnections=[...asset.connections]
    asset.connections=[];
    
    asset.z_index=$("#z_idx"). val(); //z_idx
    max_zindex=asset.z_index>max_zindex?asset.z_index:max_zindex
    min_zindex=asset.z_index<min_zindex?asset.z_index:min_zindex
    $("#"+asset.id).css("z-index",  asset.z_index);
    
    for(x of Assetbox)
        if(x.deleted==false)
        for(y of asset.connectionName)
           if(x.name===y[0])
            {   
                 asset.connections.push(x.id);
                 x.fromConnections.push(asset.id)
                 var set = new Set(x.fromConnections);
                 x.fromConnections=[...set]; 
            }
    var connectionSet= new Set(asset.connections)
    let difference = prevConnections.filter(x => !connectionSet.has(x))
    for(x of difference)
    {
        Assetbox[x.slice(3)].fromConnections.splice(Assetbox[x.slice(3)].fromConnections.indexOf(asset.id),1)
    }
    


    for(x of asset.lines)
        x.remove();

    asset.lines=[];
    
    for (let i=0;i<asset.connections.length;i++)
    {
        let line=drawLine(asset.id,asset.connections[i]);
        
        if(line!=="none")
            asset.lines.push(line);
    }
    //////////////////////////////////////////////////////////////
    selectedPath=asset.path ;
    let index = nameList.findIndex(checkNameList);
    if(~index)
    {
     asset.nodeid=referenceList[index].nodeid;
     asset.areaid=referenceList[index].areaSAKEY;
    }
   
}

//function to find an index based on the entry
function checkNameList(namelist) {
    return namelist == selectedPath;
  }
  

function initzindex()
{
    $("#moveToFront").on("click touchend",()=>
    {

        selectedAsset.z_index=++max_zindex//z_idx
        $("#z_idx"). val(selectedAsset.z_index);
        $("#"+selectedAsset.id).css("z-index",  selectedAsset.z_index);
    })

    $("#moveToBack").on("click touchend",()=>
    {
        selectedAsset.z_index=--min_zindex //z_idx
        $("#z_idx"). val(selectedAsset.z_index);
        $("#"+selectedAsset.id).css("z-index",  selectedAsset.z_index);
    })
}

