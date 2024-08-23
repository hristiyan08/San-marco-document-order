import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, child, get, set, push, remove, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
const toastBox = document.getElementById("notificationBox");

window.addEventListener("DOMContentLoaded", function() {
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

                    if (document.getElementById("savePassword").checked) {
                        localStorage.setItem("password", userKeyInput);
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

    function showToastForSucsess() {
        let toast = document.createElement("div");
        toast.classList.add("toast1");
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Успешен вход!';
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 6000);
    }

    function showToastForSesion() {
        let toast = document.createElement("div");
        toast.classList.add("toast3");
        toast.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Изтекла сесия!';
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 6000);
    }

    function removeItem(itemId) {
        const itemRef = ref(db, 'products/', 'productRef/');
        remove(itemRef)
            .then(() => {
                console.log('Item removed successfully');
            })
            .catch((error) => {
                console.error('Error removing item:', error);
            });
    }

    function showToastForError() {
        let toast = document.createElement("div");
        toast.classList.add("toast2");
        toast.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Грешен ключ!';
        toastBox.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 6000);
    }

    window.addEventListener("beforeunload", (event) => {
        event.returnValue = true;
    });

    window.onload = function checkIfPasswordExists() {
        const password = localStorage.getItem("password");
        if (password) {
            showToastForSucsess();
            adminPage.style.display = "block";
            loginPage.style.display = "none";
        } else {
            showToastForSesion();
        }
    }

    document.getElementById('exit-profile').addEventListener('click', function exitFromProfile() {
        localStorage.removeItem('password');
        adminPage.style.display = "none";
        loginPage.style.display = "block";
    });

    const addProductMenu = document.getElementById("add-product-menu");
    document.getElementById("add-product").addEventListener('click', function() {
        addProductMenu.style.display = "block";
        adminPage.classList.add("blur");
        document.getElementById("close-add-product-menu").addEventListener("click", function() {
            addProductMenu.style.display = "none";
            adminPage.classList.remove("blur");
        });
    });

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
            loadProductData(); // Reload product data after adding new product
        })
        .catch((error) => {
            console.error("Error adding product:", error);
        });
    }

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
                        imageElement.src = product.profile_picture || 'default-image.png'; // Fallback image
                        imageElement.alt = "Product Image";
                        imageElement.classList.add("product-picture");

                        const nameElement = document.createElement("p");
                        nameElement.textContent = `Име: ${product.nameOfProduct}`;
                        nameElement.classList.add("product-name");
                        nameElement.value = product.nameOfProduct;
                        const priceElement = document.createElement("p");
                        priceElement.textContent = `Цена: ${product.priceOfProduct} лв.`;
                        priceElement.classList.add("product-price");
                        priceElement.value = product.priceOfProduct;

                        // Append elements to the product element
                        productElement.appendChild(imageElement);
                        productElement.appendChild(nameElement);
                        productElement.appendChild(priceElement);

                        // Append the product element to the container
                        productContainer.appendChild(productElement);

                        // Add event listener to the newly created product element
                        productElement.addEventListener('click', function() {
                            const key = this.dataset.key;
                            const nameForEdit = this.querySelector('.product-name').textContent;
                            const priceForEdit = this.querySelector('.product-price').textContent;
                            const imageForEdit = this.querySelector('.product-picture').src;

                            document.getElementById("edit-product-meny").style.display = "block";
                            document.getElementById("product-container").style.filter = "blur(5px)";

                            document.getElementById("name-of-product-edit").value = nameForEdit;
                            document.getElementById("price-of-product-edit").value = priceForEdit;
                            document.getElementById("edit-product-picture").src = imageForEdit;

                            document.getElementById("close-edit-product-menu").addEventListener("click", function() {
                                document.getElementById("edit-product-meny").style.display = "none";
                                document.getElementById("product-container").style.filter = "";
                            });

                            document.getElementById("remove-product").addEventListener("click", function() {
                                if (key) {
                                    const productRef = ref(db, 'products/' + key);
                                    remove(productRef)
                                        .then(() => {
                                            console.log('Product removed successfully');
                                            location.reload();
                                        })
                                        .catch((error) => {
                                            console.error('Error removing product:', error);
                                        });
                                } else {
                                    console.error('No product key found');
                                }
                            });

                            document.getElementById('save-changes-edit-product').addEventListener("click", function() {
                                const updatedData = {
                                    nameOfProduct: document.getElementById('name-of-product-edit').value,
                                    priceOfProduct: document.getElementById('price-of-product-edit').value,
                                    profile_picture: document.getElementById('edit-product-picture').src
                                };
                                if (key) {
                                    const productRef = ref(db, 'products/' + key);
                                    update(productRef, updatedData)
                                        .then(() => {
                                            console.log('Product updated successfully');
                                        })
                                        .catch((error) => {
                                            console.error('Error updating product:', error);
                                        });
                                }
                            });
                        });
                    }
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    loadProductData(); // Call this function to load product data on page load



    const products = document.getElementById("products").addEventListener('click', function(){
         document.getElementById("product-meny").style.display = "block";
    });
});
