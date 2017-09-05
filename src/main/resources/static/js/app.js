var stompClient;
var sessionId;
var username;
var id;
var currentChatUserId;
var firstName;
var lastName;
var contacts;
var messages;
var privateMessage;
var searchResults;
var contactSearchResults;
/*
 * This anonymous function connects the client to webSocket end point. 
 */
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

/*
 * It sends request to subscribes all the required topic.
 */
function subscribe() {
	console.log("Subscribing topics");
	stompClient.subscribe('/topic/allConversationMessage-' + sessionId, handleConversation);
	stompClient.subscribe('/topic/privateMessage-' + sessionId,
			handlePrivateMessage);
	stompClient.subscribe('/topic/contacts-' + sessionId, handleContacts);
	stompClient.subscribe('/topic/userDetails-' + sessionId, handleUserDetails);
	stompClient.subscribe('/topic/search-' + sessionId, handleSearch);
	stompClient.send("/app/init", {}, JSON.stringify({
		'username' : getURLParameter("username")
	}));
}

function handlePrivateMessage(message) {
	privateMessage = JSON.parse(message.body);
	console.log("From:/topic/privateMessage-->"
			+ JSON.stringify(privateMessage));
	insertPrivateMessage();
}

function handleUserDetails(userDetails) {
	console.log("/topic/userDetails-->" + userDetails.body);
	userDetails = JSON.parse(userDetails.body);
	username = userDetails.username;
	id = userDetails.id;
	firstName = userDetails.firstName;
	lastName = userDetails.lastName;
	$("#myusername").text(firstName + " " + lastName);
}

function handleConversation(conversation) {
	console.log("From:/topic/conversation-->" + conversation.body);
	messages = JSON.parse(conversation.body);
	console.log(messages);
	insertMessages();
}

/*
 * It inserts all the received messages into conversation div
 */
function insertMessages() {
	$('#conversation').html("");
	for (var i = 0; i < messages.length; i++) {
		var dateTime = new Date(messages[i].created);
		dateTime = getFormattedDateTime(dateTime);
		if (messages[i].senderId == id) {
			$('#conversation')
					.append(
							'<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">'
									+ messages[i].content
									+ '</div><span class="message-time pull-right">'
									+ dateTime + '</span></div></div></div>');
		} else {
			$('#conversation')
					.append(
							'<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">'
									+ messages[i].content
									+ '</div><span class="message-time pull-right">'
									+ dateTime + '</span></div></div></div>');
		}
	}
	$('#conversation').animate({
		scrollTop : $('#conversation').get(0).scrollHeight
	}, 1500);
}

/*
 * It inserts a newly arrived private message into conversation div
 */
function insertPrivateMessage() {
	if (currentChatUserId == privateMessage.senderId
			|| currentChatUserId == privateMessage.receiverId) {
		console.log("Inserting private message:"
				+ JSON.stringify(privateMessage));
		var dateTime = new Date(privateMessage.created);
		dateTime = getFormattedDateTime(dateTime);
		console.log(dateTime);
		if (privateMessage.senderId == id) {
			$('#conversation')
					.append(
							'<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">'
									+ privateMessage.content
									+ '</div><span class="message-time pull-right">'
									+ dateTime + '</span></div></div></div>');
		} else {
			$('#conversation')
					.append(
							'<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">'
									+ privateMessage.content
									+ '</div><span class="message-time pull-right">'
									+ dateTime + '</span></div></div></div>');
		}
		$('#conversation').animate({
			scrollTop : $('#conversation').get(0).scrollHeight
		}, 1500);
	} else {
		// show new message notification
	}
}

function handleContacts(receivedContacts) {
	console.log("From:/topic/contacts-->" + receivedContacts.body);
	contacts = JSON.parse(receivedContacts.body);
	insertContacts();
}

/*
 * This method inserts all the user contacts into allContactDiv
 */
function insertContacts() {
	$('#allContactDiv').html("");
	for (var i = 0; i < contacts.length; i++) {
		$('#allContactDiv')
				.append(
						'<div'
								+ ' id='
								+ i
								+ ' onclick="fetchMessages(this.id)" class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'
								+ contacts[i].username
								+ '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div>');
	}
}

/*
 * This method fetches all the messages between the selected contact and the user.
 */
function fetchMessages(index) {
	console.log("Fetching..." + index);
	console.log("Contact:" + JSON.stringify(contacts[index]));
	contact = contacts[index];
	currentChatUserId = contacts[index].id;
	currentChatUser = contacts[index].username;
	$("#currentChatUser").html(currentChatUser);
	console.log("Selected chatUser details:" + JSON.stringify(contact));
	getAllMessages(contact);
}

