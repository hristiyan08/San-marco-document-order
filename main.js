import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { set, getDatabase, ref, child, get, push} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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
    toast.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Грешен ключ!';
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


document.getElementById('exit-profile').addEventListener('click',function exitFromProfile(){
    localStorage.removeItem('password');
    adminPage.style.display = "none";
        loginPage.style.display = "block";
});

const addProductMenu = document.getElementById("add-product-menu");
document.getElementById("add-product").addEventListener('click', function(){

addProductMenu.style.display = "block";
adminPage.classList.add("blur");
document.getElementById("close-add-product-menu").addEventListener("click", function(){
    addProductMenu.style.display = "none";
    adminPage.classList.remove("blur");
});

});


        // Import necessary functions from Firebase SDK
   
    

        function convertImageToDataURL(file, callback) {
            const reader = new FileReader();
            reader.onloadend = function() {
                const dataURL = reader.result;
                callback(dataURL);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }

        document.getElementById("add-product-button").addEventListener('click', function() {
            const nameOfProduct = document.getElementById("name-of-product").value;
            const priceOfProduct = document.getElementById("price-of-product").value;
            const file = document.getElementById("picture-of-product").files[0];

            if (file) {
                convertImageToDataURL(file, function(dataURL) {
                    writeUserData(nameOfProduct, priceOfProduct, dataURL);
                });
            } else {
                writeUserData(nameOfProduct, priceOfProduct, null);
            }
        });

        function writeUserData(nameOfProduct, priceOfProduct, dataURL) {
            const productRef = ref(db, 'products/');
            const newProductRef = push(productRef);
            set(newProductRef, {
                nameOfProduct: nameOfProduct,
                priceOfProduct: priceOfProduct,
                profile_picture: dataURL || null
            })
            .then(() => {
                console.log("Product added successfully.");
            })
            .catch((error) => {
                console.error("Error adding product:", error);
            });
        }