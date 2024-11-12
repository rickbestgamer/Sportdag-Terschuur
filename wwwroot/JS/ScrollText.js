/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

window.onload = function () {
    const containers = document.querySelectorAll(".ScrollingTextContainer");
    if (!containers)
        return;
    function checkTextWidth() {
        containers.forEach((container) => {
            const text = container.querySelector(".ScrollingText");
            const wrapper = container.querySelector(".ScrollWrapper");
            const paddingLeft = parseFloat(getComputedStyle(text).paddingLeft);
            if (!text || !wrapper)
                return;
            if (text.scrollWidth - paddingLeft > container.clientWidth) {
                wrapper.classList.add("animate");
                const totalWidth = text.scrollWidth;
                const duration = totalWidth / 50;
                wrapper.style.animation = `scrollText ${duration}s linear infinite`;
            }
            else {
                wrapper.style.animation = "none";
                wrapper.classList.remove("animate");
            }
        });
    }
    checkTextWidth();
    window.addEventListener("resize", checkTextWidth);
};

/******/ })()
;