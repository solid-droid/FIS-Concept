/*************************************************************
Author:LDINESH1, RDIVYA6
Description: Script to get Incident and Event list for selected asset on selected time period
Input:ID(nodeid),sakey,startTime,EndTime,Category(Events/Incidents)
Output:Array
Created On : 07/29/2020
..............................................................
Sl.No |Modified By    |Modified Date  |Modified description
..............................................................
1 .| JNIKHIL          |         |   Added Aync Functions, replaced AJAX with fetch()
 **************************************************************/


//function which will give the result to map based on the category
function finalTable2List(name,result,i){
    console.log("All service complete");
    if(result.length>0)
    dataTable[parseInt(i)].addRow(result);
    else
    {
    result[0]={assetName:name,incidentCategory:"No Data Found",eventName:"No Data Found"}
    dataTable[parseInt(i)].addRow(result);
    }
    $("#status"+i).text("Status: ok");
}
//function to call detailed view REST API and get Json result
//RESTIncidentEventservice(2, 1, "2020-07-05 08:40:00", "2020-07-05 10:40:00", "Incidents");
async function REST_IncidentEventservice(name,category,_url_,id) {
    console.log("Started Data-fetch")
    $("#status"+id).text("Loading...");
    _url_=RestAPI_urlList.DetailedTableFetch +_url_
    let result = await (await fetch(_url_)).json()
    detailedTable_process1(name,category,id,result)
}



function detailedTable_process1(name,category,id,eventIncList)
{
        console.log("Data-fetch complete. Started processing")
        let assetEvents = [], eventX = {}, assetIncident = [], incidentX = {};
            // if category input is "Events"
            if (category == "Events") {
                for (i in eventIncList.events) {
                    eventX = {
                        "assetName": eventIncList.events[i].assetName,
                        "eventName": eventIncList.events[i].eventName,
                        "variableName": eventIncList.events[i].variableName,
                        "value": eventIncList.events[i].value,
                        "recordTime": eventIncList.events[i].recordTime
                    };
                    assetEvents[i] = eventX;
                }
                //console.log(assetEvents);
                finalTable2List(name,assetEvents,id);
            }

            // if category input is "Incidents"
            if (category == "Incidents") {
                for (j in eventIncList.incidents) {
                    incidentX = {
                        "assetName": eventIncList.incidents[j].assetName,
                        "incidentCategory": eventIncList.incidents[j].category,
                        "incidentDescription": eventIncList.incidents[j].description,
                        "startTime": eventIncList.incidents[j].startTime,
                        "endTime": eventIncList.incidents[j].endTime,
                        "duration": eventIncList.incidents[j].duration
                    };
                    assetIncident[j] = incidentX;
                }
                //console.log(assetIncident);
                finalTable2List(name,assetIncident,id);
            }


}
