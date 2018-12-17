$(function() {
	//establish variables
	var $displayTable = $("#displayTable");
	var $displayTable2 = $("#displayTable2");
	var loginNames = ["TheSTINGIN", "AntonioAsh", "Atlas", "Chachava", "Crittle888", "Grimli", "HrvstrOfEnergy",
                    "Jansey", "princess___lissy", "TheOptionalOath", "WhiteFyr"]
	var urlString = "";
	var urlString2 = "";
	var statusString = "";
	var htmlString = "";
	var htmlString2 = "";
  var liveStreamers = [];
  var offStreamers = [];

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
			"\">Offline</h5>" +
			"</div></div>";

		}

//console.log(htmlString);
		displayTable.insertAdjacentHTML("beforeend", htmlString);
		checkStatus(profileData);
	};

//check to see if users are offline or live
	function checkStatus(profileData) {
    console.log("StatusString = " + statusString);
		$.ajax({
			type: 'GET',
			url: "https://api.twitch.tv/helix/streams?" + statusString,
			headers: {
				'Client-ID': '7b4w6b4fjx7llf1dcudr2fhpnr5uxr'
			},
			success: function(newData) {
      console.log("newData = " +newData);
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
                liveStreamers.push(profileData.data[j].display_name);
                console.log("Type = ? "+profileData.data[j].started_at);
							} else {
                offStreamers.push(profileData.data[j].display_name);
                console.log("OffStreamers = "+offStreamers);
              }
						}
					}

          getStreamsofOnline();


          }
				}

		});
	};




  function getStreamsofOnline() {
    for (var i = 0; i < liveStreamers.length; i++) {
      var source = "https://player.twitch.tv/?channel="+liveStreamers[i];
      var iframe = "<iframe src="+ source + " height='720' width='1280' frameborder='0' scrolling='yes' allowfullscreen='true'></iframe>";
      console.log("iFrame = " + iframe);
      document.getElementById('streams').insertAdjacentHTML('beforeend', iframe);
  }
};
});
