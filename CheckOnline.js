$(function() {
	//establish variables
	var $displayTable = $("#displayTable");
	var $displayTable2 = $("#displayTable2");
	var loginNames = ["TheSTINGIN", "AntonioAsh", "Atlas", "Chachava", "Crittle888", "Grimli", "HrvstrOfEnergy",
                    "Jansey", "princess___lissy", "TheOptionalOath", "WhiteFyr", "yogscast"]
	var urlString = "";
	var urlString2 = "";
	var statusString = "";
	var htmlString = "";
	var htmlString2 = "";
  var liveStreamers = []

//create urlString with loginName array
	for (var i = 0; i < loginNames.length; i++){
		if (loginNames.length > i-1) {
			urlString += "login=" + loginNames[i] + "&";
			statusString += "user_login=" + loginNames[i] + "&";
		} else {
			urlString += "login=" + loginNames[i];
			statusString += "user_login=" + loginNames[i];
		}

//get user data
	}
	$.ajax({
		type: 'GET',
		url: "https://api.twitch.tv/helix/users?" + urlString,
		headers: {
			'Client-ID': '7b4w6b4fjx7llf1dcudr2fhpnr5uxr'
		},
		success: function(profileData) {
			console.log(profileData);

			createTable(profileData);
		}
	});

//display userdata
	function createTable (profileData) {

		for (var j = 0; j < profileData.data.length; j++){
			htmlString +=
			"<div class=\"row\"><div class=\"col span-1-of-12\"><img src=\"" +
			profileData.data[j].profile_image_url +
			"\" height=\"70px\" width=\"70px\"></div><div class=\"col span-4-of-12\"><h2><a href=\"https://www.twitch.tv/" +
			profileData.data[j].display_name +
			"\" target=\"_blank\">" +
			profileData.data[j].display_name +
			"</a></h2><h5 id=\"" +
			profileData.data[j].display_name +
			"\">Offline</h5></div><div class=\"col span-7-of-12\"><h4 id=\"desc" +
			profileData.data[j].display_name +
			"\">" +
			profileData.data[j].description +
			"</h4></div></div> ";

		}

//console.log(htmlString);
		displayTable.insertAdjacentHTML("beforeend", htmlString);
		checkStatus(profileData);
	};

//check to see if users are offline or live
	function checkStatus(profileData) {
		$.ajax({
			type: 'GET',
			url: "https://api.twitch.tv/helix/streams?" + statusString,
			headers: {
				'Client-ID': '7b4w6b4fjx7llf1dcudr2fhpnr5uxr'
			},
			success: function(newData) {

			if (newData.data.length === 0) {



				} else {
					for (var i=0; i<newData.data.length; i++){
						for (var j = 0; j<profileData.data.length; j++){
							console.log(newData.data[i].user_id);
							console.log(profileData.data[j].id);
							if(newData.data[i].user_id === profileData.data[j].id) {
								var profileStatus = document.getElementById(profileData.data[j].display_name);
								var descName = "desc"+ profileData.data[j].display_name;
								var newDescription = document.getElementById(descName);
								profileStatus.innerHTML = "<strong class=\"live\">Live</strong>";
								newDescription.innerHTML = newData.data[i].title;
                liveStreamers.push(profileData.data[j].display_name);
							}
						}
					}

          console.log(liveStreamers);
          for (var i = 0; i < liveStreamers.length; i++) {
            var source = "https://player.twitch.tv/?"+liveStreamers[i];
            <iframe
              src = source;
              height="<height>"
              width="<width>"
              frameborder="<frameborder>"
              scrolling="<scrolling>"
              allowfullscreen="<allowfullscreen>">
            </iframe>

          }
				}
			}
		});
	};
});
