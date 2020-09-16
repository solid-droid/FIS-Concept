/* ///////////////////////////////////////////
Next-Gen Factory Information System concept 
Author: Nikhil M Jeby
Final Update: 12-JUL-20
///////////////////////////////////////////// */

function initPropertiesContent()
{
    table=$("#edittable").editTable({
      field_templates: {
        'checkbox' : {
            html: '<input style="width:30px"  type="checkbox">',
            getValue: function (input) {
                return $(input).is(':checked');
            },
            setValue: function (input, value) {
                if ( value ){
                    return $(input).attr('checked', true);
                }
                return $(input).removeAttr('checked');
            }}},
            data: [[]],
            row_template: ['text'], 
            headerCols: ['Connected to'],
            maxRows: 5,
            first_row: false
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
   
function ClearSelection()
{
  if(selectedAsset!="none")
  $("#"+selectedAsset.id).css("animation", "none");
  selectedAsset="none"            
}

function clearProperties()
{
  $("#option0").hide();$( "#tags0" ).hide();
  $("#option2").hide();$( "#tags2" ).hide(); 
  $("#edittable").hide();          
  $( "#tags1" ).hide();$( "#option1" ).hide();
  $( "#tags3" ).hide();$( "#option3" ).hide();
  $( "#tags4" ).hide();$( "#option4" ).hide();
}