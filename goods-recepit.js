import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, set, push, remove, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";


window.addEventListener("DOMContentLoaded", function() {  






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

const addNewReceiptButton = document.getElementById("add-new-receipt");
let count = 0;

function toggleButton(buttonId, isClicked, tickElement) {
    const button = document.getElementById(buttonId);

    button.addEventListener("click", function () {
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
const addNewReceiptMenu = document.getElementById("add-receipt-menu");
const paintMenu = document.getElementById("add-receipt-menu-paint");
addNewReceiptButton.addEventListener("click",addNewReceiptMenuFunction());
    function addNewReceiptMenuFunction() {
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
    nextButton.addEventListener("click", function () {
        if (isClicked["paint"]) {
            
            paintMenu.style.display = "block";
            addNewReceiptMenu.style.display = "none";
        }
    });
};

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
                    if (product.typeOfProduct === "paint") {

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
                    }
                }
            }

            // Add event listener outside the loop
            productContainer.addEventListener("click", function (event) {
                const productElement = event.target.closest(".product");
                if (productElement) {
                    const name = productElement.querySelector(".product-name").textContent;
                    document.getElementById("choosen-products").innerHTML = name;
                    const detailsMenu = document.getElementById("product-menu-details");
                    detailsMenu.style.display = "block";
            
                    const addProductButton = document.getElementById("add-product-button-goods-receipt");
                    
                   
                    // Remove any previous event listeners to avoid duplicate actions
                    addProductButton.removeEventListener("click", getElementsFromGoodsReceipt);
                    addProductButton.addEventListener("click", getElementsFromGoodsReceipt);
                    function getElementsFromGoodsReceipt(event) {
                        event.preventDefault();
                        const quantity = document.getElementById("quantity-1").value;
                        const color = document.getElementById("color-1").value;
                        const price = document.getElementById("price-1").value; // assuming you want to select the price element
                        const supplement1 = document.getElementById("supplement-1");
                        const supplement2 = document.getElementById("supplement-2");
                        
                        let orderDetails = ` ${name}, ${quantity} л, ${color} - ${price} лв.`;
                        
                        if (supplement1.checked) {
                            orderDetails += " + добавка против мухъл";
                        } else if (supplement2.checked) {
                            orderDetails += " + двойна добавка против мухъл";
                        }
                        
                        // Get the existing orders from localStorage, or initialize an empty array if there are none
                        let orders = JSON.parse(localStorage.getItem("orders")) || [];
                        
                        // Add the new order to the array
                        orders.push(orderDetails);
                        
                        // Store the updated orders array in localStorage
                        localStorage.setItem("orders", JSON.stringify(orders));
                        
                        const aditionalGoodsReceiptMenu = document.getElementById("additonal-goods-receipt-menu");
                        aditionalGoodsReceiptMenu.style.display = 'block';
                        detailsMenu.style.display = "none";
                        paintMenu.style.display = "none";
                        
                        // Display all stored orders
                        const productDetails = document.getElementById("products-details");
                        productDetails.innerHTML = orders.join("<br>");
                        
                        // This will run when the page loads
                       
                        
                        const addAnotherProduct = document.getElementById("add-another-product");
                        
                        addAnotherProduct.addEventListener("click", function() {
                            // Set localStorage item to "false" and reload the page
                            localStorage.setItem("divIsOpen", "false");
                            location.reload();
                        });
  
                      
                        

                  
                    }
                    
                }
            });
          
        }
    }).catch((error) => {
        console.error(error);
    });

}
loadProductData(); // Load product data when the document is fully loaded



if (localStorage.getItem("divIsOpen") === "false") {
    // Display the addNewReceiptMenu if the condition is met
    addNewReceiptMenuFunction ();
    console.log("OK!!!");
    
    // Reset the localStorage value to avoid showing it again on subsequent reloads
    localStorage.removeItem("divIsOpen");
}
})