// var icon = document.getElementById("icon");
//     document.cookie = "theme=light";
//     icon.onclick = function(){
        
//         document.body.classList.toggle("dark-theme");
//         // document.cookie.toogle = "theme = dark";
//         // document.cookie.toogle = "theme = light";
//         if(document.body.classList.contains("dark-theme")){
//             icon.src = "images/sun.png";
//             // document.cookie.too = "theme = light";
//         }else{
//             icon.src = "images/moon.png";
//             // document.cookie = "theme = dark";
//         }
//     }

// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to toggle the theme
function toggleTheme() {
    const icon = document.getElementById("icon");
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    
    // Toggle the theme
    document.body.classList.toggle("dark-theme");
    
    // Update the cookie based on the new theme
    const newTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    setCookie("theme", newTheme, 7); // Cookie expires in 7 days
    
    // Update the icon based on the new theme
    icon.src = newTheme === "dark" ? "images/sun.png" : "images/moon.png";
}

// On page load, apply the saved theme from the cookie
window.onload = function() {
    const savedTheme = getCookie("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        document.getElementById("icon").src = "images/sun.png";
    } else {
        document.body.classList.remove("dark-theme");
        document.getElementById("icon").src = "images/moon.png";
    }
    
    // Attach the click event handler
    document.getElementById("icon").onclick = toggleTheme;
}
