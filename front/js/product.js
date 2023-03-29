// Récupération de l'id de chaque article

const getArticleId = window.location.search;
const urlParams = new URLSearchParams(getArticleId);
const id = urlParams.get("id");

// On récupère l'id de chaque article

fetch(`http://localhost:3000/api/products/${id}`)
  .then((products) => products.json())
  .then((article) => {
    displayArticle(article);
    addToCart(article);
  });

function displayArticle(article) {
  document.getElementById("title").innerHTML = article.name;
  document.getElementsByClassName(
    "item__img"
  )[0].innerHTML = `<img src=${article.imageUrl} alt=${article.altTxt}>`;
  document.getElementById("price").innerHTML = article.price;
  document.getElementById("description").innerHTML = article.description;

  const articleColor = article.colors.map(
    (color) => `<option value=${color}>${color}</option>`
  );
  const colorSettings = `<option value="">--SVP, choisissez une couleur --</option> ${articleColor}`;
  document.getElementById("colors").innerHTML = colorSettings;
}

function addToCart(article) {
  const button = document.getElementById("addToCart");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const chosenColor = document.getElementById("colors").value;
    const chosenQuantity = document.getElementById("quantity").value;
    if (chosenColor == null || chosenColor === "" || chosenQuantity <= 0)
      return +alert("SVP renseignez la couleur et la quantité");
    if (chosenQuantity > 0 && chosenColor != null);
    button.innerText = "Produit ajouté!";

    const articlesInCart = {
      id: article._id,
      id_color: article._id + chosenColor,
      color: chosenColor,
      quantity: chosenQuantity,
      name: article.name,
      price: article.price,
    };

    addProductToCart(articlesInCart);

    window.location.href = "cart.html";
  });
}

function getCart() {
  let cart = localStorage.getItem("cart");

  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

function addProductToCart(product) {
  let cart = getCart();
  let productFound = cart.find((p) => p.id_color == product.id_color);
  if (productFound != undefined) {
    productFound.quantity++;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
