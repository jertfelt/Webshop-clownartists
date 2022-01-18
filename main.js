//-----------variables

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
let buttons = [];

//------------CLASSES
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
        let description = item.fields.description; 
        return {title, price, id, image, description};
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
    <!--  <a href="productpage.html">
      <button class="bag-btn" 
        data-id= ${product.id}>
       <p>Läs mer</p>
      </button>
      </a> -->
    </div>

    <div class="products-items">
    <div class="products-items-row2">
      <h3> ${product.title} </h3> 
      <h4> ${product.price} SEK</h4>
      </div>
      <button class="grid-btn" data-id= ${product.id}>
        <p>KÖP</p>
      </button>
    </div>
  
  </article> 
  `;
});
productsMenu.innerHTML = result;
}

getButtons(){
  //creating nodes to arrays so I can loop through them and use array-methods:
  let buttonsCart = [...document.querySelectorAll(".grid-btn")];
  buttons = buttonsCart;

  //alternative buttons:
   // let buttonsMenu = [...document.querySelectorAll(".grid-btn")];
  // allMenuButtons = buttonsMenu;
 
  //*getting the ID:s and checking if they are in the cart
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
    let cartdiv = document.createElement("div");
    cartdiv.classList.add("cart-item-new");
    cartdiv.innerHTML = `
    <div class="cart-item" data-id=${item.id}>
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
    //clear cart (whole cart)
    clearCartButt.addEventListener("click", () => {
      this.clearCart();
    });

    //cart functionality (remove , add, take away ONE ITEM) 
    cartContent.addEventListener("click",event => {

      if(event.target.classList.contains("remove-item")){
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        let removingDom = removeItem.parentElement.parentElement;
        removingDom.classList.add("hide-item");
        this.removeItem(id);
      }

      else if (event.target.classList.contains("fa-chevron-up")){
       let addAmount = event.target;
       let addId = addAmount.dataset.id;
        //push new amount into local storage:
        let temporaryItem = cart.find(item => item.id === addId);
        temporaryItem.amount = temporaryItem.amount + 1;
       
        Storage.saveCart(cart);
        this.setCartValue(cart);
        addAmount.nextElementSibling.innerText = temporaryItem.amount;
      }

      else if (event.target.classList.contains("fa-chevron-down")){
       let reduceAmount = event.target;
       let reduceId = reduceAmount.dataset.id;
       
       //reduce new amount:
       let temporaryItem = cart.find(item => item.id ===reduceId);
       temporaryItem.amount = temporaryItem.amount -1;
      
        if(temporaryItem.amount > 0){
          Storage.saveCart(cart);
          this.setCartValue(cart);
          reduceAmount.previousElementSibling.innerText = temporaryItem.amount;
          
        }
        else{
          console.log(reduceAmount.parentElement.parentElement.classList)
          console.log(temporaryItem.id);
           let classID = (reduceAmount.parentElement.parentElement.getAttribute("data-id"));
          console.log(classID);
          if (temporaryItem.id === classID){
            reduceAmount.parentElement.parentElement.classList.add("hide-item")
          }
          this.removeItem(temporaryItem.id);
        }
      }
    });
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
    button.innerText = `KÖP`;
    button.style.backgroundColor ="#ED1C24";
    button.style.color ="#ececec";

  }
  getSingleCartButton(id){
    return buttons.find(button => button.dataset.id === id);
  };


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

//closing cart with escape button
document.addEventListener('keydown', function(event){
	if(event.key === "Escape"){
		cartOpacity.classList.remove("transparentBcg");
    cartMenu.classList.remove("showCart");
	}
});

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