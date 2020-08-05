
function initRESTservices()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           referenceList=JSON.parse(xhttp.responseText);
           for(x of referenceList)
           nameList.push(x.path.replace(/ /g, '_').replace(/\./g, ' '));
        }
    };
try{
    xhttp.open("GET", "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/allassetinfowithPathandID", true);
    xhttp.send();
}
catch(e)
{
    alert("Unable to connect to REST services.");
}

}




function RestTest(){

    $.ajax({url: "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/DV/2/1/2020-07-05%2008%3A40%3A00/2020-07-05%2010%3A40%3A00", 
    success: function(result){
        let eventx=[];
        eventList = result;
        let x={};  
        for (i in eventList.events) {  
            x={"assetName":eventList.events[i].assetName,
                "eventName":eventList.events[i].eventName,
                "value":eventList.events[i].value,
                "recordTime":eventList.events[i].recordTime}; 
            eventx[i]=x;
            }
        addDataToTable(eventx);
  }});
}