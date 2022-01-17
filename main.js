//variables

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
let allCartButtons = [];
let allMenuButtons = [];


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
class Creating{
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
    <div class="products-items-row2">
      <h3> ${product.title} </h3> 
      <h4> ${product.price} SEK</h4>
      </div>
      <!--<button class="grid-btn" data-id= ${product.id}>
        <p>KÖP</p>
      </button>-->
    </div>
  </article> 
  `;
});
productsMenu.innerHTML = result;
}

//buttons and adding to cart functionality
getButtons(){
  //creating nodes to arrays so I can loop through them and use array-methods:
  let buttonsCart = [...document.querySelectorAll(".bag-btn")];
  allCartButtons = buttonsCart;

//*alternative buttons:
   // let buttonsMenu = [...document.querySelectorAll(".grid-btn")];
  // allMenuButtons = buttonsMenu;
 
  //getting the ID:s and checking if they are in the cart
  buttonsCart.forEach(button => {

    let id = button.dataset.id;
    let inCart = cart.find(item => item.id === id);
   
    //adding to cart, disabling double-adding
    if(inCart){
      button.innerText = "I varukorgen";
      button.disabled = true;
      button.style.backgroundColor ="#707070";
      button.style.color ="#ececec"
    }

    //button on image:
    button.addEventListener("click", (event) => {
        event.target.innerText ="I varukorgen";
        event.target.disabled = true;

        //product from products
        //creating object:
        let cartItem = {...Storage.getProduct(id), amount:1};
        
        //add product to the cart (in array)
        cart = [...cart,cartItem];
        
        //save cart-array in local storage
        Storage.saveCart(cart);

        //set cart values 
        this.setCartValue(cart);

        //display cart item
        this.addCartItem(cartItem);

        //show cart 
        this.showCart();

      });
    })
  };

  setCartValue(cart){
    let temporaryTotal = 0;
    let itemsTotal = 0;
    cart.map(item =>{
      //amount of items multiplied by their prices
      temporaryTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    //showing amount in cart in navigations wooo!:
    cartItems.innerText = itemsTotal; 
    ///fixing decimals
    cartTotal.innerText = parseFloat(temporaryTotal.toFixed(2));
  }
  //for each cart item:
  addCartItem(item){
    let cartdiv =document.createElement("div");
    cartdiv.classList.add("cart-item");
    cartdiv.innerHTML = `
    <div class="cart-item">
        <img src=${item.image}
    alt="product" />
    <div>
      <h4>${item.title}</h4>
      <h5>${item.price}SEK</h5>
      <span class="remove-item" data-id=${item.id} >Remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down"data-id=${item.id} ></i>
    </div>
    </div> 
    `
    cartContent.appendChild(cartdiv);
  }

  setupCart(){
    cart = Storage.getCartStart();
    this.setCartValue(cart);
    this.populateCart(cart);
    //activate buttons (close, open)

    cartButt.addEventListener("click", this.showCart);
    //hide cart
    closeCartButt.addEventListener("click",this.hideCart);
  };

  showCart(){
    cartOpacity.classList.add("transparentBcg");
    cartMenu.classList.add("showCart");
  };

  hideCart(){
    cartOpacity.classList.remove("transparentBcg");
    cartMenu.classList.remove("showCart");
  }

    //method for cart array
  populateCart(cart){
      //adding cart items to the cart
      cart.forEach(item => this.addCartItem(item));
    }

  cartLogic(){
    //clear cart (accessing within class)
    clearCartButt.addEventListener("click", () => {
      this.clearCart();
    });

    //cart functionality (remove, add, take away)
  
        
    
      
      
    }
  

  clearCart(){
    //get all the ID:s from the cart
    let cartItemsAllClear = cart.map(item => item.id);
  
    //loop over the array and remove
    cartItemsAllClear.forEach(id => this.removeItem(id));
    
    while(cartContent.children.length>0){
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
    
  }
  removeItem(id){
    cart = cart.filter(item => item.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    
    let button = this.getSingleCartButton(id);
    button.disabled = false;
    button.innerText = `Lägg i varukorg`;
    button.style.backgroundColor ="#1c75bc";
    button.style.color ="#201E1E";

  }
  getSingleCartButton(id){
    return allCartButtons.find(button => button.dataset.id === id);
  };





    // //button in grid:
    // buttonsMenu.forEach(button => {

    //   let id = button.dataset.id;
    //   let inCart = cart.find(item => item.id === id);
     
    //   //adding to cart, disabling double-adding
    //   if(inCart){
    //     button.innerText = "I varukorgen";
    //     button.disabled = true;
    //     button.style.backgroundColor ="#707070";
    //   }
    //   button.addEventListener("click", (event) => {
    //       event.target.innerText ="I varukorgen";
    //       event.target.disabled = true;
          
  
    //       //product from products
    //       //creating object:
    //       let cartItem = {...Storage.getProduct(id), amount:1};
          
    //       //add product to the cart (in array)
    //       cart = [...cart,cartItem];
          
    //       //save cart-array in local storage
    //       Storage.saveCart(cart);
  
    //       //set cart values 
    //       this.setCartValue(cart);
  
    //       //display cart item
    //       this.addCartItem(cartItem);
  
    //       //show cart 
    //       this.showCart();
    //     });

    //   });


  // getSingleGridButton(id){
  //   return allMenuButtons.find(button => button.dataset.id === id);
  // };

};


//*----------------local storage
//all products
class Storage{
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
  }
  //take product from products
  static getProduct(id){
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id ===id);
  }
  //cart array in local storage
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCartStart(){
    //saving the cart for future visits or, for first time visitors, an empty array:
    return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
  }
}

// function keyPress (e) {
//   if(e.key === "Escape") {
//     cartOpacity.classList.remove("transparentBcg");
//     cartMenu.classList.remove("showCart");
//   }}

//------function eventlistener(loading page)
document.addEventListener("DOMContentLoaded",() =>{
let creating = new Creating();
let products = new Products();
//setting up
creating.setupCart();

//get all products and fix local storage
//*by using .then we add things ONLY after adding products
products.getProducts().then(products => {
  creating.displayProducts(products);
  Storage.saveProducts(products);
}).then(()=>{
  creating.getButtons();
  creating.cartLogic();
});

});