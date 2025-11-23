"use strict";


function addHighlight(element) {
    element.classList.add("highlight");
};

function removeHighlight(element) {
    element.classList.remove("highlight");
};


function validateName() {
    let name = document.getElementById("name").value;
    if (name === "") {
        alert("Name must be filled out");
        return false;
    }
    return true;
};


function validateEmail(){
    let email = document.getElementById("email").value;
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;  // Because I do not know what the pattern is, I searched on Google. and this is the link: https://www.akto.io/tools/email-regex-Javascript-tester//
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        return false;
    }
    
};

window.onload = function () {
    let footer = document.querySelector("footer");
    let lastModified = document.createElement("p");
    lastModified.textContent = "Last Modified: " + document.lastModified;
    footer.appendChild(lastModified);
};

