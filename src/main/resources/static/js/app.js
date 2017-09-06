var stompClient;
var sessionId;
var username;
var id;
var currentConversationId;
var firstName;
var lastName;
var contacts;
var messages;
var privateMessage;
var searchResults;
var contactSearchResults;
var selectedConversation;

var conversations = [];
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
	// stompClient.subscribe('/topic/allConversationMessage-' + sessionId,
	// handleConversation);
	// stompClient.subscribe('/topic/privateMessage-' + sessionId,
	// handlePrivateMessage);
	// stompClient.subscribe('/topic/contacts-' + sessionId, handleContacts);
	// User details like name user name user id
	stompClient.subscribe('/topic/userDetails-' + sessionId, handleUserDetails);
	// fetch all conversation user is involved in already
	stompClient.subscribe('/topic/conversations-' + sessionId,
			handleConversation);
	// get all messages of the selected conversation
	stompClient.subscribe('/topic/conversation-message-' + sessionId,
			handleConversationMessages);
	// search user names
	// stompClient.subscribe('/topic/search-' + sessionId, handleSearch);
	// Initialize
	stompClient.send("/app/getConversations", {}, JSON.stringify({
		'username' : getURLParameter("username")
	}));
}

function handleUserDetails(userDetails) {
	console.log("/topic/userDetails-->" + userDetails.body);
	var userDetails = JSON.parse(userDetails.body);
	username = userDetails.username;
	id = userDetails.userId;
	firstName = userDetails.firstName;
	lastName = userDetails.lastName;
	$("#myusername").text(firstName + " " + lastName);
}

function handleConversation(cons) {
	console.log("BODY:" + cons.body);
	conversations = JSON.parse(cons.body);
	console.log(typeof conversations);
	insertConversations(conversations);
}

function handleConversationMessages(conversationMessages) {
	conversationMessages = JSON.parse(conversationMessages.body);
	if (isArray(conversationMessages)) {
		$('#conversation').html("");
		console.log(conversationMessages.body);
		for (var i = 0; i < conversationMessages.length; i++) {
			var dateTime = new Date(conversationMessages[i].createdAt);
			dateTime = getFormattedDateTime(dateTime);
			console.log(dateTime);
			if (conversationMessages[i].senderParticipantId == id) {
				$('#conversation')
						.append(
								'<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">'
										+ conversationMessages[i].textMessage
										+ '</div><span class="message-time pull-right">'
										+ dateTime
										+ '</span></div></div></div>');
			} else {
				$('#conversation')
						.append(
								'<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">'
										+ conversationMessages[i].textMessage
										+ '</div><span class="message-time pull-right">'
										+ dateTime
										+ '</span></div></div></div>');
			}
		}
	} else {
		console.log("Single message received");
		if(currentConversationId == conversationMessages.conversationId){
			var dateTime = new Date(conversationMessages.createdAt);
			dateTime = getFormattedDateTime(dateTime);
			console.log(dateTime);
			if (conversationMessages.senderParticipantId == id) {
				$('#conversation')
						.append(
								'<div class="row message-body"><div class="col-sm-12 message-main-sender"><div class="sender"><div class="message-text">'
										+ conversationMessages.textMessage
										+ '</div><span class="message-time pull-right">'
										+ dateTime
										+ '</span></div></div></div>');
			} else {
				$('#conversation')
						.append(
								'<div class="row message-body"><div class="col-sm-12 message-main-receiver"><div class="receiver"><div class="message-text">'
										+ conversationMessages.textMessage
										+ '</div><span class="message-time pull-right">'
										+ dateTime
										+ '</span></div></div></div>');
			}
		}
	}

	$('#conversation').animate({
		scrollTop : $('#conversation').get(0).scrollHeight
	}, 1500);
}

function insertConversations(conversations) {
	console.log("Inserting conversations : count=" + conversations.length);
	$('#allContactDiv').html("");
	for (var i = 0; i < conversations.length; i++) {
		$('#allContactDiv')
				.append(
						'<div'
								+ ' id='
								+ i
								+ ' onclick="fetchConversationMessages(this.id)" class="row sideBar-body"><div class="col-sm-3 col-xs-3 sideBar-avatar"><div class="avatar-icon"><img src="http://shurl.esy.es/y"></img></div></div><div class="col-sm-9 col-xs-9 sideBar-main"><div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"><span class="name-meta">'
								+ conversations[i].name
								+ '</span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"><span class="time-meta pull-right"></span></div></div></div></div>');
	}
}

function fetchConversationMessages(index) {
	console.log(typeof Array);
	index = parseInt(index);
	console.log(index + "= id Fetching messages for conversation:"
			+ JSON.stringify(conversations[index]));
	selectedConversation = conversations[index];
	currentChatName = conversations[index].name;
	currentConversationId = selectedConversation.conversationId;
	$("#currentChatName").html(currentChatName);
	stompClient.send("/app/getConversationMessages", {}, JSON.stringify({
		'conversationId' : selectedConversation.conversationId,
		"name" : username
	}));
}

function sendMessage() {
	message = $("#comment").val();
	console.log("Sendingmessage:" + message);
	stompClient.send("/app/send", {}, JSON.stringify({
		"conversationId" : currentConversationId,
		"textMessage" : message,
		"senderId" : id
	}));
	$("#comment").val("");
}

// Utility function to check whether the json string is array or object
function isArray(what) {
	return Object.prototype.toString.call(what) === '[object Array]';
}

// Utility function
function checkEnterKey(e) {
	if (e.keyCode == 13) {
		sendMessage();
		return false;
	}
}

// Utility function
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '='
			+ '([^&;]+?)(&|#|;|$)').exec(location.search) || [ null, '' ])[1]
			.replace(/\+/g, '%20'))
			|| null;
}

// Utility function
function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

// Utility function
function getFormattedDateTime(dateTime) {
	var d = dateTime;
	var date = addZero(d.getDate());
	var month = addZero(d.getMonth() + 1);
	var year = addZero(d.getFullYear());
	var h = addZero(d.getHours());
	var m = addZero(d.getMinutes());
	var s = addZero(d.getSeconds());
	return h + ":" + m + ":" + s;
}
