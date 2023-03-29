function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
  let cart = localStorage.getItem("cart");

  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((p) => p.id_color != productId);
  saveCart(cart);
}

function changeQuantity(productId, quantity) {
  let cart = getCart();
  let productFound = cart.find((p) => p.id_color == productId);
  if (productFound != undefined) {
    productFound.quantity = quantity;
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart);
    }
  }
}

function getTotalProduct() {
  let cart = getCart();
  let number = 0;
  for (let product of cart) {
    number += parseInt(product.quantity);
  }
  return number;
}

function getTotalPrice() {
  let cart = getCart();
  let total = 0;
  for (let product of cart) {
    total += product.quantity * product.price;
  }
  return total;
}

async function getOneProductDataFromApi(product) {
  let itemApi = await fetch(`http://localhost:3000/api/products/${product.id}`)
    .then((products) => products.json())
    .then((article) => {
      return article;
    });
  product.id.split("_")[0];

  const kanap = {
    price: itemApi.price,
    image: itemApi.imageUrl,
    altTxt: itemApi.altTxt,
  };

  const elem = {
    ...product,
    ...kanap,
  };

  displayItems(elem);
  addEvents();
}

function getAllCartData() {
  let cartFromStorage = getCart();
  cartFromStorage.forEach((item) => {
    getOneProductDataFromApi(item);
  });
}

/*
###### VIEW
*/

window.addEventListener("load", (e) => {
  refreshCartView();
  // addEvents();
});

function refreshCartView() {
  resetCartView();
  getAllCartData();
  document.getElementById("totalQuantity").innerHTML = getTotalProduct();
  document.getElementById("totalPrice").innerHTML = getTotalPrice();
}

function displayItems(item) {
  const nodeArticle = `<article class="cart__item" data-id="${
    item.id + item.color
  }" data-color="${item.color}">
                <div class="cart__item__img">
                  <img src=${item.image} alt=${item.altTxt}>
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${item.name}</h2>
                    <p>${item.color}</p>
                    <p>${item.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input id="qty_${item.id + item.color}" data-id=${
    item.id + item.color
  } type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" value=${
    item.quantity
  }>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <div class="cart__item__content__settings__delete">
                      <p id="btn_${item.id + item.color}}" data-id=${
    item.id + item.color
  } class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </article>`;
  document.getElementById("cart__items").innerHTML += nodeArticle;

  // let btn = document.getElementById("btn_" + item.id);
  // btn.addEventListener("click", () => {
  //   itemDeleted(btn.closest("article").getAttribute("data-id"));
  // });

  // let qty = document.getElementById("qty_" + item.id);
  // qty.addEventListener("change", () => {
  //   updateTotalCart(qty.closest("article").getAttribute("data-id"), qty.value);
  // });
}

function addEvents() {
  //delete button
  const buttons = document.querySelectorAll(".deleteItem");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      itemDeleted(btn.closest("article").getAttribute("data-id"));
    });
  });

  const QtyFields = document.querySelectorAll(".itemQuantity");
  QtyFields.forEach((field) => {
    field.addEventListener("change", () => {
      updateTotalCart(
        field.closest("article").getAttribute("data-id"),
        field.value
      );
    });
  });
}

function updateTotalCart(id, quantity) {
  changeQuantity(id, quantity);
  refreshCartView();
}

function itemDeleted(itemId) {
  if (confirm("Supprimer cet article?")) {
    removeFromCart(itemId);
    refreshCartView();
  }
}

function resetCartView() {
  document.getElementById("cart__items").innerHTML = "";
  document.getElementById("totalQuantity").innerHTML = "";
  document.getElementById("totalPrice").innerHTML = "";
}

// --------------ORDER--------------------

window.addEventListener("load", (event) => {
  orderValidation();
});
// on définit les différents types de champs
const dataType = {
  text: 0,
  email: 1,
}