function getAllMessages(contact) {
	stompClient.send("/app/getAllMessages", {}, JSON.stringify({
		'sendername' : username,
		'receivername' : contact.username
	}));
}

/*
 * It sends the message to the web socket server for further processing.
 */
function sendMessage() {
	message = $("#comment").val();
	console.log("Sending message");
	stompClient.send("/app/message", {}, JSON.stringify({
		"senderId" : id,
		"receiverId" : currentChatUserId,
		"toUserOrGroup" : true,
		"content" : message
	}));
	$("#comment").val("");
}

/*
 * This method requests the server to get all the user names starting with the 
 * typed keyword.
 */
function searchUsers() {
	var keyword = $("#keyword").val();
	console.log("Searching for:" + keyword);
	stompClient.send("/app/search", {}, JSON.stringify({
		"keyword" : keyword,
		"username" : username
	}));
}

/*
 * It handles and shows the search results received from the server.
 */
function handleSearch(result) {
	$("#searchResults").html("");
	console.log(result.body);
	searchResults = JSON.parse(result.body);
	for (var i = 0; i < searchResults.length; i++) {
		$("#searchResults")
				.append(
						'<div id="'
								+ i
								+ '" onclick="addContact(this.id)" class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'
								+ searchResults[i].username
								+ '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div>');
	}
}

/*
 * Requests the server to add this user as a contact.
 */
function addContact(index) {
	// hide search panel
	$(".side-two").css({
		"left" : "-100%"
	});
	var selectedContact = searchResults[index];
	contacts.push(selectedContact);
	console.log(selectedContact);
	$('#allContactDiv')
			.append(
					'<div onclick="fetchMessages(this.id)" class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'
							+ selectedContact.username
							+ '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div>');
	currentChatUserId = selectedContact.id;
	currentChatUser = selectedContact.username;
	$("#currentChatUser").html(currentChatUser);
	stompClient.send("/app/addContact", {}, JSON.stringify({
		"userId" : id,
		"contactId" : selectedContact.id
	}));
	getAllMessages(selectedContact);
}

function filterIt(objects, searchKey) {
	var results = [];
	var toSearch = searchKey;
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].username.indexOf(toSearch) != -1) {
			results.push(objects[i]);
		}
	}
	return results;
}

function fetchMessagesForSearchedUser(index) {
	for (var i = 0; i < contacts.length; i++) {
		if (contactSearchResults[index].username == contacts[i].username) {
			fetchMessages(i);
			break;
		}
	}
}

/*
 * Search the available contacts in allContactsDiv
 */
function searchContacts() {
	$('#allContactDiv').html("");
	var keyword = $("#searchContacts").val();
	console.log("Searching contacts for:" + keyword);
	if (keyword.length > 0) {
		contactSearchResults = filterIt(contacts, keyword);
		console.log(contactSearchResults);
		for (var i = 0; i < contactSearchResults.length; i++) {
			$('#allContactDiv')
					.append(
							'<div'
									+ ' id='
									+ i
									+ ' onclick="fetchMessagesForSearchedUser(this.id)" class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'
									+ contactSearchResults[i].username
									+ '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div>');
		}
	} else {
		// show all contacts
		for (var i = 0; i < contacts.length; i++) {
			$('#allContactDiv')
					.append(
							'<div'
									+ ' id='
									+ i
									+ ' onclick="fetchMessages(this.id)" class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'
									+ contacts[i].username
									+ '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right">18:18 </span></div></div></div></div>');
		}
	}
}


/*
 * Utility function
 */
function checkEnterKey(e) {
	if (e.keyCode == 13) {
		sendMessage();
		return false;
	}
}

/*
 * Utility function
 */
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '='
			+ '([^&;]+?)(&|#|;|$)').exec(location.search) || [ null, '' ])[1]
			.replace(/\+/g, '%20'))
			|| null;
}

/*
 * Utility function
 */
function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

/*
 * Utility function
 */
function getFormattedDateTime(dateTime) {
	var d = dateTime;
	var date = addZero(d.getDate());
	var month = addZero(d.getMonth() + 1);
	var year = addZero(d.getFullYear());
	var h = addZero(d.getHours());
	var m = addZero(d.getMinutes());
	var s = addZero(d.getSeconds());
	return h + ":" + m + ":" + s;// + " " + date + "/" + month + "/" + year;
}