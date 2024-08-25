import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, child, get, set, push, remove, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const toastBox = document.getElementById("notificationBox");
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

// Event Listeners Setup
window.addEventListener("DOMContentLoaded", () => {
    checkIfPasswordExists();
    loadProductData();
    getUserData();

    document.getElementById("exit-profile").addEventListener('click', () => {
        localStorage.removeItem('password');
        togglePages("login");
    });

    document.getElementById("add-product").addEventListener('click', () => {
        toggleAddProductMenu(true);
    });

    document.getElementById("close-add-product-menu").addEventListener("click", () => {
        toggleAddProductMenu(false);
    });

    document.getElementById("add-product-button").addEventListener('click', () => {
        const nameOfProduct = document.getElementById("name-of-product").value;
        const priceOfProduct = document.getElementById("price-of-product").value;
        const file = document.getElementById("picture-of-product").files[0];
        
        if (file) {
            convertImageToDataURL(file, (dataURL) => {
                writeUserData(nameOfProduct, priceOfProduct, dataURL);
            });
        } else {
            writeUserData(nameOfProduct, priceOfProduct, null);
        }
    });

    document.getElementById("create-user-key").addEventListener("click", () => {
        const nameOfUser = document.getElementById("username").value;
        const randomCode = generateRandomCode();
        writeUserData(nameOfUser, randomCode);
    });

    document.getElementById("products").addEventListener('click', () => {
        document.getElementById("product-meny").style.display = "block";
    });

    document.getElementById("submit").addEventListener("click", (event) => {
        event.preventDefault();
        handleLogin();
    });
});

// Utility Functions
function showToast(message, type) {
    let toast = document.createElement("div");
    toast.classList.add(`toast${type}`);
    toast.innerHTML = message;
    toastBox.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 6000);
}

function togglePages(page) {
    const adminPage = document.getElementById("menu");
    const loginPage = document.getElementById("login");
    adminPage.style.display = page === "admin" ? "block" : "none";
    loginPage.style.display = page === "login" ? "block" : "none";
}

function toggleAddProductMenu(show) {
    document.getElementById("add-product-menu").style.display = show ? "block" : "none";
    document.getElementById("product-container").style.filter = show ? "blur(7px)" : "";
}

function convertImageToDataURL(file, callback) {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    if (file) reader.readAsDataURL(file);
}

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
        loadProductData();
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
            productContainer.innerHTML = "";
            for (const key in products) {
                if (products.hasOwnProperty(key)) {
                    const product = products[key];
                    const productElement = createProductElement(product, key);
                    productContainer.appendChild(productElement);
                }
            }
        }
    }).catch((error) => {
        console.error(error);
    });
}

function createProductElement(product, key) {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.dataset.key = key;

    const imageElement = document.createElement("img");
    imageElement.src = product.profile_picture || 'default-image.png';
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

    productElement.addEventListener('click', () => {
        openEditProductMenu(product, key);
    });

    return productElement;
}

function openEditProductMenu(product, key) {
    document.getElementById("edit-product-meny").style.display = "block";
    document.getElementById("product-container").style.filter = "blur(5px)";
    document.getElementById("name-of-product-edit").value = product.nameOfProduct;
    document.getElementById("price-of-product-edit").value = product.priceOfProduct;
    document.getElementById("edit-product-picture").src = product.profile_picture || 'default-image.png';

    document.getElementById("close-edit-product-menu").addEventListener("click", () => {
        document.getElementById("edit-product-meny").style.display = "none";
        document.getElementById("product-container").style.filter = "";
    });

    document.getElementById("remove-product").addEventListener("click", () => {
        removeProduct(key);
    });

    document.getElementById('save-changes-edit-product').addEventListener("click", () => {
        const updatedData = {
            nameOfProduct: document.getElementById('name-of-product-edit').value,
            priceOfProduct: document.getElementById('price-of-product-edit').value,
            profile_picture: document.getElementById('edit-product-picture').src
        };
        updateProduct(key, updatedData);
    });
}

function removeProduct(key) {
    const productRef = ref(db, 'products/' + key);
    remove(productRef)
        .then(() => {
            console.log('Product removed successfully');
            loadProductData();
        })
        .catch((error) => {
            console.error('Error removing product:', error);
        });
}

function updateProduct(key, updatedData) {
    const productRef = ref(db, 'products/' + key);
    update(productRef, updatedData)
        .then(() => {
            console.log('Product updated successfully');
            loadProductData();
        })
        .catch((error) => {
            console.error('Error updating product:', error);
        });
}

function generateRandomCode() {
    let code = '';
    for (let i = 0; i < 14; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

function writeUserData2(nameOfUser, randomCode) {
    const userRef = ref(db, 'users/');
    const newUserRef = push(userRef);
    set(newUserRef, {
        name: nameOfUser,
        code: randomCode,
    })
    .then(() => {
        console.log("User added successfully.");
        document.getElementById("add-users-menu-code-show").style.display = "block";
        document.getElementById("add-users-menu").style.display = "none";
        document.getElementById("name-of-user-1").innerHTML = nameOfUser;
        document.getElementById("key-of-user-1").innerHTML = `${randomCode} <i class="fa-solid fa-trash" id="remove-user"></i>`;
    })
    .catch((error) => {
        console.error("Error adding user:", error);
    });
}

function handleLogin() {
    const userKeyInput = document.getElementById("key").value;
    const loginButton = document.getElementById("submit");
    
    get(ref(db, 'users'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                for (const key in users) {
                    if (users[key].code === userKeyInput) {
                        showToast('<i class="fa-solid fa-circle-check"></i> Успешен вход!', '1');
                        togglePages("admin");
                        if (document.getElementById("savePassword").checked) {
                            localStorage.setItem("password", userKeyInput);
                        }
                        return;
                    }
                }
            }
            showToast('<i class="fa-solid fa-circle-xmark"></i> Грешен ключ!', '2');
        })
        .catch((error) => {
            console.error("Error during login:", error);
        });
}

function getUserData() {
    const dbRef = ref(db, 'users');
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const tableBody = document.getElementById("user-table-body");
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

function checkIfPasswordExists() {
    const password = localStorage.getItem("password");
    if (password) {
        showToast(' <i class="fa-solid fa-circle-check"></i> Успешен вход!', '1');
        togglePages("admin");
    } else {
        showToast(' <i class="fa-solid fa-circle-exclamation"></i> Изтекла сесия!', '3');
    }

    document.getElementById("add-user").addEventListener('click', function(){
        document.getElementById('add-users-menu').style.display = "block";

        document.getElementById("users-table").style.filter = "blur(7px)";
        
    });

    document.getElementById('close-add-user-menu').addEventListener('click', function(){

        document.getElementById('add-users-menu').style.display = "none";

        document.getElementById("users-table").style.filter = "";
    })
    
}
