LIGHT_SRC = "moon.png"
DARK_SRC = "sun.png"


// Project-Cards
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    
        const style = document.createElement("style");
        style.textContent = `
        :host {
            display: block;
            background-color: var(--bg-color2-light);
            padding: 20px;
            margin: 20px;
            border-radius: 8px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        } 
        picture img {
            width: 100%;
        }
        a {
            color: var(--main-pink-color);
        }
        a:hover {
            color: var(--darker-pink-color);
        }`;

        const template = document.createElement("div");
        template.innerHTML = `
        <h2></h2>
        <picture>
            <img src="" alt="">
        </picture>
        <p></p>
        <a href="" target="_blank">Learn More</a>
        `;
        this.shadowRoot.append(style, template);
    }
    connectedCallback() {
        this.shadowRoot.querySelector("h2").innerText = this.getAttribute("title");
        this.shadowRoot.querySelector("img").src = this.getAttribute("image");
        this.shadowRoot.querySelector("img").alt = this.getAttribute("alt");
        this.shadowRoot.querySelector("p").innerText = this.getAttribute("description");
        this.shadowRoot.querySelector("a").href = this.getAttribute("link");
    }
}
    
customElements.define("project-card", ProjectCard);



// now, getting card content from json file:

function loadLocally() {
    const container = document.querySelector(".card-container");

    // using localStorage API to get the json content
    let cards = JSON.parse(localStorage.getItem("cards")) || [];
  
    cards.forEach((cardData) => {
        const card = document.createElement("project-card");
        card.setAttribute("title", cardData.title);
        card.setAttribute("image", cardData.image);
        card.setAttribute("alt", cardData.alt);
        card.setAttribute("description", cardData.description);
        card.setAttribute("link", cardData.link);
        container.appendChild(card);
    });

    const btn = document.querySelector(".hide-cards");
    btn.innerHTML = `
        <button onclick="hideCards()">Hide Cards</button>
        `;
    
    setSavedTheme();
  }

  async function loadRemote() {
    const container = document.querySelector(".card-container");
    // bin url
    const url = "https://api.jsonbin.io/v3/b/67d5b6c78a456b79667663ad/latest";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);  // testing

        let cardArray = data.record.record;
        cardArray.forEach((cardData) => {
            const card = document.createElement("project-card");
            card.setAttribute("title", cardData.title);
            card.setAttribute("image", cardData.image);
            card.setAttribute("alt", cardData.alt);
            card.setAttribute("description", cardData.description);
            card.setAttribute("link", cardData.link);
            container.appendChild(card);
        });

        const btn = document.querySelector(".hide-cards");
        btn.innerHTML = `
            <button onclick="hideCards()">Hide Cards</button>
            `;

        setSavedTheme();
        
    } catch (error) {
        console.error("Error fetching JSON data:", error);
    }
}


// hides the cards
function hideCards() {
    const container = document.querySelector(".card-container");
    container.innerHTML = '';
    const btn = document.querySelector(".hide-cards");
    btn.innerHTML = '';
}


// light and dark modes

function setTheme(theme) {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    let textSquares = document.querySelectorAll('text-square');

    let forms = document.querySelectorAll('form');

    let cards = document.querySelectorAll('project-card');

    if (theme === 'dark'){
        root.style.setProperty('background', 'var(--bg-color-dark)');
        root.style.setProperty('color', 'var(--text-color-dark)');

        
        textSquares.forEach(function(square) {
            square.style.setProperty('background', 'var(--bg-color2-dark)');
        });

        forms.forEach(function(form) {
            form.style.setProperty('background', 'var(--bg-color2-dark)');
        });

        cards.forEach(function(cards) {
            cards.style.setProperty('background', 'var(--bg-color2-dark)')
        });

        toggle['src'] = DARK_SRC;

    }
    else{
        root.style.setProperty('background', 'var(--bg-color-light)');
        root.style.setProperty('color', 'var(--text-color-light)');

        textSquares.forEach(function(square) {
            square.style.setProperty('background', 'var(--bg-color2-light)');
        });

        forms.forEach(function(form) {
            form.style.setProperty('background', 'var(--bg-color2-light)');
        });

        cards.forEach(function(cards) {
            cards.style.setProperty('background', 'var(--bg-color2-light)')
        });

        toggle['src'] = LIGHT_SRC;
        
    }
}


function toggleTheme()
{
    const currTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currTheme === 'light'? 'dark': 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
}


function setSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) {
        setTheme(savedTheme);
        document.getElementById('themeToggle').checked = (savedTheme === 'dark');
    }
}

