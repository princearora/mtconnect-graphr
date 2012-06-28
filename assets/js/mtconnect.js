//function to retrieve a xml file
function getCurrentXML(conn_url) {
    var n = "";
    return $.ajax({
        url: "loader.php?url=http://"+conn_url, //using a proxy php file to load xml files from external server
        cache: !1,
        async: !1,
        dataType: "txt",
        success: function (t) {
            n = t
        }
    }), n
}
///////////////////////////////////////////////////////////////////

//function to convert a string into ProperCase
function ProperCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
///////////////////////////////////////////////////////////////////


//function with subfunctions to read content from the xml input
var MTCUpdate = function (conn_url) {
        
		function conditionT(n, t, i) {
            var u, r;
            if (n) if (n.length > 0) {
                if (n.name) if (n.name == t) return {
                    conditionName: i,
                    condition: n.text
                };
                for (u = 0; u < n.length; u++) {
                    r = n[u];
                    if (r) if (r.name) if (r.name == t) return {
                        conditionName: i,
                        condition: r.text
                    }
                }
            } else if (n.name == t) return {
                conditionName: i,
                condition: n.text
            }
        }
				
        function r(n, i) {
            var r = "";
            return r = conditionT(n.Normal, i, "Normal") || conditionT(n.Unavailable, i, "Unavailable") || conditionT(n.Fault, i, "Fault") || conditionT(n.Warning, i, "Warning")
        }
		
        var u = getCurrentXML(conn_url),
            i = $.xml2json(u),   //converting xml to json
            n;
	        i && (n = i.Streams),
		
		this.getDevices = function () {
		var i, r = new Array();
		if (n) if (n.DeviceStream) if (n.DeviceStream.length) 
		for (i = 0; i < n.DeviceStream.length; i++) {
                r[i] = n.DeviceStream[i].name;
                
            } else {
		  		r[0] = n.DeviceStream.name;
            }
			return r
  		},
		
		///getting conditions starts here
		this.getCondition = function (n) {
		var r=new Object();
			r.type= new Array(),r.value=new Array();
			var	count=0;
				for (var t = 0; t < n.ComponentStream.length; t++) {
                	var i = n.ComponentStream[t],
                    u = i.name;
					if (i.Condition)
					{
						var v = i.Condition;
						if(v.Normal){ if(v.Normal.length>1){
						for(var f =0; f < v.Normal.length; f++)
						{
							r.type[count] =  u+' '+v.Normal[f].type;
							r.value[count++] = "Normal"
						}}
						else{r.type[count] =  u+' '+v.Normal.type;
							r.value[count++] = "Normal"}
						}

						
						if(v.Fault){ if(v.Fault.length>1){
						for(var f =0; f < v.Fault.length; f++)
						{
							r.type[count] =  u+' '+v.Fault[f].type;
							r.value[count++] = "Fault"
						}}
							else{r.type[count] =  u+' '+v.Fault.type;
							r.value[count++] = "Fault"}
						}

						
						if(v.Warning) {if(v.Warning.length>1){
							r.type[count] =  u+' Warning';
							r.value[count++] = v.Warning
						}
							else{r.type[count] =  u+' Warning';
							r.value[count++] = v.Warning}
						}
						
				}r.len=count;
			}
            return r 
		},
		
		this.getDeviceByName = function (t) {
            var r, i;
            if (n) if (n.DeviceStream) if (n.DeviceStream.length) for (r = 0; r < n.DeviceStream.length; r++) {
                i = n.DeviceStream[r];
                if (i.name) if (i.name == t) return i
            } else {
                i = n.DeviceStream;
                if (i.name == t) return i
            }
        },
		
		this.getDeviceName = function (n) {
            return n.name
        },
		
		this.getDevicePosition = function (n) {
            var r= new Array();
			for (var i=0;i<3;i++)
			{
				r[i] = new Object();
				r[i].type= new Array(),r[i].value=new Array();
			}
            for (var t = 0; t < n.ComponentStream.length; t++) {
                var i = n.ComponentStream[t],
                    u = i.component,
					g = i.name;
           		if(u == "Linear" && (g == "X" || g == "Y" || g == "Z"))	
                {
					var h;
					switch(g)
					{
						case "X" : h=0;break;
						case "Y" : h=1;break;
						case "Z" : h=2;break;
					} 
					
					for(var f =0; f < i.Samples.Position.length; f++)
					{
						r[h].type[f] =  i.Samples.Position[f].subType;
						r[h].value[f] = i.Samples.Position[f].text;
					}
					r[h].len=i.Samples.Position.length;
				}
            }
            return r
        },


		this.getSpindleSpeed = function (n) {
			var r=new Object();
			r.type= new Array(),r.value=new Array();
            for (var t = 0; t < n.ComponentStream.length; t++) {
                var i = n.ComponentStream[t],
                    u = i.component;
                if(u == "Rotary")
				{
					for(var f =0; f < i.Samples.SpindleSpeed.length; f++)
					{
						r.type[f] =  i.Samples.SpindleSpeed[f].subType;
						r.value[f] = i.Samples.SpindleSpeed[f].text;
					}
					r.len=i.Samples.SpindleSpeed.length;
				}
			}
            return r 
       },


		this.getDeviceCompStream = function (n, t) {
            var r;
            if (n[t]) return n[t];
            for (r = 0; r < n.ComponentStream.length; r++) {
                var i = n.ComponentStream[r],
                    u = i.component,
                    f = i.componentId;
                if (u === t) return n[t] = i, i
            }
        },
		
		this.getDeviceCurrentProcess = function (n) {
            var t = this.getDeviceCompStream(n, "Controller"),
                i, r;
            if (t) if (t.length) for (i = 0; i < t.Events.length; i++) {
                r = t.Events[i];
                if (r.name == "processComplete") return r.text
            } else if (t.Events.Message) if (t.Events.Message.length) for (i = 0; i < t.Events.Message.length; i++) {
                r = t.Events.Message[i];
                if (r.name == "processComplete") return r.text
            } else return t.Events.Message.text
        },
		
		this.getDeviceQueueStr = function (n) {
            var t = this.getDeviceCompStream(n, "Controller"),
                i, r;
            if (t) if (t.length) for (i = 0; i < t.Events.length; i++) {
                r = t.Events[i];
                if (r.name == "queueCount") return r.text
            } else if (t.Events.Message) if (t.Events.Message.length) for (i = 0; i < t.Events.Message.length; i++) {
                r = t.Events.Message[i];
                if (r.name == "queueCount") return r.text
            } else return t.Events.Message.text
        },
		
		this.getDeviceElectric = function (n, t) {
            var i = this.getDeviceCompStream(n, "Electric");
            if (i) if (i.Samples) if (i.Samples[t]) return i.Samples[t].text
        },
		
		this.Speed = function (n) {
            var i = "",
                t = this.getDeviceCompStream(n, "Rotary");
            if (t) if (t.Samples) if (t.Samples.SpindleSpeed) return t.Samples.SpindleSpeed.text
        },
		
		this.getDeviceStatus  = function (n) {
            for (var r = "", t = 0; t < n.ComponentStream.length; t++) {
                var i = n.ComponentStream[t],
                    u = i.component,
                    f = i.componentId;
                u == "Device" && (r = i.Events.Availability.text)
            }
            return r
        }
    }
///////////////////////////////////////////////////////////////////
		