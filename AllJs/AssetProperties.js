function getKeyValueFromJSON(text) {
    var jsonObj = text;
    let y ={};
    LabelpropertyList=[];
    Labelproperties=[];
    for(var key in jsonObj) {
        y = {"name": key, "value":jsonObj[key]};
        LabelpropertyList.push(y);
        Labelproperties.push(key+" ");
    }
    OnscreenList=Labelproperties; 
    _autocomple();
    
}
async function RestAssetProperties(areaid,nodeid){
if(areaid!=null&&nodeid!=null)
{
let _url_=RestAPI_urlList.Label_AssetProperties +areaid+"/"+nodeid;
let properties = await (await fetch(_url_)).json()
getKeyValueFromJSON(properties[0]);
}
  
}
