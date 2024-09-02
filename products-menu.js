import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, set, push, remove, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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
const productBackground = document.getElementById("product-container");

// Show the add product menu
addProductMenuButton.addEventListener("click", function () {
    const addProductMenu = document.getElementById("add-product-menu");
    addProductMenu.style.display = "block";
    productBackground.style.filter = "blur(7px)";
});

// Close the add product menu
const closeButton = document.getElementById("close-add-product-menu");
closeButton.addEventListener("click", function () {
    const addProductMenu = document.getElementById("add-product-menu");
    addProductMenu.style.display = "none";
    productBackground.style.filter = "";
});

// Add product to database
const addProductButton = document.getElementById("add-product-button");
addProductButton.addEventListener("click", function () {
    const productName = document.getElementById("name-of-product").value;
    const priceOfProduct = document.getElementById("price-of-product").value;
    const typeOfProduct = document.getElementById("type-of-product").value;

    // Handle image file upload
    const imageFileInput = document.getElementById("picture-of-product");
    const image = new Promise((resolve, reject) => {
        if (imageFileInput.files.length > 0) {
            const file = imageFileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                resolve(e.target.result); // Resolve with base64 URL
            };
            reader.onerror = reject; // Reject if error
            reader.readAsDataURL(file);
        } else {
            resolve(""); // Resolve with empty string if no file
        }
    });

    image.then((imageUrl) => {
        const productsRef = ref(db, "products/");
        const newProductRef = push(productsRef);

        return set(newProductRef, {
            nameOfProduct: productName,
            priceOfProduct: priceOfProduct,
            typeOfProduct: typeOfProduct,
            image: imageUrl
        });
    })
        .then(() => {
            console.log("Product added successfully!");
            const addProductMenu = document.getElementById("add-product-menu");
            addProductMenu.style.display = "none";
            productBackground.style.filter = "";
            loadProductData(); // Reload product data to show the new product
        })
        .catch((error) => {
            console.error("Error adding product:", error);
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

            // Event delegation for all product elements
            productContainer.addEventListener("click", function (event) {
                const productElement = event.target.closest(".product");
                if (productElement) {
                    const key = productElement.dataset.key; // Retrieve the product key
                    const name = productElement.querySelector(".product-name").textContent.replace('Име: ', '');
                    const price = productElement.querySelector(".product-price").textContent.replace('Цена: ', '');
                    const imageSrc = productElement.querySelector(".product-picture").src;

                    // Set the values in the edit product menu
                    document.getElementById("name-of-product-edit").value = name;
                    document.getElementById("price-of-product-edit").value = price;
                    document.getElementById("edit-product-picture").src = imageSrc;

                    productContainer.style.filter = "blur(10px)";
                    document.getElementById("edit-product-meny").style.display = "block";

                    // Close edit product menu
                    document.getElementById("close-edit-product-menu").addEventListener("click", function () {
                        productContainer.style.filter = "";
                        document.getElementById("edit-product-meny").style.display = "none";
                    });

                    // Remove product
                    document.getElementById("remove-product").addEventListener("click", function () {
                        const productRef = ref(db, 'products/' + key);
                        remove(productRef)
                            .then(() => {
                                console.log('Product removed successfully');
                                loadProductData(); // Reload product data after deletion
                            })
                            .catch((error) => {
                                console.error('Error removing product:', error);
                            });
                    });

                    // Update product
                    document.getElementById('save-changes-edit-product').addEventListener("click", function () {
                        const updatedData = {
                            nameOfProduct: document.getElementById('name-of-product-edit').value,
                            priceOfProduct: document.getElementById('price-of-product-edit').value,
                            image: document.getElementById('edit-product-picture').src
                        };
                        const productRef = ref(db, 'products/' + key);
                        update(productRef, updatedData)
                            .then(() => {
                                console.log('Product updated successfully');
                                productContainer.style.filter = "";
                                document.getElementById("edit-product-meny").style.display = "none";
                                loadProductData(); // Reload product data after updating
                            })
                            .catch((error) => {
                                console.error('Error updating product:', error);
                            });
                    });
                }
            });

        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

loadProductData(); // Call this function to load product data on page load
