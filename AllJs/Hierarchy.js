
/* ///////////////////////////////////////////
AEP Monitoring (Visualizer)
Author: BGNANASE, JNIKHIL
Final Update: 23-AUG-20
///////////////////////////////////////////// */


function plantHierarchy(hierarchy){
    __assetTree=hierarchy;
    menuAssetTree.setData(__assetTree);
    console.log("AssetTree build complete");
}


async function REST_AssetTree(){
        console.log("Asset data fetch started")
        let result=await fetch(RestAPI_urlList.Hierarchy_AssetInfo)
        AssetTree_Process1(await result.json())
}

function AssetTree_Process1(assetList)
{
        
        let count=0;
        for (i in assetList.assets) {  
            assetList.assets[i]["name"]= assetList.assets[i]["assetName"];
            delete assetList.assets[i]._id;  
            delete assetList.assets[i].active;  
            delete assetList.assets[i].alias;  
            delete assetList.assets[i].area;  
            delete assetList.assets[i].assetName;
            delete assetList.assets[i].order;
            delete assetList.assets[i].orderTag; 
            delete assetList.assets[i].path; 
            assetList.assets[i].ref_id=parseInt("111"+String(assetList.assets[i].area_SAKEY)+String(count++));
            assetList.assets[i].parent_ref_id=parseInt(String(assetList.assets[i].area_SAKEY)+"00"+String(assetList.assets[i].parentgroupid));
        }
        REST_Assetservice(assetList.assets);
        
}


async function REST_Assetservice(assetListAPI) {
            let result=await fetch(RestAPI_urlList.Hierarchy_GroupInfo)
            AssetTree_Process2( await result.json(),assetListAPI)
}

function AssetTree_Process2(groupList,assetListAPI)
{           console.log("Rest-service complete. Started building Asset-tree")
            for (i in groupList.groups) {
                groupList.groups[i].name=groupList.groups[i].groupName;
                delete groupList.groups[i]._id;
                delete groupList.groups[i].bottleneckOrder;
                delete groupList.groups[i].path;
                delete groupList.groups[i].active;
                delete groupList.groups[i].alias;
                delete groupList.groups[i].area;
                delete groupList.groups[i].assetName;
                delete groupList.groups[i].order;
                delete groupList.groups[i].orderTag;
                delete groupList.groups[i].groupName;
                groupList.groups[i].ref_id=parseInt(String(groupList.groups[i].area_SAKEY)+"00"+String(groupList.groups[i].groupid));
               if(groupList.groups[i].parentgroupid!=null)
                groupList.groups[i].parent_ref_id=parseInt(String(groupList.groups[i].area_SAKEY)+"00"+String(groupList.groups[i].parentgroupid));
                else
                groupList.groups[i].parent_ref_id=0;
            }

             plantHierarchy(createDataTree(Object.assign([],assetListAPI,groupList.groups)));
        
}

//converts list of assets to a tree array with children inside _children[]
const createDataTree = dataset => {
    let hashTable = Object.create(null)
    dataset.forEach( aData => {
        if(aData.groupid!=undefined||aData.groupid!=null)
        hashTable[aData.ref_id] = { ...aData, _children : [] }
        else
        hashTable[aData.ref_id] = { ...aData}
    })
    let dataTree = []
    dataset.forEach( aData => {
      if( aData.parent_ref_id )
      hashTable[aData.parent_ref_id]._children.push(hashTable[aData.ref_id])
      else dataTree.push(hashTable[aData.ref_id])
    } )
    return dataTree
}

