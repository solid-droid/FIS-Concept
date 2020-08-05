/* ///////////////////////////////////////////
Next-Gen Factory Information System concept 
Author: Nikhil M Jeby
Final Update: 12-JUL-20
///////////////////////////////////////////// */

function initPropertiesContent()
{
    table=$("#edittable").editTable({
            
            data: [[]],
            headerCols: ['Connected to'],
            maxRows: 5
    });
};

function restcall()
{
for(let i=0;i<Assetbox.length;++i)
    $('#btn'+String(i)).css("background-color",getRandomColor());

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
   