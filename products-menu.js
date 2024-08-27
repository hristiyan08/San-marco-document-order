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

const addProductMenuButton = document.getElementById("add-product");
addProductMenuButton.addEventListener("click", function(){
const addProductMenu = document.getElementById("add-product-menu");
addProductMenu.style.display = "block";

const productBackground = document.getElementById("product-container");
productBackground.style.filter = "blur(7px)";

const closeButton = document.getElementById("close-add-product-menu");
closeButton.addEventListener("click", function(){
    addProductMenu.style.display = "none";
    productBackground.style.filter = "";
});

const addProductButton = document.getElementById("add-product-button");
addProductButton.addEventListener("click", function(){
const productName = document.getElementById("name-of-product").value;
const priceOfProduct = document.getElementById("price-of-product").value;

});
});