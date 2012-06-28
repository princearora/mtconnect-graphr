//functions to check the type of browser (must be HTML5 compliant)
var isIphone = function(){return (BrowserDetect.OS === 'iPhone/iPod'); }
var isIE = function(){return (BrowserDetect.browser === 'Explorer' && BrowserDetect.version < 9);}
if(isIE()){
	document.getElementById('IEWarning').innerHTML='<h2>This viewer would work better for you on a modern, HTML5 standards compliant broswer (<a href="http://www.google.com/chrome">Chrome</a>, <a href="http://www.mozilla.com/en-US/firefox/new/">Firefox</a>, <a href="http://www.opera.com/">Opera</a>, or <a href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie-9/worldwide-languages">Internet Explorer 9</a>)</h2>';
}
////////////////////////////////////////////////////////////////////////////////////

//initialization of variables for HTML5 drawing canvas
var thePage = new DrwPage();
var cnv = document.getElementById("mycanvas");
var numPts = 0; //a dummy variable for adding segments to lines to shapes
var theLine = null;
var cshp = null;
////////////////////////////////////////////////////////////////////////////////////



var c_count=0; //number of parameters selected

var word;
var plot_fun= new Array(); //array to store the name of variables to be plotted

var max_1=null,min_1=null; //initial ranges for parameter monitoring

//fucntion to set up a new smoothie plotting space
var smoothie = new SmoothieChart( {millisPerPixel: 200,grid: { strokeStyle:'rgb(0, 0, 125)', fillStyle:'#006699',lineWidth: 1, millisPerLine: 1000, verticalSections: 2, },labels: { fillStyle:'rgb(255, 255, 255)' }});
 smoothie.streamTo(document.getElementById("mycanvas2"), 3000 /*delay*/); 
// Data
var line1 = new TimeSeries();
var max_line = new TimeSeries();
var min_line = new TimeSeries();
smoothie.addTimeSeries(line1,{ strokeStyle:'#FBA81B',  lineWidth:3 });
////////////////////////////////////////////////////////////////////////////////////

//function to set cookies for each parameter selected
function onchecked(value){
	$.cookie('graph_seq', value);
	//$("#mycanvas2").insertBefore($("#"+value).prev());alert('hi');
	document.getElementById('mycanvas2').style.visibility="visible"; 

$("#"+value).mouseover(function(event){
$("#mycanvas2").css({'top': event.pageY, 'left': event.pageX});  
});

}
////////////////////////////////////////////////////////////////////////////////////

//function to toggle visibility of conditions
function toggle_visibility2(id) {
       var e = document.getElementById(id);
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
    }
///////////////////////////////////////////////////////////////////////////////////
function toggle_visibility(con_cond) {
       if (con_cond=='show_cond')
	   return 'hide_cond'
	   else if(con_cond=='hide_cond')
	   return 'show_cond'
}


