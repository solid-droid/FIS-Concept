/*************************************************************
Author:LDINESH1, RDIVYA6
Description: Script to get Incident and Event list for selected asset on selected time period
Input:ID(nodeid),sakey,startTime,EndTime,Category(Events/Incidents)
Output:Array
Created On : 07/29/2020
..............................................................
Sl.No |Modified By    |Modified Date  |Modified description
..............................................................
|               |               |
 **************************************************************/


//function which will give the result to map based on the category
function finalTable2List(result,i){
    console.log("REST-API service complete");
    dataTable[parseInt(i)].addRow(result);
}
//function to call detailed view REST API and get Json result
//RESTIncidentEventservice(2, 1, "2020-07-05 08:40:00", "2020-07-05 10:40:00", "Incidents");
function REST_IncidentEventservice(category,_url_,id) {
        let assetEvents = [], eventX = {}, assetIncident = [], incidentX = {};
        $("#status"+id).text("Loading...");
        console.log("Waiting for REST-API response.");
        let _url ="https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/DV/" + _url_;
        $.ajax({url: _url, 
        success: function(result){  
            let eventIncList = result;
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
                finalTable2List(assetEvents,id);
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
                finalTable2List(assetIncident,id);
            }

        }



    });


}
