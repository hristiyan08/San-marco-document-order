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

const addNewReceiptButton = document.getElementById("add-new-receipt");
let count = 0;

function toggleButton(buttonId, isClicked, tickElement) {
    const button = document.getElementById(buttonId);

    button.addEventListener("click", function() {
        if (!isClicked[buttonId]) {
            isClicked[buttonId] = true;
            tickElement[buttonId] = document.createElement("p");
            tickElement[buttonId].innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            tickElement[buttonId].style.color = "green";
            count++;
            button.appendChild(tickElement[buttonId]);
        } else {
            isClicked[buttonId] = false;
            count--;
            if (tickElement[buttonId]) {
                button.removeChild(tickElement[buttonId]);
                tickElement[buttonId] = null;
            }
        }
    });
}

addNewReceiptButton.addEventListener("click", function() {
    const addNewReceiptMenu = document.getElementById("add-receipt-menu");
    addNewReceiptMenu.style.display = "block";
    const goodsReceptMenu = document.getElementById("goods-receipt-menu"); 
    goodsReceptMenu.style.display = "none";

    const isClicked = {};
    const tickElement = {};

    toggleButton("paint", isClicked, tickElement);
    toggleButton("decoration", isClicked, tickElement);
    toggleButton("primer", isClicked, tickElement);
    toggleButton("products-1", isClicked, tickElement);
    toggleButton("fasade", isClicked, tickElement);

    const nextButton = document.getElementById("next-1");
    nextButton.addEventListener("click", function() {
      
            if (isClicked["paint"]) {
                const paintMenu = document.getElementById("add-receipt-menu-paint");
                paintMenu.style.display = "block";
                addNewReceiptMenu.style.display = "none";
            }
        
    });
});


function loadProductData() {
    const dbRef = ref(db, 'products/');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const products = snapshot.val();
            const productContainer = document.getElementById("product-container");
            productContainer.innerHTML = ""; // Clear previous products

            for (const key in products) {
                if (products.hasOwnProperty(key)) {
                    const product = products[key];
                         if(product.typeOfProduct == "paint"){

                      
                    // Create a new product element
                    const productElement = document.createElement("div");
                    productElement.classList.add("product");
                    productElement.dataset.key = key; // Store product key as a data attribute
                    
                    const imageElement = document.createElement("img");
                    imageElement.src = product.image || 'default-image.png'; // Fallback image
                    imageElement.alt = "Product Image";
                    imageElement.classList.add("product-picture");

                    const nameElement = document.createElement("p");
                    nameElement.textContent = `Име: ${product.nameOfProduct}`;
                    nameElement.classList.add("product-name");
                    

                    const priceElement = document.createElement("p");
                    priceElement.textContent = `Цена: ${product.priceOfProduct} лв.`;
                    priceElement.classList.add("product-price");

                    // Append elements to the product element
                    productElement.appendChild(imageElement);
                    productElement.appendChild(nameElement);
                    productElement.appendChild(priceElement);

                    // Append the product element to the container
                    productContainer.appendChild(productElement);
                }   }
        

                
            }
        
        }
    }
    )} loadProductData();