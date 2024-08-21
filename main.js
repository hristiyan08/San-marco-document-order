import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChoYjc2MEkOMn2ZR2ni97xtFZmY9j3gdU",
    authDomain: "document--program.firebaseapp.com",
    databaseURL: "https://document--program-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "document--program",
    storageBucket: "document--program.appspot.com",
    messagingSenderId: "108170213817",
    appId: "1:108170213817:web:c9bcd3b84226fd8a99de68",
    measurementId: "G-VD67W4P7K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const adminPage = document.getElementById("menu");
const loginPage = document.getElementById("login");

const loginButton = document.getElementById("submit");
loginButton.addEventListener("click", function(event) {
    event.preventDefault();  // Prevent the form from submitting and reloading the page

    const userKeyInput = document.getElementById("key").value; // Get the value from the input field
    const dbRef = ref(db);

    get(child(dbRef, "key")).then((snapshot) => {
        if (snapshot.exists()) {
            const storedKey = snapshot.val();
           
            
            if (parseInt(userKeyInput, 10) === storedKey) { // Compare user input with stored key
                showToastForSucsess();
                adminPage.style.display = "block";
                loginPage.style.display = "none";

                if(document.getElementById("savePassword").checked){

                    const key = document.getElementById("key");
                
                    localStorage.setItem("password", key.value );
                
                }
                                
            } else {
                showToastForError();
            }
        } else {
            console.log("No data available");
            alert("No data available");
        }
    }).catch((error) => {
        console.error(error);
        alert("Error accessing database");
    });
});



const toastBox = document.getElementById("notificationBox");

function showToastForSucsess(){


    let toast = document.createElement("div");
    toast.classList.add("toast1");
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Успешен вход!';
    toastBox.appendChild(toast);

    setTimeout(()=>{

        toast.remove();
    },6000)
}

function showToastForSesion(){


    let toast = document.createElement("div");
    toast.classList.add("toast3");
    toast.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Изтекла сесия!';
    toastBox.appendChild(toast);

    setTimeout(()=>{

        toast.remove();
    },6000)
}

function showToastForError(){


    let toast = document.createElement("div");
    toast.classList.add("toast2");
    toast.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Грешна парола!';
    toastBox.appendChild(toast);

    setTimeout(()=>{

        toast.remove();
    },6000)

}

window.addEventListener("beforeunload", (event) => {
    // set a truthy value to property returnValue
    event.returnValue = true;
  });


  window.onload = function checkIfPasswordExists() {
    // Опитай се да вземеш паролата от localStorage
    const password = localStorage.getItem("password");
    
    // Проверка дали паролата е налична
    if (password) {
        showToastForSucsess();
        adminPage.style.display = "block";
        loginPage.style.display = "none";
    } else {
        showToastForSesion();
    }
}

