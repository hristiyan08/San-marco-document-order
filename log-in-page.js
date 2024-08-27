import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Handle Login
const loginButton = document.getElementById("submit");
loginButton.addEventListener('click', function handleLogin(event) {
    event.preventDefault(); // Prevent the form from submitting

    const userKeyInput = document.getElementById("key").value;
    const reference = ref(db, 'users/');

    get(reference)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                for (const key in users) {
                    if (users[key].code === userKeyInput) {
                        document.getElementById("login").style.display = 'none';
                        document.getElementById("menu").style.display = 'block';
                        if (document.getElementById("savePassword").checked) {
                            localStorage.setItem("password", userKeyInput);
                        }
                        return;
                    }
                }
                alert("Invalid key. Please try again.");
            } else {
                alert("No users found.");
            }
        })
        .catch((error) => {
            console.error("Error during login:", error);
        });
});

// Check if Password Exists in LocalStorage
function checkIfPasswordExists() {
    const password = localStorage.getItem("password");
    if (password) {
        document.getElementById("menu").style.display = 'block';
        document.getElementById("login").style.display = 'none';
    }
}

checkIfPasswordExists();
