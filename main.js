//variables

//shopping cart menu
let cartButt = document.querySelector('.cart-btn');
let closeCartButt = document.querySelector('.close-cart');
let clearCartButt = document.querySelector('.clear-cart');
let cartMenu = document.querySelector(".cart");
let cartOpacity = document.querySelector(".cart-overlay");

//actual cart 
let cartItems = document.querySelector(".cart-items");
let cartTotal = document.querySelector(".cart-total");
let cartContent = document.querySelector(".cart-content");

//products
let productsMenu = document.querySelector(".products-center");

//cart
let cart = [];

//setting classes: 

//getting products from json 
class Products{
  async getProducts(){
    try {
      let result = await fetch('products.json');
      //getting data in json format
      let data = await result.json(); 
      //cleaning up json data: 
      let products = data.items;
      products = products.map(item =>{
        let {title, price} = item.fields;
        let {id} = item.sys;
        let image = item.fields.image.fields.file.url; 
        return {title, price, id, image};
      })
      return products;
    } catch (error) {
      console.log(error);
    }
  }  
}

// display products on website (insted of coding HTML)
class UI{
displayProducts(products){
let result =''; 
products.forEach(product => {
  result +=`
  <article class="product">
    <div class="img-container">
      <img src= ${product.image} 
      alt="produkt ${product.title}" 
      class="product-img">
      <button class="bag-btn" 
        data-id= ${product.id}>
        <p>Lägg i varukorg</p>
      </button>
    </div>
    
    <div class="products-items">
      <h3> ${product.title} </h3> 
      <h4> ${product.price} SEK</h4>
      <button class="grid-btn" data-id= ${product.id}>
        <p>KÖP</p>
      </button>
    </div>
  </article> 
  `;
});
productsMenu.innerHTML = result;
}
}
//local storage
class Storage{}

//function
document.addEventListener("DOMContentLoaded",() =>{
let ui = new UI();
let products = new Products();
//get all products

products.getProducts().then(products => ui.displayProducts(products));
})