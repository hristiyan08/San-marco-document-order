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
const decorationMenu = this.document.getElementById("add-receipt-menu-decoration")
const primerMenu = this.document.getElementById("add-receipt-menu-primer")
const fasadeMenu = this.document.getElementById("add-receipt-menu-fasade")
const productMenu = this.document.getElementById("add-receipt-menu-product")
addNewReceiptButton.addEventListener("click", function() {
    addNewReceiptMenuFunction();
});
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
        else if (isClicked["decoration"]){
            decorationMenu.style.display = "block";
            addNewReceiptMenu.style.display = "none";
        }
        else if (isClicked["primer"]){
            primerMenu.style.display = "block";
            addNewReceiptMenu.style.display = "none";
        }
        else if (isClicked["fasade"]){
            fasadeMenu.style.display = "block";
            addNewReceiptMenu.style.display = "none";
        }
        else {
            productMenu.style.display = "block";
            addNewReceiptMenu.style.display = "none"; 
        }
    });
};



function loadProductData() {
 let additonalMenu1 = false; 
 let additonalMenu2 = false;
    const dbRef = ref(db, 'products/');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const products = snapshot.val();
            
            // Get containers for paint and decoration
            const productContainerForPaint = document.getElementsByName("product-container-1")[0];
            const productContainerForDecoration = document.getElementsByName("product-container-2")[0]; 
            const productContainerForPrimer = document.getElementsByName("product-container-3")[0]; 
            const productContainerForFasade = document.getElementsByName("product-container-4")[0];
            const productContainerForProduct = document.getElementsByName("product-container-5")[0];  
            productContainerForPaint.innerHTML = ""; // Clear previous products
            productContainerForDecoration.innerHTML = ""; // Clear previous products
            productContainerForPrimer.innerHTML = "";
            productContainerForFasade.innerHTML = "";
            productContainerForProduct.innerHTML = "";
            for (const key in products) {
                if (products.hasOwnProperty(key)) {
                    const product = products[key];
                    
                    function getElementsFromDB(container) {
                        const productElement = document.createElement("div");
                        productElement.classList.add("product");
                        productElement.dataset.key = key;
                        
                        const imageElement = document.createElement("img");
                        imageElement.src = product.image || 'default-image.png';
                        imageElement.alt = "Product Image";
                        imageElement.classList.add("product-picture");
                        
                        const nameElement = document.createElement("p");
                        nameElement.textContent = `Име: ${product.nameOfProduct}`;
                        
                        nameElement.classList.add("product-name");
                        
                        const priceElement = document.createElement("p");
                        priceElement.textContent = `Цена: ${product.priceOfProduct} лв.`;
                        priceElement.classList.add("product-price");
                        
                        productElement.appendChild(imageElement);
                        productElement.appendChild(nameElement);
                        productElement.appendChild(priceElement);
                        
                        container.appendChild(productElement);
                    }
                    
                    if (product.typeOfProduct === "paint") {
                        getElementsFromDB(productContainerForPaint);
                    } else if (product.typeOfProduct === "decoration") {
                        getElementsFromDB(productContainerForDecoration);
                    }
                    else if(product.typeOfProduct === "primer"){
                        getElementsFromDB(productContainerForPrimer);
                    }
                    else if(product.typeOfProduct === "fasade"){
                        getElementsFromDB(productContainerForFasade);
                    }
                    else {
                        getElementsFromDB(productContainerForProduct);
                    }
                }
            }
            
            
            const allProductContainers1 = document.querySelectorAll("#product-container-1"); // Fixed selector
            
            allProductContainers1.forEach((productContainer) => {
                productContainer.addEventListener("click", (event) => {
                    const productElement = event.target.closest(".product");
                    if (productElement) {
                        const name = productElement.querySelector(".product-name").textContent;
                        document.getElementById("choosen-products").innerHTML = name;
                        
                        const detailsMenu = document.getElementById("product-menu-details");
                        detailsMenu.style.display = "block";
                        const aditionalMenu = document.getElementById("additonal-goods-receipt-menu");
                        const addProductButton = document.getElementById("add-product-button-goods-receipt");
                        
                        // Remove any existing event listeners to avoid duplicates
                        const newAddProductClickListener = function () {
                            getElementsFromGoodsReceipt(name);
          
                            aditionalMenu.style.display = "block";
                            paintMenu.style.display = "none"
                            decorationMenu.style.display = "none"
                            primerMenu.style.display = "none"
                            fasadeMenu.style.display = "none"
                            productMenu.style.display = "none"
                            detailsMenu.style.display = "none";
                            
                        }
                        addProductButton.removeEventListener("click", newAddProductClickListener);
                        addProductButton.addEventListener("click", newAddProductClickListener);
                    }
                });
            });
            
            
            const allProductContainers2 = document.querySelectorAll("#product-container-2"); 
            allProductContainers2.forEach((productContainer) => {
                productContainer.addEventListener("click", (event) => {
                    const productElement = event.target.closest(".product");
                    if (productElement) {
                        const name = productElement.querySelector(".product-name").textContent;
                        document.getElementById("choosen-products-1").innerHTML = name;

                        const detailsMenu = document.getElementById("product-menu-details-primer");
                        detailsMenu.style.display = "block";

                        const addProductButton = document.getElementById("add-product-button-goods-receipt-2");
                        const aditionalMenu = document.getElementById("additonal-goods-receipt-menu");
                        // Remove any existing event listeners to avoid duplicates
                        const newAddProductClickListener = function () {
                            getElementsFromGoodsReceipt(name);
                            
                            aditionalMenu.style.display = "block";
                            paintMenu.style.display = "none"
                            decorationMenu.style.display = "none"
                            primerMenu.style.display = "none"
                            fasadeMenu.style.display = "none"
                            productMenu.style.display = "none"
                            detailsMenu.style.display = "none";
                             // Ensure flags are set appropriately
                        };

                        addProductButton.removeEventListener("click", newAddProductClickListener);
                        addProductButton.addEventListener("click", newAddProductClickListener);
                    }
                });
            });
        }
    }).catch((error) => {
        console.error(error);
    });


    function getElementsFromGoodsReceipt(productName) {
        let orderDetails = "";
    
        // Function for additional menu 1
      const quantity1 = document.getElementById("quantity-2").value;
            const quantity = document.getElementById("quantity-1").value;
            const color = document.getElementById("color-1").value;
            const price = document.getElementById("price-1").value;
            const supplement1 = document.getElementById("supplement-1");
            const supplement2 = document.getElementById("supplement-2");
    
            orderDetails = `${productName}, ${quantity} ${quantity1} л, ${color} - ${price} лв.`;
    
            if (supplement1.checked) {
                orderDetails += " + добавка против мухъл";
            } else if (supplement2.checked) {
                orderDetails += " + двойна добавка против мухъл";
            }
  
           
   
            
        
      
    
 
        // Store orders in localStorage
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(orderDetails);
        localStorage.setItem("orders", JSON.stringify(orders));
    
        // Update UI with stored orders
        const productDetails = document.getElementById("products-details");
        productDetails.innerHTML = orders.join("<br>");
    
        // Additional navigation logic
        const addAnotherProduct = document.getElementById("add-another-product");
        addAnotherProduct.addEventListener("click", function () {
            localStorage.setItem("divIsOpen", "false");
            location.reload();
        });
    
        const secondNextButton = document.getElementById("next-2");
        secondNextButton.addEventListener("click", function () {
            localStorage.removeItem("orders");
            localStorage.removeItem("divIsOpen");
        });
    
}
}
loadProductData();

// Load product data when the document is fully loaded



if (localStorage.getItem("divIsOpen") === "false") {
    // Display the addNewReceiptMenu if the condition is met
    addNewReceiptMenuFunction ();
    console.log("OK!!!");
    
    // Reset the localStorage value to avoid showing it again on subsequent reloads
    
}
else{
    console.log("OK!"); 
    
}})
