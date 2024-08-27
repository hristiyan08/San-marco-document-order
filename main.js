
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
                        // Access the data-key of the clicked element
                        const key = this.dataset.key;
                        const nameForEdit = this.querySelector('.product-name').textContent;
                        const priceForEdit = this.querySelector('.product-price').textContent;
                        const imageForEdit = this.querySelector('.product-picture').src;

                        const nameElement = this.querySelector('.product-name');
                        const priceElement = this.querySelector('.product-price');
                        const imageElement = this.querySelector('.product-picture');
                        
                        if (nameElement && priceElement && imageElement) {
                            const nameForEdit = nameElement.textContent;
                            const priceForEdit = priceElement.textContent;
                            const imageForEdit = imageElement.src;
                        
                            document.getElementById("edit-product-meny").style.display = "block";
                            document.getElementById("product-container").style.filter = "blur(5px)";
                        
                            document.getElementById("name-of-product-edit").value = nameForEdit;
                            document.getElementById("price-of-product-edit").value = priceForEdit;
                            document.getElementById("edit-product-picture").src = imageForEdit;

                            document.getElementById("close-edit-product-menu").addEventListener("click", function(){
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
                                            // Може да искате да обновите списъка с продукти тук
                                        })
                                        .catch((error) => {
                                            console.error('Error removing product:', error);
                                        });
                                } else {
                                    console.error('No product key found');
                                }
                            });

                            if(key){
                                function updateProduct(key, updatedData) {
                                    const productRef = ref(db, 'products/' + key);
                                    update(productRef, updatedData)
                                        .then(() => {
                                            console.log('Product updated successfully');
                                            // Можете да обновите интерфейса на приложението тук
                                        })
                                        .catch((error) => {
                                            console.error('Error updating product:', error);
                                        });
                                }

                                document.getElementById('save-changes-edit-product').addEventListener("click", function(){
                                    const updatedData = {
                                        nameOfProduct: document.getElementById('name-of-product-edit').value,
                                        priceOfProduct: document.getElementById('price-of-product-edit').value,
                                        profile_picture: document.getElementById('edit-product-picture').src
                                    };
                                    updateProduct(key, updatedData);
                                });
                            }
                        }
                    });
                }
            }
        }
    });
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



    document.getElementById("add-user").addEventListener('click', function(){
        document.getElementById('add-users-menu').style.display = "block";
        document.getElementById("users-table").style.filter = "blur(7px)";
    });

    document.getElementById('close-add-user-menu').addEventListener('click', function(){
        document.getElementById('add-users-menu').style.display = "none";
        document.getElementById("users-table").style.filter = "";
    });

    document.getElementById('usersForAdminPage').addEventListener('click', function(){
        document.getElementById('user-menu').style.display = 'block';
    });

    let number = 0;
    let paintChoosen = false;
    let decorationChoosen = false;
    let primerChoosen = false;
    let productChoosen = false;

    function createCheckMark(elementId) {
        let element = document.getElementById(elementId);
        
        // Remove existing checkmark if present
        let existingMark = element.querySelector('.check-mark');
        if (existingMark) {
            existingMark.remove();
        } else {
            // Create a new checkmark element
            let clickMark = document.createElement("i");
            clickMark.className = "fa-solid fa-circle-check check-mark";
            clickMark.style.position = "absolute"; // Position it within the parent element
            clickMark.style.top = "10px"; // Adjust as necessary
            clickMark.style.right = "10px"; // Adjust as necessary
            element.appendChild(clickMark);
        }
    }

    function updateSelection(elementId, isSelected, stateVariable) {
        stateVariable = !isSelected;
        if (stateVariable) {
            number += 1;
            createCheckMark(elementId);
        } else {
            number -= 1;
            createCheckMark(elementId);
        }
        nextButtonValue();
        return stateVariable; // Return the updated state
    }

    // Event Listeners for each item
    document.getElementById("paint").addEventListener('click', function() {
        paintChoosen = updateSelection("paint", paintChoosen, paintChoosen);
    });

    document.getElementById("decoration").addEventListener('click', function() {
        decorationChoosen = updateSelection("decoration", decorationChoosen, decorationChoosen);
    });

    document.getElementById("primer").addEventListener('click', function() {
        primerChoosen = updateSelection("primer", primerChoosen, primerChoosen);
    });

    document.getElementById("products-1").addEventListener('click', function() {
        productChoosen = updateSelection("products-1", productChoosen, productChoosen);
    });

    function nextButtonValue() {
        const nextButton = document.getElementById('next-1');
        if (number === 0) {
            nextButton.value = `Напред`;
            nextButton.disabled = true;
        } else {
            nextButton.value = `Напред`;
            nextButton.disabled = false;
        }
    }

    // Initialize button state
    nextButtonValue();
}
