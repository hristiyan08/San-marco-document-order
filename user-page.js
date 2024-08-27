import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, child, get, set, push, remove, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const tableBody = document.getElementById("user-table-body");
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
const dbRef = ref(db);

//Show a users menu

const nameOfUser = document.getElementById("username").value

    let code = '';
//Generate a random 14-digits code
function generateRandomCode() {

    for (let i = 0; i < 14; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}
generateRandomCode();

const addUserButton = document.getElementById("add-user");
addUserButton.addEventListener("click", function(){
const addUserMenu = document.getElementById("add-users-menu");
addUserMenu.style.display = "block";
const table = document.getElementById("users-table")
table.style.filter = "blur(7px)";



const addUserButton = document.getElementById("create-user-key");
addUserButton.addEventListener("click", function(){
    const userRef = ref(db, 'users/');
    const newUserRef = push(userRef);
    const name = document.getElementById("username").value;
    set(newUserRef, {
        name: name,
        code: code,
    })
    .then(() => {
        const keyMenu = document.getElementById("add-users-menu-code-show");
        keyMenu.style.display = "block";
        addUserMenu.style.display = "none";

        console.log("User added successfully.");
        document.getElementById("name-of-user-1").innerHTML = name;
        document.getElementById("key-of-user-1").innerHTML = `${code} <i class="fa-solid fa-trash" id="remove-user"></i>`;
    })
});

});

function getUserData() {
    const dbRef = ref(db, 'users');
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
              
                tableBody.innerHTML = "";
                for (const key in users) {
                    if (users.hasOwnProperty(key)) {
                        const user = users[key];
                        const row = document.createElement("tr");
                        const nameCell = document.createElement("td");
                        nameCell.textContent = user.name;
                        row.appendChild(nameCell);
                        const keyCell = document.createElement("td");
                        keyCell.textContent = user.code || "N/A";
                        row.appendChild(keyCell);
                        tableBody.appendChild(row);
                    }
                }
            } else {
                console.log("No data available at 'users/'");
            }
        })
        .catch((error) => {
            console.error("Error retrieving data:", error);
        });
}
getUserData() ;