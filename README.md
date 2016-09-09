# routesms
Simple Javascript Library for easy Route Mobile services integration: http://www.routemobile.com/ - SMS Gateway solution

**How to use ?**

```javascript
var routesms = require('routesms');

routesms.connection = {
    host:"route-sms-ip",
    port:"port-given",
    username:"xxxxxxx",
    password:"xxxxxxxxx"
};
routesms.sender.source = "message-from";
**use**
	* routesms.sender.destinaton.push('telephone-number'); //to send to a single telephone number
**or**
	* routesms.sender.destinaton.concat(array-of-many-numbers); // to send to many telephone numbers in bulk

routesms.sender.message = "message-content";

routesms.send('message-type [sms or flash]-optional(sms is default)', function(response){
  //response gives you {status: 0/1, message:"description-of-the-response-status", message_id:"message-id-on-successful-request"}
  console.log(response);
});
```