var con_cond = 'hide_cond';
//function to display all the parameters of the device selected
var updateSelected = function(){
	if(thePage.ActiveShape){
	   var selShp = thePage.ActiveShape;

		var SelDisplay = document.getElementById('SelStats');
		if(SelDisplay && selShp){
		 if(selShp.deviceName != ''){
			$(SelDisplay).empty();
			$(SelDisplay).append('<b>Machine:</b>' + selShp.text);
			if(selShp.currStatusText){
				$(SelDisplay).append('<br /><b>Status:</b>' + selShp.currStatusText);
			}

			if(selShp.conditionAll.len!=0){

			$(SelDisplay).append('<br /><a href="#" onclick="con_cond=toggle_visibility(con_cond);"><b>Conditions</b></a>');


			$(SelDisplay).append('<div id=\'conditions\' class=\'' +con_cond+'\'></div>');	
			var SelCndtnDisplay = document.getElementById('conditions');
				for(var i=0; i< selShp.conditionAll.len; i++)
				{
					$(SelCndtnDisplay).append('<b>'+ProperCase(selShp.conditionAll.type[i])+':</b>' + selShp.conditionAll.value[i]+'<br/>');
				}
			}
		
			if(selShp.currSpinObj.len!=0){
				for(var i=0; i< selShp.currSpinObj.len; i++)
				{
					$(SelDisplay).append('<br /><b>  <input type="radio" onclick="onchecked(this.value);" name="ValueSet" value="Spin-'+i+'" id="Spin-'+i+'"/>'+ ProperCase(selShp.currSpinObj.type[i]) + ' Spin:</b>' + Math.round(selShp.currSpinObj.value[i]*100)/100);
				}
			}
			if(selShp.currProcessText){
			   var parts = selShp.currProcessText.split('-');
			   var ProcText = '';
			   if(parts.length>=3){
			      var ShopOrder = parts[0];
			      var ProcNum = parts[2];
			      var PartNum = parts[3];
			      ProcText = '<b>Order#:</b>' + ShopOrder + '<br /><b>Process:</b>:' + ProcNum + '<br /><b>Part Idx:</b>' + PartNum;
			   }else{
			      ProcText = '<b>Process:</b>' + selShp.currProcessText;
			   }

				$(SelDisplay).append('<br />' + ProcText);
			}
			
			if(selShp.xPos.len){
				for(var i=0; i< selShp.xPos.len; i++)
				{
					$(SelDisplay).append('<br /><b><input type="radio" onclick="onchecked(this.value);" name="ValueSet" value="xPos-'+i+'"/>'+ ProperCase(selShp.xPos.type[i]) + ' Position X:</b>' + selShp.xPos.value[i]);
				}

			}
			if(selShp.yPos.len){
				for(var i=0; i< selShp.yPos.len; i++)
				{
					$(SelDisplay).append('<br /><b><input type="radio" onclick="onchecked(this.value);" name="ValueSet" value="yPos-'+i+'"/>'+ ProperCase(selShp.yPos.type[i]) + ' Position Y:</b>' + selShp.yPos.value[i]);
				}
			}
			if(selShp.zPos.len){
				for(var i=0; i< selShp.zPos.len; i++)
				{
					$(SelDisplay).append('<br /><b><input type="radio" onclick="onchecked(this.value);" name="ValueSet" value="zPos-'+i+'"/>'+ ProperCase(selShp.zPos.type[i]) + ' Position Z:</b>' + selShp.zPos.value[i]);
				}
			}
		}
		
var plot_lab=[];
		//checking the checkbox
		var checking=$.cookie('graph_seq');
		if (checking!=null)
		{	
			plot_fun=[];		
		var checkOver=document.getElementsByTagName('input')
	    for(var i=0;i<checkOver.length;i++)
		 if(checking==checkOver[i].value)
		 checkOver[i].checked = true;

			word=checking.split("-");
			if (word[0]=="Spin")
			{var stuff='selShp.currSpinObj.value['+word[1]+']';
			var label_dumm='selShp.currSpinObj.type['+word[1]+']';}
			else
			{var stuff='selShp.'+word[0]+'.value['+word[1]+']';
			var label_dumm='selShp.'+word[0]+'.type['+word[1]+']';}
			plot_lab.push(ProperCase(eval(label_dumm)+" "+word[0]));
			plot_fun.push(stuff);
			
		}
		
	}

if(plot_lab[0]!=null)		
document.getElementById('label1').innerHTML='<div id="light1" class="off"></div>'+plot_lab[0];

//function to update ranges
updateRange=function(max1,min1){
	max_1=max1;
	min_1=min1;
	smoothie.addTimeSeries(max_line,{ strokeStyle:'#000000',  lineWidth:2 });
	smoothie.addTimeSeries(min_line,{ strokeStyle:'#000000',  lineWidth:2 });
}
////////////////////////////////////////////////////////////////////////////////////

//function to display the status of the parameters being monitored
checkRange=function(){
	var element1;
	element1=document.getElementById('light1');
    if(eval(plot_fun[0])>0 && eval(plot_fun[0])<=max_1 && eval(plot_fun[0])>=min_1)
		element1.className="green";
	else if(eval(plot_fun[0])<0 && eval(plot_fun[0])<=max_1 && eval(plot_fun[0])<=min_1)
		element1.className="green";
	else if(eval(plot_fun[0])>max_1)
		element1.className="red";
	else if(eval(plot_fun[0])<0 && eval(plot_fun[0])>min_1)
		element1.className="red";
	else if(eval(plot_fun[0])>0 && eval(plot_fun[0])<min_1)
		element1.className="red";
}
////////////////////////////////////////////////////////////////////////////////////




// function to retrieve data from cookie & add to SmoothieChart
setInterval(function() {line1.append(new Date().getTime(), eval(plot_fun[0]));}, 3000);
if(min_1!=null)
setInterval(function() {max_line.append(new Date().getTime(), max_1);min_line.append(new Date().getTime(), min_1);}, 3000);
	if(plot_fun[0]!=null && min_1!=null)
	checkRange();

}else{//hide the div
	     var SelDisplay = document.getElementById('SelStats');
	     if(SelDisplay){
   		    SelDisplay.innerHTML = '<p>Click on a Machine Name to view its properties</p>';
   		    SelDisplay.style.zIndex = 1;
   		    }
   		}

}
////////////////////////////////////////////////////////////////////////////////////

