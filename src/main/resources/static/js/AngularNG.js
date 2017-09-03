angular
// Declare ngStomp as a dependency for you module
.module('app', [ 'ngStomp' ])

// use $stomp in your controllers, services, directives,...
.controller(
		'ChatCtrl',
		function($stomp, $scope, $log) {
			$stomp.setDebug(function(args) {
				$log.debug(args)
			})

			$stomp.connect('http://localhost:8090/gs-guide-websocket',
					null)

			// frame = CONNECTED headers
			.then(
					function(frame) {
						sessionId = /\/([^\/]+)\/websocket/
								.exec(socket._transport.url)[1];
						console.log(sessionId);
						var subscription = $stomp.subscribe('/topic/contacts-' + sessionId, function(
								payload, headers, res) {
							$scope.payload = payload
						}, {
							'headers' : 'are awesome'
						})

						/*// Unsubscribe
						subscription.unsubscribe()

						// Send message
						$stomp.send('/dest', {
							message : 'body'
						}, {
							priority : 9,
							custom : 42
						// Custom Headers
						})

						// Disconnect
						$stomp.disconnect().then(function() {
							$log.info('disconnected')
						})*/
					})
		})