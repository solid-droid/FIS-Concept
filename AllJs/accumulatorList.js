

//function for creating DataShape
function Hour24_to_AM_PM(timeString)
{
    var H = +timeString.substr(0, 2);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? " AM" : " PM";
    timeString = h + timeString.substr(2, 3) + ampm;
    return timeString
}
function createTimeTableHeader(count,startdate,interval)
{
    return new Promise((resolve)=>{
    let begin=startdate
    let DS = [
            {title:"Accumulator"    ,field:"accumulatorName"    ,headerFilter:"input", headerFilterPlaceholder:"Filter..",minWidth:200, frozen:true },
            {title:"Category"          ,field:"category"        ,headerFilter:"input", headerFilterPlaceholder:"Filter..",minWidth:150, frozen:true },
        ];
    let prevDay=""
    for(let i=0;i<count;++i)
    {
        let Date=addMinutes(begin,interval*(i))
        let _date=String(Date)
        let day=_date.split(" ")[1]+_date.split(" ")[2]+_date.split(" ")[3]
        let intRow={headerFilter:"input", headerFilterPlaceholder:"Filter..",minWidth:100 }
        let row={}

        if(prevDay!=day)
        {
            prevDay=day
            row.title=getDate(Date,1) //example = 22-5-2020
            row.columns=[]
            intRow.title=Hour24_to_AM_PM(_date.split(" ")[4])       
            intRow.field="val"+String(i)
            row.columns.push(intRow) //{title:22-5-2020,columns:[{title:,field:,...}]}
            DS.push(row)

            
        }
        else
        {

            intRow.title=Hour24_to_AM_PM(_date.split(" ")[4])
            intRow.field="val"+String(i)
            DS[DS.length-1].columns.push(intRow)
        }     
      
        
    }

    resolve(DS)
})
}



async function finalTimeTable2List(result,i,count,startdate,interval){

    TimeTable[parseInt(i)].setColumns(await createTimeTableHeader(count,startdate,interval))
    console.log("Adding Data to Table")
    if(result.length>0)
    TimeTable[parseInt(i)].addRow(result);
    else
    {
    result[0]={assetName:name,incidentCategory:"No Data Found",eventName:"No Data Found"}
    TimeTable[parseInt(i)].addRow(result);

    }
    $("#Tstatus"+i).text("Status: OK");
}

function getDate(today,type=0)
{
    let finalDate
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    const yyyy = today.getFullYear();

    if(dd<10) 
    {
        dd=`0${dd}`;
    } 
    
    if(mm<10) 
    {
        mm=`0${mm}`;
    } 
    if(type==0)
    {
    finalDate = `${yyyy}-${mm}-${dd}`;
    finalDate+=" "+String(today).split(" ")[4]
    return finalDate
    }
    else
    {
    finalDate = `${mm}-${dd}-${yyyy}`;
    return finalDate
    }
}
//function to call detailed view REST API and get Json result
//RESTAccumulatorService(1, 2, "2020-07-02 04:22:00", "2020-07-03 05:33:00",10);

async function RESTAccumulatorService(id, sakey, startTime, EndTime,interval,assetid,item=null) {

    let APIStart=getDate(addMinutes(startTime,-1-addMinutes(startTime,0).getMinutes()%10))
    let APIEnd=getDate(addMinutes(EndTime,10-addMinutes(startTime,0).getMinutes()%10))
    $("#Tstatus"+assetid).text("Loading...");
//////////////////////////////////////////////////////////
    let _URL_= RestAPI_urlList.TimeSeriesTableFetch + id + "/" + sakey + "/" + APIStart + "/" + APIEnd
    if(item!=null)
    _URL_= RestAPI_urlList.TimeSeriesTableFetch + id + "/" + sakey + "/" + APIStart + "/" + APIEnd + "/" + item

    let result=await (await fetch(_URL_)).json()

    TimeSeriesTable_process1(result,startTime,EndTime,interval,assetid)
}

