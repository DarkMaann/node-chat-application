// wait for a full page load
window.onload = function () {


	let btn = document.getElementById('button');
	let name = document.getElementById('name');
	let pass = document.getElementById('password');
	let msg = document.getElementById('message');
	let xmlhttp = new XMLHttpRequest ();

	// add listener for change in ajax object
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				location.replace(xmlhttp.responseText);
			} // change to home page or main page, depending on validity of credentials
			if (this.status == 401) {
				pass.value = '';
				msg.innerHTML = xmlhttp.responseText;
			}
		}
	};
	

	btn.addEventListener ('click', function() {
		
		// make a post request to /routes/login.js, sending credentials from input elements
		xmlhttp.open('GET', 'http://192.168.8.101:3000/login');
		xmlhttp.setRequestHeader('Authorization','Basic ' + btoa(name.value + ':' + pass.value));
		xmlhttp.send();

	});


};
