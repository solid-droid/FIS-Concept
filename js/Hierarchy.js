function plantHierarchy(hierarchy){
    __assetTree=hierarchy;
    console.log("AssetTree fetch complete");
}


function REST_AssetTree(){
    console.log("Waiting for AssetTree REST response");
    $.ajax({url: "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/assetinfo", 
    success: function(result){
        assetList = result;
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
        // console.log(assetList.assets);
        REST_Assetservice(assetList.assets);
  }});
  
}


function REST_Assetservice(assetListAPI) {
	
    $.ajax({url: "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/groupinfo", 
    success: function(result){

            groupList = result;
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
		
    });

}


const createDataTree = dataset => {
    let hashTable = Object.create(null)
    dataset.forEach( aData => hashTable[aData.ref_id] = { ...aData, _children : [] } )
    let dataTree = []
    dataset.forEach( aData => {
      if( aData.parent_ref_id ) hashTable[aData.parent_ref_id]._children.push(hashTable[aData.ref_id])
      else dataTree.push(hashTable[aData.ref_id])
    } )
    return dataTree
}