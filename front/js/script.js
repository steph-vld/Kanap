// Récupération de tous les produits par requête à l'api

fetch("http://localhost:3000/api/products")
  .then((products) => products.json())
  .then((articles) => displayArticles(articles))

function displayArticle(article) {

  const blocArticle = `<a href="./product.html?id=${article._id}">
  <article>
  <img src=${article.imageUrl} alt=${article.altTxt}>
   <h3 class="productName">${article.name}</h3>
   <p class="productDescription">${article.description}</p>
  </article>
  </a>`;

  document.getElementById("items").innerHTML += blocArticle;
  
}

function displayArticles(articles) {
  
  articles.forEach((article) => displayArticle(article));
}
