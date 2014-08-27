'use strict';

angular.module('ProfileApp')
  	.controller('loadConfigCtrl',['$scope','$rootScope','$http','configFile','GitHubApi', function ($scope,$rootScope,$http,configFile,GitHubApi) {

		var offline=true;
		
		
		//if($location.path=="offline"){offline=true;}



		$rootScope.mode="config";//this will let you use different css on config and welcome page
		console.log("loadConfigCtrl controller loaded,css mode: "+$rootScope.mode);
		//all data will be reusable from here
		$rootScope.apiProfile={ "github":{"user":"","repos":""},"twitter":{},"linkedin":{},"extra":{} };


		//-1--Get config file- Need to make all calls and get API datas
		$scope.loadConfiguration = function(file) {
			console.info("--> loadConfiguration");
  			configFile.loadconfig(file).then(
	            function(response) { //success
	            	$rootScope.config=response;
	            	$rootScope.configSTR=JSON.stringify(response, 2, "\t");
	            	if(offline==true){// load from OFFLINE
	            		$scope.loadFile("githubrepos.json");
	            		$scope.loadFile("githubuser.json");
	            		$scope.loadFile("twitter.json");

	            	}else{//load data from ONLINE
	            		
	            		//github
	            			$scope.connectGithub($rootScope.config.github.user);
	            		//twitter
	            			$scope.loadTweets($rootScope.config.twitter.userCredential,$rootScope.config.twitter.user);
	            		//linkedin this will take data if you are login.But the mock data will date from a JSON file
	            			$scope.reloadLinkedin();
	            	}

	            	


	            }, function(response) {//failed
	            	console.error("Error getting profile.json");
                	console.log(response);
            });

	    };

  		$scope.loadConfiguration("profile.json"); //confgi profile JSON of all accounts

  		//-2--Get linkedin profile from file
		$scope.loadFile = function(file,path) {
			console.info("--> load Linkedin Profile from file");
  			configFile.loadconfig(file,"offline").then(
	            function(response) { //success

	            	if (file=="linkedin.json"){
	            		$rootScope.apiProfile.linkedin=response;

  					}else if(file=="githubuser.json"){
						$rootScope.apiProfile.github.user=response;

  					}else if(file=="githubrepos.json"){
						$rootScope.apiProfile.github.repos=response;

  					}else if(file=="twitter.json"){
						$rootScope.apiProfile.twitter=response;

  					}else if(file=="extra.json"){
						$rootScope.apiProfile.extra=response;
  					}

	            }, function(response) {//failed
	            	console.error("Error getting the json file "+file);
                console.log(response);
            });

	    };

  		
  		$scope.loadFile("linkedin.json");


  		
  		$scope.loadFile("extra.json");
  		


		//-----GITHUB
	  		$scope.connectGithub = function(user) {
				console.info("--> connectGithub");
				GitHubApi.getUserData(user).then(
		            function(response) { //success
		            	$rootScope.githubUser=response;
		            	$rootScope.apiProfile.github.user=response;
		                //console.log(response);
		            }, function(response) {//failed
		                console.log(response);
		            });

				GitHubApi.getRepos(user).then(
		            function(response) { //success
		            	$rootScope.githubRepos=response;
		            	$rootScope.apiProfile.github.repos=response;
		                //console.log(response);
		            }, function(response) {//failed
		                console.log(response);
		            });
				};

		//---- TWITTER



					    $scope.twitterAsk = function() { //not ready
					    	console.info("--> twitterAsk");

					        cb.__call(
					            "oauth_requestToken", {
					                oauth_callback: "oob"
					            },
					            function(reply) {
					                // stores it
					                cb.setToken(reply.oauth_token, reply.oauth_token_secret);
					                //console.log("oauth_requestToken");
					                //console.log(reply);
					                // gets the authorize screen URL
					                cb.__call(
					                    "oauth_authorize", {},
					                    function(auth_url) {
					                        window.codebird_auth = window.open(auth_url);
					                    }
					                );
					            }
					        );
					    };

					    $scope.twitterJoin = function() {

					        cb.__call(
					            "oauth_accessToken", {
					                oauth_verifier: document.getElementById("PINFIELD").value
					            },
					            function(reply) {
					                // store the authenticated token, which may be different from the request token (!)
					                cb.setToken(reply.oauth_token, reply.oauth_token_secret);
					                
					                $rootScope.config.twitter.userCredential={
					                    "token": reply.oauth_token,
					                    "tokenSecret": reply.oauth_token_secret
					                };; //update it
					            }
					        );
					    };

					    $scope.loadTweets = function(credentials,twitterUser) {
					    	console.info("--> loadTweets");
					    	//console.log(credentials);
					    	//console.log(twitterUser);

					    	cb.setToken(credentials.token, credentials.tokenSecret);

									    
										cb.__call(
										    "search_tweets",
										    "q="+twitterUser,
										    function (reply, rate_limit_status) {
										    	//console.info("query");
										        //console.log(rate_limit_status);
										        //console.log(reply);
										          	$scope.$apply(function () {
											            $rootScope.tweets= reply.statuses;
											            $rootScope.apiProfile.twitter=reply.statuses;
											             console.info("-------");
											            console.info(reply.statuses);
											            
											        });
										        
										    }
										);


					    };
					    


		//--Linkedin

				var allfields=["first-name","last-name","headline","location:(name)","picture-url","email-address","phone-numbers","languages","industry","num-connections","last-modified-timestamp","publications","certifications","educations","courses","positions","num-recommenders","recommendations-received","skills","group-memberships","network"];

				   // 1. Runs when the JavaScript framework is loaded
				    function onLinkedInLoad(e) {
				      IN.Event.on(IN, "auth", onLinkedInAuth);
				      
				    }

				    // 2. Runs when the viewer has authenticated
				    function onLinkedInAuth(e) {
				    	//console.info(IN);
				      IN.API.Profile("me").fields(allfields).result(displayProfiles);
				    }


			        function displayProfiles(profiles) {
			        	console.info("--> Linkedin profile");
			        	//console.log(profiles);
			        	$scope.$apply(function () {
				            $rootScope.linkedinData = profiles.values[0];
			            	//console.log($rootScope.linkedinData);
				        });
			            
			        }

			        $scope.reloadLinkedin = function(user) {
			        	onLinkedInLoad();
			        }
			        

  	}])

  	.controller('welcomeCtrl',['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {
  		$rootScope.mode="cv";
		console.log("welcome controller loaded,css mode: "+$rootScope.mode);
		//Made a call to get data from apis using the data config
		//api data to scope

		$timeout(function(){


				 $("#recomendations").owlCarousel({
				      navigation : true, // Show next and prev buttons
				      slideSpeed : 300,
				      paginationSpeed : 400,
				      singleItem:true
				 
				  });

 

			$('a').click(function(){
					    $('html, body').animate({
					        scrollTop: $( $.attr(this, 'href') ).offset().top
					    }, 500);
					    return false;
					});
		}, 0);

		

  	}])
  

  	.controller('twitterCtrl',['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {


			 
				 	$timeout(function(){
				       			$("#other").owlCarousel({
								      navigation : true, // Show next and prev buttons
								      slideSpeed : 300,
								      paginationSpeed : 400,
								      singleItem:true
								 
								  }); 
				    }, 0);
			   



  	}])
  	.controller('jobsCtrl',['$scope','$rootScope','$timeout', function ($scope,$rootScope,$timeout) {



  		$timeout(function(){


		

				 $("#jobs").owlCarousel({
				      navigation : true, // Show next and prev buttons
				      slideSpeed : 300,
				      paginationSpeed : 400,
				      singleItem:true
				 
				  });

 

		}, 0);




  }]);