function TimeSeriesTable_process1(accumulatorIncList,startTime,EndTime,interval,assetid)
{
    console.log("REST-API service complete")
    let accumulatorList=[],  accumulatorX = {};
    for (i in accumulatorIncList.accumulators) {
                    accumulatorX = {
                        "assetName": accumulatorIncList.accumulators[i].assetName,
                        "accumulatorName": accumulatorIncList.accumulators[i].accumulatorName,
                        "category": accumulatorIncList.accumulators[i].category,
                        "value": accumulatorIncList.accumulators[i].value,
                        "recordTime": accumulatorIncList.accumulators[i].insertTime
                    };
                    accumulatorList[i] = accumulatorX;
    }
    console.log("Processing Data")
    customPivot(accumulatorList,startTime,EndTime,interval,assetid)
}



function customPivot(accumulatorList,startTime,endTime,interval,assetid)
{
    let data=accumulatorList
    let _assetName="",_accumulatorName="",_category=""
    let newRow=false,k=0
    let finalData=[]
    let _totalMinutes = (((addMinutes(endTime,0)-addMinutes(startTime,0))/1000)/60)/interval



    for(let i of data)
    {       
        if((i.assetName!=_assetName||i.accumulatorName!=_accumulatorName||i.category!=_category))
        { 
           _assetName=i.assetName
           _accumulatorName=i.accumulatorName
           _category=i.category
           newRow=true
        }
       
       
        if(newRow==true)
        {

                k=0;
                let dat={}

                
                dat.assetName=i.assetName
                dat.accumulatorName=i.accumulatorName
                dat.category=i.category
  
                dat["val"+k]=i.value;            
                dat["time"+k++]=i.recordTime
                finalData.push(dat)
                newRow=false;  
                finalData[finalData.length - 1]["entries"] = 1;
     
                       
        }
        else

        {        
                    
          finalData[finalData.length - 1]["val" + k] = i.value
          finalData[finalData.length - 1]["time" + k++] = i.recordTime
          finalData[finalData.length - 1]["entries"]+=1
       }   


    }
    TTable[assetid].rawData=TTable[assetid].rawData.concat([...finalData]); 
    TimeSeriesTable_process2(finalData,startTime,interval,_totalMinutes,assetid)
}

async function TimeSeriesTable_process2(finalData,startTime,interval,_totalMinutes,assetid)
{
    finalTimeTable2List(await consolidateList(finalData,startTime,interval,_totalMinutes),assetid,_totalMinutes,startTime,interval);

}


function addMinutes(inputDate, minutes) {
    let date = new Date(inputDate.split(" ")[0])
    date.setHours(parseInt(inputDate.split(" ")[1].split(':')[0]))
    date.setMinutes(parseInt(inputDate.split(" ")[1].split(':')[1]))
    date.setMinutes( date.getMinutes() + minutes );
    return date
}



function consolidateList(data,start,interval,count)
{
    return new Promise((resolve)=>{
    let dat=[]

    for(let i=0;i< data.length;++i) //Loop for initialising the dat[] with vals =0 for the given count
    {
        let row={}
        row.assetName=data[i].assetName
        row.accumulatorName=data[i].accumulatorName
        row.category=data[i].category  
        for(let j=0;j<count;++j)
        row["val"+j]=0;
        dat.push(row);
    }
 
    ///////////////
    let dateList=[];
     for(let i=0;i<count;++i) // Loop to create an array with dates starting from start date incrimented with interval till end date
    {
        dateList[i]=addMinutes(start,interval*(i))
    }
    ////////////////
//logic for mapping the available entries(values) in data (for the recordtime in dateList) to dat[]
     for(let i=0;i<data.length;++i) //loop through each row of data
        {   let row=data[i] //each row of data[]

        for(let k=0;k<row.entries;++k)// loop through each 'time'(recordTime) field in the row of data[]
        {
            
            let day=String(addMinutes(row["time"+k],0)) // converts each 'time'(recordTime) to dateTime format and back to string

            for(let j=0;j<dateList.length;++j) ///Loop in dateList[]
            {
                if(day==String(dateList[j]))//check for exact match of 'time'(recordTime) in data to dateTime in dateList
                {
                   
                   //<Index> of dateList is the same as val<Index> in rows of dat[]
                    dat[i]["val"+j]=row["val"+k] //mapping of matched val of data[] to val of dat[] based on RecordTime
                }
             
            }   
       }
     }
   //vals in dat[] will have values from rest-responce data only if a record time is matched else it will be '0'
   resolve(dat)
})
}