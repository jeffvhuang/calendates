function initMap() {} // placed here as it must be in global scope to work.
(function() {

	if ($('div').is('#event-info-page') || $('div').is('#new-event-page')) {

		$('#end-date-checkbox').click(function() {
			$('#end-date-container').toggle('fast');
		});

		$('#edit-btn').click(function() {
			$('#edit-event').toggle('fast');
		});

	}

	// Load this javascript if page is eventinfo
	if ($('div').is('#event-info-page')) {
		//toggle display of static maps
		var maps = $('#maps');
		$('#maps-btn').click(function() {
			maps.toggle('slow');
		});


		var locality = $('#locality-div').text().replace(/ +/g, "+");
		var city = $('#city-div').text().replace(/ +/g, "+");
		var country = $('#country-div').text().replace(/ +/g, "+");

		// load static maps to be used as reference with js map
		// AIzaSyCup9ch8zCcZ6BAzwnp4RnC4f8L-FOkI-Y API key for google maps
		var url = "https://maps.googleapis.com/maps/api/staticmap";
		var apikey = "key=" + "AIzaSyCup9ch8zCcZ6BAzwnp4RnC4f8L-FOkI-Y";
		var size = "size=600x400";
		var zoom = "zoom=";
		// var address also to be used in javascript maps, so var center will concatenate it
		var center = "center=";
		var address = ""; 
		var marker = "markers=color:red%7C";
		var imgHTML;

		if (country == '' && city == '') { // if both are empty
			$('#location-div').append("<p>No location specified</p>");
			zoom += "1";
			address += "0,0";
			marker = "";
			center += address;
		} else if (city == '' && country != '') { // if there is only a country
			zoom += "3";
			address += country;
			marker = "";
			center += address;
		} else if (city != '' && country == '') { //if there is only a city
			if (locality != '') { // locality alos named, so append a map of that first
				zoom += "14";
				address += locality + "," + city;
				marker += locality + "," + city;
				center += address;
				// append map for locality
				url += '?' + center + '&' + zoom + '&' + size + '&' + marker + '&' + apikey;
				imgHTML = "<img src='" + url + "'>";
				maps.append(imgHTML);
			}
			// reinitialise each varibale since it has already been appended with locality
			url = "https://maps.googleapis.com/maps/api/staticmap";
			zoom = "zoom=6";
			center = "center=" + city;
			marker = "markers=color:red%7C" + city;
		} else { // else both city and country are named
			if (locality != '') { //locality also named > append maps for locality and city
				zoom += "14";
				address += locality + "," + city + "," + country;
				marker += locality + "," + city + "," + country;
				center += address;
				// append map for locality
				url += '?' + center + '&' + zoom + '&' + size + '&' + marker + '&' + apikey;
				imgHTML = "<img src='" + url + "'>";
				maps.append(imgHTML);
				//append map for city
			} 
			// reinitialise each varibale since it has already been appended with locality
			zoom = "zoom=6";
			center = "center=" + city + "," + country;
			marker = "markers=color:red%7C" + city + "," + country;
			url = "https://maps.googleapis.com/maps/api/staticmap";
		}

		url += '?' + center + '&' + zoom + '&' + size + '&' + marker + '&' + apikey;
		imgHTML = "<img src='" + url + "'>";
		maps.append(imgHTML);

		console.log("center is " + center);
		console.log(url);

		// load javascript interactive map
		var geocoder;
		var map;
		initMap = function() {
			geocoder = new google.maps.Geocoder();
			var eventlatlng = {lat: 0, lng: 0};
			//{lat: -25.344877, lng: 131.032854};
			map = new google.maps.Map(document.getElementById('map-js'), {
		      center: eventlatlng,
		      zoom: 4
		    });
		    codeAddress();
		};

		function codeAddress() {
			// add commas using if else staements
			console.log("address is " + address);
			geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == 'OK') {
					map.setCenter(results[0].geometry.location);
			        var marker = new google.maps.Marker({
			            map: map,
			            position: results[0].geometry.location
			        });
				} else {
					console.log('Geocode was not successful for the following reason: ' + status);
				}
			});
		}
	}

})();