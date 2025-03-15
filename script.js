LIGHT_SRC = "moon.png"
DARK_SRC = "sun.png"

function setTheme(theme) {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    let textSquares = document.querySelectorAll('text-square');

    let forms = document.querySelectorAll('form');

    if (theme === 'dark'){
        root.style.setProperty('background', 'var(--bg-color-dark)');
        root.style.setProperty('color', 'var(--text-color-dark)');

        
        textSquares.forEach(function(square) {
            square.style.setProperty('background', 'var(--bg-color2-dark)');
        });

        forms.forEach(function(form) {
            form.style.setProperty('background', 'var(--bg-color2-dark)');
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