var curr = new MTCUpdate(conn_url);
	
var deviceAll=curr.getDevices();

//drawing the placebearers for all the devicea in the MTC stream
for (var i=0; i < deviceAll.length; i++)
{

	cshp = thePage.NewShape();
	cshp.text = deviceAll[i];
	cshp.pinx = 100+120*(i);
	cshp.piny = 20;
	cshp.deviceName = deviceAll[i];
	cshp.width = 110;
	cshp.height = 40;
//	cshp.GUID = '{DAAA938E-6DEB-4318-B65B-4B8360497A01}';
	cshp.fillStyle = 'rgb(255,255,255)';
	theLine = cshp.AddLine();
	theLine.closed = true;
	//context.fillRect(40,40,100,30);
	numPts = theLine.AddSegment(-50,15,50,15);
	numPts = theLine.AddSegment(50,15,50,-15);
	numPts = theLine.AddSegment(50,-15,-50,-15);
	numPts = theLine.AddSegment(-50,-15,-50,15);

	cshp.SetContext(cnv);
	this.thePage.setCanvas(cnv);
}

this.thePage.draw();
////////////////////////////////////////////////////////////////////////////////////

//function to retrieve data from MTC stream
var updateFromMTC = function(){
	var current = new MTCUpdate(conn_url);
	var deviceAlls = current.getDevices();
	for(var i=0;i<deviceShps.length;i++){
	  var currDeviceShp = deviceShps[i];
	  var currDevice = current.getDeviceByName(currDeviceShp.deviceName);

	  if(currDevice){
	     var currStatus = current.getDeviceStatus(currDevice);
	     if(currStatus=='BROKEN'){currStatus='REPAIR';}
		 
	     var currSpinObj = current.getSpindleSpeed(currDevice);
		 var currPosObj = current.getDevicePosition(currDevice);

	     if(currSpinObj.len)
		 {
		 	currDeviceShp.currSpinObj = currSpinObj;	
		 }
	   
	     var currProcess = current.getDeviceCurrentProcess(currDevice);
	     
		 currDeviceShp.xPos = currPosObj[0];
	     currDeviceShp.yPos = currPosObj[1];
	     currDeviceShp.zPos = currPosObj[2];
  
		 var conditionAll = current.getCondition(currDevice);
		 
	     if(currSpinObj.len)
		 {		 currDeviceShp.conditionAll = conditionAll;}


         currDeviceShp.currProcessText = currProcess;

	     currDeviceShp.currStatusText = currStatus;
	
	     if(currStatus=='AVAILABLE'){
	     	  currDeviceShp.fillStyle = 'rgb(0,255,0)';
	     }else{
	        if(currStatus=='BROKEN'||currStatus=='REPAIR'){
	           currDeviceShp.fillStyle = 'rgb(255,0,0)';	
	        }else{
	           if(currStatus=='WORKING-SETUP'){
	           	  currDeviceShp.fillStyle = 'rgb(255,153,204)';
	           }else{
	              if(currStatus=='BLOCKED-UNLOAD'){
	              	  currDeviceShp.fillStyle = 'rgb(255,160,0)';
	              }else{
   	           currDeviceShp.fillStyle = 'rgb(255,255,0)';
   	           }
	           }
	     } }
	
	     currDeviceShp.draw(true);
	  }else{
	     currDeviceShp.fillStyle = 'rgb(255,255,0)';
	     currDeviceShp.draw(true);
	  }
	  currDevice = null;
	}
	this.thePage.draw();
	updateSelected();

	if(isIphone()){
		setTimeout('updateFromMTC("'+conn_url+'")' , 6000);	
	}else{
	  setTimeout('updateFromMTC("'+conn_url+'")' , 1000);	
	}
}
////////////////////////////////////////////////////////////////////////////////////

var onSelectAction = function() {
	updateSelected();
}

// populate a deviceShps array
var deviceShps = new Array();
for(var i=0;i<thePage.Shapes.length;i++){
	if(thePage.Shapes[i].deviceName != ''){
		deviceShps.push(thePage.Shapes[i]);
		thePage.Shapes[i].onSelectAction = onSelectAction;
	}
}

var onDeselectAction = function() {
	updateSelected();
}

thePage.onDeselect = onDeselectAction;

updateFromMTC();