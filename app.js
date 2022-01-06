var sliderContainer = document.querySelector(".slider-container")
var slides = document.querySelectorAll(".slide")
var next = document.querySelector(".next")
var prev = document.querySelector(".prev")
var navigationDots = document.querySelector(".navigation-Dots")
var slideWidth = sliderContainer.clientWidth
var numberofSlides = slides.length


let isDragging = false,
    startPos = 0,
    prevTranslate = 0,
    currentTranslate = 0,
    animationID = 0,
    currentSlide = 0,
    everyIncrease = 0;
slides.forEach((img, i) => {
    var sliderImage = img.querySelector("img")
    sliderImage.addEventListener("dragstart", (e)=> {
    e.preventDefault();})

    img.addEventListener("touchstart", touchStart(i))
    img.addEventListener("touchend", touchEnd)
    img.addEventListener("touchmove", touchMove)
    
    img.addEventListener("mousedown", touchStart(i))
    img.addEventListener("mouseup", touchEnd)
    img.addEventListener("mouseleave", touchEnd)
    img.addEventListener("mousemove", touchMove)
})
slides[0].classList.add("active")
createNavigationDots()




// Draggable Slider Start
function getPositionX(event) {
    return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX
}
function touchStart(i) {
    return function (event) {
        isDragging = true;
        currentSlide = i
        animationID = requestAnimationFrame(animation)
        startPos = getPositionX(event)
        sliderContainer.style.cursor = 'grabbing'
        clearInterval(interval)
        autoScroll();
    }
}
function touchMove(event) {
    if (isDragging) {
        var currentPos = getPositionX(event)
        currentTranslate = prevTranslate + currentPos - startPos
    }
}
function touchEnd() {
    cancelAnimationFrame(animationID)
    isDragging = false;
    var movedBy = currentTranslate - prevTranslate
    if (movedBy < -100 && currentSlide < numberofSlides - 1) {currentSlide++; everyIncrease = currentSlide * 5.5}
    if (movedBy > 100 && currentSlide > 0) {currentSlide--; everyIncrease = currentSlide * 5.5}
    setPositionByIndex();
    sliderContainer.style.cursor = 'grab'
    getActiveClass()
}
function animation() {
    setSliderPosition()
    if (isDragging) {
        requestAnimationFrame(animation)
    }
}
function setPositionByIndex() {
    currentTranslate = currentSlide * -slideWidth
    prevTranslate = currentTranslate
    setSliderPosition();
}
function setSliderPosition() {
    sliderContainer.style.transform = `translateX(${currentTranslate - everyIncrease - parseInt(window.getComputedStyle(slides[0]).getPropertyValue("margin-left"))}px)`
}
//  Draggable Slider End



function createNavigationDots() {
    for (let t = 0; t < numberofSlides; t++) {
        var dots = document.createElement("div")
        dots.classList.add("single-dot")

        navigationDots.appendChild(dots)
        dots.addEventListener("click",() => {
            clearInterval(interval)
            autoScroll();
            gotoSlide(t)
        })
    }
    navigationDots.children[0].classList.add("active")
}
next.addEventListener("click", () => {
    if (currentSlide >= numberofSlides - 1) {
        gotoSlide(0)
        clearInterval(interval)
        autoScroll();
        return
    }
    clearInterval(interval)
    autoScroll();
    currentSlide++;
    everyIncrease = currentSlide * 5.5
    gotoSlide(currentSlide)
})
prev.addEventListener("click", () => {
    if (currentSlide <= 0) {
        everyIncrease = (numberofSlides - 1) * 5.5
        gotoSlide(numberofSlides - 1)
        clearInterval(interval)
        autoScroll();
        return
    }
    clearInterval(interval)
    autoScroll();
    currentSlide--;
    everyIncrease = currentSlide * 5.5
    gotoSlide(currentSlide)
})
function gotoSlide(slideNumber) {
    var width = slideWidth * slideNumber
    var net = width + everyIncrease + parseInt(window.getComputedStyle(slides[0]).getPropertyValue("margin-left"))
    sliderContainer.style.transform = "translateX(-" + net + "px)"
    currentSlide = slideNumber
    everyIncrease = slideNumber
    getActiveClass()
}
function getActiveClass() {
    var activeSlide = document.querySelector(".active")
    activeSlide.classList.remove("active")
    slides[currentSlide].classList.add("active")

    var activeDot = document.querySelector(".single-dot.active")
    activeDot.classList.remove("active")
    navigationDots.children[currentSlide].classList.add("active")
}

var interval;
function autoScroll() {
    interval = setInterval(()=> {
        if (currentSlide >= numberofSlides - 1) {
            gotoSlide(0)
            return
        }
        currentSlide++;
        everyIncrease = currentSlide * 5.5
        gotoSlide(currentSlide)
    }, 2000)
}
autoScroll()
