////////////////////////////////////////////////////////////////////////////////
// Booking cart logic
////////////////////////////////////////////////////////////////////////////////

let cartCounter = 0;
let cartWindow = document.querySelector("#cart-window");
let cartList = document.querySelector("#cart-list");
let bookButtons = document.querySelectorAll(".book-a-book-btn");

for (let i = 0; i < bookButtons.length; i++) {
	let self = bookButtons[i];

	// We're using an "inline" function to get access to "self"
	self.addEventListener('click', function(event) {
		let cartElement = document.createElement('div');
		cartElement.setAttribute('class', 'cart-element');

		let cartElementTitle = document.createElement('p');
		// cartElementTitle.textContent = self.closest("a h3").innerText;
		cartElementTitle.textContent = self.closest(".recommended-item").querySelector("h3").textContent;

		let cartElementRemoveBtn = document.createElement('button');
		cartElementRemoveBtn.textContent = "Remove";
		cartElementRemoveBtn.setAttribute('class', 'cart-remove-btn');
		cartElementRemoveBtn.addEventListener('click', function(event) {
			cartList.removeChild(cartElement); 
			cartCounter--;
			if (cartCounter <= 0) {
				cartWindow.style.display = "none";
			}
		});

		cartElement.appendChild(cartElementTitle);
		cartElement.appendChild(cartElementRemoveBtn);
		cartList.appendChild(cartElement);

		cartCounter++;
		cartWindow.style.display = "block";
	});
}


////////////////////////////////////////////////////////////////////////////////
// Hide log-in form
////////////////////////////////////////////////////////////////////////////////

let wrapperGrid = document.querySelector(".wrapper");
let aside = document.querySelector("aside");
let main = document.querySelector(".main");

// media query to apply rules only when true
let mediaQuery = window.matchMedia("(max-width = 800px)");

// login button logic
function triggerLogin() {
	if (aside.style.display == "none") {
		aside.style.display = "block";
		wrapperGrid.style.gridTemplateColumns = "";
	} else {
		aside.style.display = "none";
		wrapperGrid.style.gridTemplateColumns = "1fr"; // reset default value
	}
}

// change media query rules depending on screen width & wether aside is hidden
function mediaQueryAdjustGrid(event) {
	if (event.matches && aside.style.display == "none") {
		main.style.gridRowStart = "1";
	} else {
		main.style.gridRowStart = ""; // reset default value
	}
}

mediaQuery.addListener(mediaQueryAdjustGrid);

let loginButton = document.querySelector("#login-btn");
loginButton.addEventListener('click', triggerLogin);


////////////////////////////////////////////////////////////////////////////////
// Events Carousel
////////////////////////////////////////////////////////////////////////////////

/* In a realistic context, we would be likely to fetch the images
for the carousel from a database using PHP
and then find them in the script using QuerySelectors;
in this application, we create the images in js
and then prepend them to the carousel window. */

let carouselSlides = document.querySelector("#carousel-slides");
let nextBtn = document.querySelector(".arrow-btn-right");
let prevBtn = document.querySelector(".arrow-btn-left");

// the number 10 is hardcoded in this part of the code, but
// the program is meant to work also with a different amount of events
let slides = [];
for (let i = 0; i < 10; i++) {
	slides[i] = document.createElement('img');
	slides[i].setAttribute("src", "Images/events/designs/event_" + (i+1) + ".png");
	slides[i].setAttribute("alt", "Event preview");
	slides[i].setAttribute("class", "carousel-slide");

	if (i > 0) {	// hide all except the first slide
		slides[i].style.display = "none";
	}

	carouselSlides.prepend(slides[i]);
	// eventsCarousel.appendChild(slides[i]);
}

let currentSlide = 0;

// animations using Web Animations API:
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

function switchNextSlide() {
	// find out which slide is the next
	let nextSlide = (currentSlide + 1) % slides.length;
	console.log("next slide: " + nextSlide);	//debug
	console.log("current slide: " + currentSlide);	//debug

	// prepare two Keyframe objects to animate current and next slide
	let nextSlideKeys = [
		{ transform: "translateX(100%)" },
		{ transform: "translateX(0)" },
	];
	/* Why from -100% to -200%?? Why does it not work on the last slide??? */
	let currentSlideKeys = [
		{ transform: "translateX(-100%)" },
		{ transform: "translateX(-200%)" },
	];
	
	// unhide the next slide
	slides[nextSlide].style.display = "initial";

	// animate the current and next slides
	// one animation is assigned to a variable because
	// we need to listen for it to finish
	let currentSlideAnimation = slides[currentSlide].animate(currentSlideKeys, {
		duration: 300,
		easing: "ease-in-out",
	});
	slides[nextSlide].animate(nextSlideKeys, {
		duration: 300,
		easing: "ease-in-out",
	});

	//hide the first slide as soon as the animation is over
	currentSlideAnimation.addEventListener("finish", function() {
		// hide the first slide
		slides[currentSlide].style.display = "none";
		// set the new current slide
		currentSlide = nextSlide;
	});
}

function switchPrevSlide() {
	// find out which slide is the next
	let prevSlide = currentSlide - 1;
	if (prevSlide < 0) {
		prevSlide = slides.length - 1;
	}
	console.log("prev slide: " + prevSlide);	//debug
	console.log("current slide: " + currentSlide);	//debug

	// prepare two Keyframe objects to animate current and next slide
	let prevSlideKeys = [
		{ transform: "translateX(-200%)" },
		{ transform: "translateX(-100%)" },
	];
	/* Why from -100% to -200%?? Why does it not work on the last slide??? */
	let currentSlideKeys = [
		{ transform: "translateX(0)" },
		{ transform: "translateX(100%)" },
	];
	
	// unhide the next slide
	slides[prevSlide].style.display = "initial";

	// animate the current and next slides
	// one animation is assigned to a variable because
	// we need to listen for it to finish
	let currentSlideAnimation = slides[currentSlide].animate(currentSlideKeys, {
		duration: 300,
		easing: "ease-in-out",
	});
	slides[prevSlide].animate(prevSlideKeys, {
		duration: 300,
		easing: "ease-in-out",
	});

	//hide the first slide as soon as the animation is over
	currentSlideAnimation.addEventListener("finish", function() {
		// hide the first slide
		slides[currentSlide].style.display = "none";
		// set the new current slide
		currentSlide = prevSlide;
	});
}

// assign animation functions to carousel buttons
nextBtn.addEventListener("click", switchNextSlide);
prevBtn.addEventListener("click", switchPrevSlide);

// autoplay!
let slideInterval;

function startAutoplay() {
  slideInterval = setInterval(function() {
    switchNextSlide();
  }, 3000); // Change 3000 to the desired interval in milliseconds (3 seconds in this case)
}

function stopAutoplay() {
  clearInterval(slideInterval);
}

// Start autoplay when the page loads
startAutoplay();

// Stop autoplay when the user interacts with the slideshow
document.querySelector('#events-carousel').addEventListener('mouseover', stopAutoplay);
document.querySelector('#events-carousel').addEventListener('mouseout', startAutoplay);
