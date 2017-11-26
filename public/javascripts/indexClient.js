window.onload = function () {

	let btn = document.getElementById('button');
	let name = document.getElementById('name');
	let pass = document.getElementById('password');
	let xmlhttp = new XMLHttpRequest ();

	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log(xmlhttp.responseText);
		}
	};
	
	btn.addEventListener ('click', () => {
		
		xmlhttp.open ('POST', '/');
		xmlhttp.setRequestHeader('Authorization','Basic ' + btoa(name.value + ':' + pass.value));
		xmlhttp.send ();

	});

};
