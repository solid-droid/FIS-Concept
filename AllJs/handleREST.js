/* ///////////////////////////////////////////
AEP Monitoring (Visualizer)
Author: JNIKHIL
Final Update: 23-AUG-20
///////////////////////////////////////////// */

async function initRESTservices()
{

referenceList = await (await fetch(RestAPI_urlList.AssetRefernceList)).json()
for(x of referenceList)
nameList.push(x.path.replace(/ /g, '_').replace(/\./g, ' '))

}