document.addEventListener('DOMContentLoaded', setSavedTheme);





// FORM

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("myForm");
    const fname = document.getElementById("fname");
    const lname = document.getElementById("lname");
    const email = document.getElementById("email");
    const comments = document.getElementById("comments");

    const fnameError = document.getElementById("fnameError");
    const lnameError = document.getElementById("lnameError");
    const emailError = document.getElementById("emailError");
    const commentsError = document.getElementById("commentsError");


    const formErrors = document.getElementById("form-errors");

    // array that will hold form errors 
    let form_errors = [];

    const MAX_COMMENT_LENGTH = 200;
    const WARNING_THRESHOLD = 50; 
    const ERROR_THRESHOLD = 5;

    // the allowed characters 
    const namePattern = /^[A-Za-z]+$/; 
    const emailPattern = /^[a-zA-Z0-9@._-]+$/; 
    const commentPattern = /^[A-Za-z0-9 .,!?'-]+$/; 

    // how to add to the errors array 
    function logError(fieldName, message) {
        form_errors.push({
            field: fieldName,
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    // function to count down remaining characters in comments
    function updateCharacterCount() {
        const charsRemaining = MAX_COMMENT_LENGTH - comments.value.length;

        commentsInfo.textContent = `${charsRemaining} characters remaining`;

        commentsInfo.classList.remove("warn", "error");

        if (charsRemaining <= ERROR_THRESHOLD) {
            commentsInfo.classList.add("error");
        } else if (charsRemaining <= WARNING_THRESHOLD) {
            commentsInfo.classList.add("warn");
        }
    }

    comments.addEventListener("input", updateCharacterCount);
    updateCharacterCount();

    // function to validate fields based on requirements 
    function validateField(field, errorElement, customMessage) {
        field.setCustomValidity("");
        if(!field.checkValidity()) {
            field.setCustomValidity(customMessage);
            errorElement.textContent = customMessage;

            // add error to errors array
            logError(field.name, customMessage);
        } 
        else {
            field.setCustomValidity("");
            errorElement.textContent = "";
        }
        field.reportValidity();
    }

    function preventInvalidInput(field, errorElement, pattern, customMessage) {
        field.addEventListener("input", function (event) {
            let value = field.value;
            if (!pattern.test(value) && value.length > 0) {
                field.classList.add("flash"); 
                errorElement.textContent = customMessage;

                logError(field.name, `Invalid character detected: ${value}`);

                setTimeout(() => {
                    field.classList.remove("flash"); 
                    errorElement.textContent = ""; 
                }, 2000);

                field.value = value.split("").filter(char => pattern.test(char)).join("");
            }
        });
    }

    preventInvalidInput(fname, fnameError, namePattern, "Only letters are allowed in first name.");
    preventInvalidInput(lname, lnameError, namePattern, "Only letters are allowed in last name.");
    preventInvalidInput(email, emailError, emailPattern, "Invalid character in email.");
    preventInvalidInput(comments, commentsError, commentPattern, "Invalid character in comments.");


    // checking when the form is submitted 
    form.addEventListener("submit", function (event) {
        let isValid = true;

        validateField(fname, fnameError, "First name is required.");
        validateField(lname, lnameError, "Last name is required.");
        validateField(email, emailError, "Please enter a valid email address.");
        validateField(comments, commentsError, "Comments cannot be empty.");

        formErrors.value = JSON.stringify(form_errors);

        if (!fname.checkValidity() || !lname.checkValidity() || !email.checkValidity() || !comments.checkValidity()) {
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); 
        }

    });

});



// Function for show code button
function showContent() {
    const template = document.getElementById('code-template');
    const clone = document.importNode(template.content, true);
    const codeBlock = document.getElementById('code-block');
    codeBlock.innerHTML = ''; 
    codeBlock.appendChild(clone); 
}


// function for hide code button
function hideContent() {
    const template = document.getElementById('code-template');
    const codeBlock = document.getElementById('code-block');
    codeBlock.innerHTML = '';
}



//code for fading images in music section of interests

document.addEventListener("DOMContentLoaded", function() { 
    let currentIndex = 0; // Start with the first image
    const pics = document.querySelectorAll('.album-covers img'); 

    function changeImage() {           
        pics[currentIndex].classList.remove('active-album');         
        currentIndex = (currentIndex + 1) % pics.length;
        pics[currentIndex].classList.add('active-album');
    }

    setInterval(changeImage, 3000);
});