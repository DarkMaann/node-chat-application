window.onload = () => {
	
	
	let signinForm = document.getElementById('signinForm');
	let imageFile = document.getElementById('image');
	let imageLink = document.getElementById('imageLink');
	let preview = document.getElementById('imagePreview');

	
	// register listener for change event on input:file
	imageFile.addEventListener('change', function() {
		// delete previous image if it existed
		preview.innerHTML = '';

		// get the file(s) from input element when the change event is invoked
		let files = this.files;
		
		// create and append image to div container
		let img = document.createElement('img');
		img.id = 'thumbnail';
		preview.appendChild(img);
		
		// use File API to load a file (pic) from given url and attach an onload listener to display it in img element
		let reader = new FileReader();
		reader.onload = ((aImg) => {return (e) => {aImg.src = e.target.result;}; })(img);
		reader.readAsDataURL(files[0]);
	});


	// replace default input:file element because of ugliness with styled anchor element
	imageLink.addEventListener('click', function(e) {
		if (imageFile) imageFile.click();
		e.preventDefault();
	}, false); // ToDo: see if it works without false


	// // replace input#image.value (name of the picture uploaded) with dataURL
	signinForm.onsubmit = function() {
		imageFile.value = document.getElementById('thumbnail').src;
		alert(imageFile.value);
	};

};
