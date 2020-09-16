
function getJSONforItems(text,id) {
    let data =[{"id" : id+"#0", "parent" : "#", "text" : "All Items", state: {selected: true,opened: false}}];
    const arrayItems = [...text];
    const distinctItems = [...new Set(arrayItems.map(x=>x.category))];
    //console.log(distinctItems);
    for(i in distinctItems){
        let det ={};
        det.id = id+"#p"+distinctItems[i];
        det.parent = id+"#0";
        det.text = distinctItems[i];
        data.push(det);    
    }
    for(j in arrayItems){
        let dut = {};
        dut.id = id +"#c"+arrayItems[j].accumalatorName;
        dut.parent = id + "#p"+arrayItems[j].category;
        dut.text= arrayItems[j].accumalatorName;
        data.push(dut);
    } 
    $("#TitemFilter"+id).jstree(true).settings.core.data = [];
    $("#TitemFilter"+id).jstree(true).refresh();
    $("#TitemFilter"+id).jstree(true).settings.core.data = data;
    $("#TitemFilter"+id).jstree(true).refresh();
    return data
}

async function createItemList(nid,akey,sT,eT,id){
    // let nid=1;
    // let akey =2;
    // let sT ="2020-06-30%2020%3A00%3A00";
    // let eT="2020-07-01%2020%3A03%3A00";
   // let link = "https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/accumulators/categories/"+nid+"/"+akey+"/"+sT+"/"+eT;
    console.log("started Create List")
    let result= await (await fetch("https://aep-ngfis.apps.pp01i.edc1.cf.ford.com/api/v1/accumulators/categories/"+nid+"/"+akey+"/"+sT+"/"+eT)).json()
    getJSONforItems(result,id)

  
}
