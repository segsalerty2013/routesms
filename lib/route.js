var request = require('request');
var urlencode = require('urlencode');

var errors = function(code){
    var resp = {
        1702:"Invalid URL Error",
        1703:"Invalid value in username or password field",
        1704:"Invalid value in -type- field",
        1705:"Invalid Message",
        1706:"Invalid Destination",
        1707:"Invalid Source (Sender)",
        1708:"Invalid value for -dlr- field",
        1709:"User validation failed",
        1710:"Internal Error",
        1025:"Insufficient Credit",
        1715:"Response timeout"
    };
    if(code in resp){
        return resp[code];
    }
    return "Unknown Error Code Response";
};

var RouteSms = function(){

};

RouteSms.prototype.name = 'routesms';
RouteSms.prototype.connection = {
    host:"",
    port:"",
    username:"",
    password:""
};
RouteSms.prototype.doc = {
    sender:{
        type:{
            5:"Plain Text",
            7:"Flash Message"
        },
        dlr:{
            0:"No delivery report",
            1:"Send delivery report"
        }
    }
};
RouteSms.prototype.sender = {
    type:'sms',
    dlr:0,
    path:"/bulksms/bulksms?",
    destinaton:[],//array of numbers
    source:"",
    message:""
};

RouteSms.prototype.support = {
    voice: false,
    sms: true,
    flash: true
};

RouteSms.prototype.type_converter = {"sms":5, "flash":7};

RouteSms.prototype.send = function(){
    var message_type = undefined;
    var callback = null;
    if(arguments.length === 1){
        callback = arguments[0];
    }
    else{
        message_type = arguments[0];
        callback = arguments[1];
    }
    if(message_type !== undefined){
        this.sender.type = message_type;
    }
    if(this.sender.source.length > 11) callback({status:0,message:"Invalid Message Source, Text should not be > 11 char",message_id:null});
    if(!(message_type in this.type_converter)) callback({status:0,message:"Unsupported Message Type",message_id:null});
    var dest_string = "";
    if(this.sender.destinaton instanceof Array){
        for(var i=0;i<this.sender.destinaton.length;i++){
            dest_string+=this.sender.destinaton[i];
            if(i<(this.sender.destinaton.length-1)) dest_string+=",";
        }
        var apiRequestOptions = {
            uri: "http://"+this.connection.host+":"+this.connection.port+
                    this.sender.path+"username="+this.connection.username+"&password="+
                    this.connection.password+"&type="+this.type_converter[this.sender.type ]+"&dlr="+this.sender.dlr+
                    "&source="+urlencode(this.sender.source)+"&message="+urlencode(this.sender.message)+"&destination="+
                    this.sender.destinaton
        };
        request.get(apiRequestOptions, function(errReq, resp, body){
            var response = body.split('|');
            if(response[0] === "1701"){
                callback({status:1, message:"Message processed successfully", message_id:response[2]});
            }
            else{
                var msg = errors(response[0]);
                callback({status:0, message:msg});
            }
        });
    }
    else{callback({status:0,message:"Message destination is currupt or badly formatted",message_id:null});}
};

module.exports = new RouteSms();