function checkTextField(valueString) {
  if (valueString === "") {
    return [false, "Veuillez remplir ce champ SVP"]; //retourne 2 valeurs : true/false si ok/ko et le message à afficher
  } else if (!valueString.match(/^[a-zA-Z]*$/)) {
    return [false, "Ce champ ne doit contenir que des lettres"];
  } else {
    let numberOfLetters = valueString.length;
    if (numberOfLetters < 3) {
      return [false, "Ce champ doit contenir au moins 3 lettres"];
    } else {
      return [true, ""];
    }
  }
}
// on vérifie le champ email
function checkEmailField(emailString) {
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  if (emailRegex.test(emailString)) {
    //test spécifique email
    return [true, ""];
  } else {
    return [false, "adresse email invalide"];
  }
}

function validateInputValue(inputObject) {
  if (inputObject == null) return;

  // du coup on traite selon le type:
  let result = null;

  switch (inputObject.type) {
    case "text":
      result = checkTextField(inputObject.value.trim());
      break;
    case "email":
      result = checkEmailField(inputObject.value.trim());
      break;
  }

  if (result == null) return false;

  if (result[0] == false) {
    error(inputObject, result[1]);
    return false;
  } else if (result[0] == true) {
    success(inputObject);
    return true;
  }
}

function checkForm() {
  if (!validateInputValue(document.getElementById("firstName"))) return false; 
  if (!validateInputValue(document.getElementById("lastName"))) return false;
  if (!validateInputValue(document.getElementById("address"))) return false;
  if (!validateInputValue(document.getElementById("city"))) return false;
  if (!validateInputValue(document.getElementById("email"))) return false;

  return true;
}

function orderValidation() {
  const orderBtn = document.querySelector("#order");
  orderBtn.addEventListener("click", (e) => {
    return submitForm(e);
  }); //submitForm(e) doit retourner true ou false. si false : n'envoie pas le formulaire

  const fieldsToControl = []; //array qui contiendra les objets 'input'

  // permet d'ajouter l'event  sur les champs voulus
  fieldsToControl.push(document.querySelector("#firstName"));
  fieldsToControl.push(document.querySelector("#lastName"));
  fieldsToControl.push(document.querySelector("#address"));
  fieldsToControl.push(document.querySelector("#city"));
  fieldsToControl.push(document.querySelector("#email"));

  //pour chaque objet : ajout de l'evènemet
  fieldsToControl.forEach((field) => {
    // console.log(field)
    field.addEventListener("focusout", (e) => {
      //focusout : lancé quand on sort du champ.
      e.preventDefault();
      checkForm();
    });
  });
}

function submitForm(e) {
  e.preventDefault();
  let cart = getCart();
  if (cart.length === 0) {
        alert("Votre panier est vide!");
        return;
  }
  if (checkForm()) {
    //==========> ne valide pas si check form trouve une anomalie
    const body = getFormValues();
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) =>{
        const orderId = data.orderId;
        window.location.href =
          "confirmation.html" + "?orderId=" + orderId;
      }
      );

    return true;
  }
  return false;
}

function error(element, errorMsg) {
  const formControl = element.parentElement;
  const message = formControl.querySelector("p");
  message.innerText = errorMsg;
}

function success(element) {
  const formControl = element.parentElement;
  const message = formControl.querySelector("p");
  message.innerText = "";
}

function getFormValues() {
  const cartForm = document.querySelector(".cart__order__form");
  const firstName = cartForm.elements.firstName.value;
  const lastName = cartForm.elements.lastName.value;
  const address = cartForm.elements.address.value;
  const city = cartForm.elements.city.value;
  const email = cartForm.elements.email.value;

  const bodyForm = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsInCart(),
  };
  return bodyForm;
}

function getIdsInCart() {
  let idTab = [];
  const cart = getCart();
  cart.forEach((item) => {
    if (!idTab.includes(item.id)) idTab.push(item.id);
  });
  return idTab;
}
