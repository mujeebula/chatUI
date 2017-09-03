var stompClient;
var sessionId;
var username;
var id;
var currentChatUserId;
var firstName;
var lastName;
var contacts;
var messages;
(function() {
	socket = new SockJS('http://localhost:8090/gs-guide-websocket');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		console.log('Connected: ' + frame);
		sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
		console.log(sessionId);
		console.log(getURLParameter("username"));
		username = getURLParameter("username");
		subscribe();
	});
})();

function subscribe() {
	console.log("Subscribing topics");
	stompClient.subscribe('/topic/greeting-' + sessionId, handleGreetings);
	stompClient.subscribe('/topic/contacts-' + sessionId, handleContacts);
	stompClient.subscribe('/topic/userDetails-' + sessionId, handleUserDetails);
	stompClient.subscribe('/topic/search-' + sessionId, handleSearch);
	stompClient.send("/app/init", {}, JSON.stringify({
		'username' : getURLParameter("username")
	}));
}

function handleUserDetails(userDetails){
	console.log("/topic/userDetails-->" + userDetails.body);
	userDetails = JSON.parse(userDetails.body);
	username = userDetails.username;
	id = userDetails.id;
	firstName = userDetails.firstName;
	lastName = userDetails.lastName;
	$("#myusername").text("#"+id+" "+username);
}

function handleGreetings(greetings){
	console.log("From:/topic/greeting-->" + greetings.body);
	messages = JSON.parse(greetings.body);
	console.log(messages);
	insertMessages();
}

function insertMessages(){
	$('#conversation').html("");
	for(var i = 0; i < messages.length; i++){
		if(messages[i].senderId == id){
			$('#conversation').append('<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">'+
					messages[i].content + '</div><span class="message-time pull-right"> Sun </span></div></div></div>');
		}else{
			$('#conversation').append('<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">'+
					messages[i].content + '</div><span class="message-time pull-right"> Sun </span></div></div></div>');
		}
	}
}

function handleContacts(receivedContacts){
	console.log("From:/topic/contacts-->" + receivedContacts.body);
	contacts = JSON.parse(receivedContacts.body);
	insertContacts();
}

function insertContacts(){
	for(var i = 0; i < contacts.length; i++){
		$('#allContactDiv').append('<div'+' id='+i+' onclick="fetchMessages(this.id)" class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'
				+ contacts[i].username + '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div>');
	}
}

function fetchMessages(index){
	console.log("Fetching..." + index);
	console.log("Contact:" + contacts[index]);
	contact = contacts[index];
	currentChatUserId = contacts[index].id;
	currentChatUser = contacts[index].username;
	$("#currentChatUser").html(currentChatUser);
	getAllMessages(contact);
}

function getAllMessages(contact){
	stompClient.send("/app/getAllMessages", {}, JSON.stringify({
		'sendername' : username,
		'receivername' : contact.username
	}));
}

function sendMessage() {
	message = $("#comment").val();
	console.log("Sending message");
	stompClient.send("/app/message", {}, JSON.stringify({
		"senderId": id,
		"receiverId" : currentChatUserId,
		"toUserOrGroup": true,
		"content" : message
	}));
	$('#conversation').append('<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">'+
			message + '</div><span class="message-time pull-right"> Sun </span></div></div></div>');
}

function searchUsers(){
	var keyword = $("#keyword").val();
	console.log("Searching for:" + keyword);
	stompClient.send("/app/search", {}, JSON.stringify({
		"keyword": keyword,
		"username": username
	}));
}

function handleSearch(result){
	$("#searchResults").html("");
	console.log(result.body);
	result = JSON.parse(result.body);
	for(var i = 0; i < result.length; i++){
		$("#searchResults").append('<div class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'+
				result[i].username + '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div>');
	}
}

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '='
			+ '([^&;]+?)(&|#|;|$)').exec(location.search) || [ null, '' ])[1]
			.replace(/\+/g, '%20'))
			|| null;
}