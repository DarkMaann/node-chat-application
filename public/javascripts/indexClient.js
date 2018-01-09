// wait for a full page load
window.onload = function () {


	let logInButton = document.getElementById('logInButton');
	let signInButton = document.getElementById('signInButton');
	let name = document.getElementById('name');
	let pass = document.getElementById('password');
	let msg = document.getElementById('message');
	let xmlhttp = new XMLHttpRequest ();

	// add listener for change in ajax object
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			// change to home page or main page, depending on validity of credentials
			if (this.status == 200) {
				location.replace(xmlhttp.responseText);
			}
			if (this.status == 401) {
				pass.value = '';
				msg.innerHTML = xmlhttp.responseText;
			}
		}
	};
	

	logInButton.addEventListener('click', function() {
		
		// make a get request to /routes/login.js, sending credentials from input elements
		xmlhttp.open('GET', 'http://192.168.0.16:3000/login');
		xmlhttp.setRequestHeader('Authorization','Basic ' + btoa(name.value + ':' + pass.value));
		xmlhttp.send();

	});

	signInButton.addEventListener('click', function() {

		// make a get request to /routes/signin.js to get a form for signing in
		location.replace('http://192.168.0.16:3000/signin');

	});

};
