// Define the shopping cart object
var shoppingCart = (function () {
  var cart = [];

  function Item(
    sku,
    name,
    price,
    count,
    description,
    packOf3Price,
    packOf6Price,
    packOf12Price
  ) {
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.count = count;
    this.description = description;
    this.packOf3Price = packOf3Price;
    this.packOf6Price = packOf6Price;
    this.packOf12Price = packOf12Price;
  }

  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart")) || [];
  }

  loadCart();

  var obj = {};

  obj.addItemToCart = function (
    sku,
    name,
    price,
    count,
    description,
    packOf3Price,
    packOf6Price,
    packOf12Price
  ) {
    for (var item in cart) {
      if (cart[item].sku == sku) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    var item = new Item(
      sku,
      name,
      price,
      count,
      description,
      packOf3Price,
      packOf6Price,
      packOf12Price
    );
    cart.push(item);
    saveCart();
  };

  obj.setCountForItem = function (sku, count) {
    for (var i in cart) {
      if (cart[i].sku == sku) {
        cart[i].count = count;
        break;
      }
    }
    saveCart();
  };

  obj.removeItemFromCart = function (sku) {
    for (var item in cart) {
      if (cart[item].sku == sku) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  obj.removeItemFromCartAll = function (sku) {
    for (var item in cart) {
      if (cart[item].sku == sku) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  obj.totalCount = function () {
    var totalCount = 0;
    for (var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  obj.totalCart = function () {
    var totalCart = 0;
    for (var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  obj.totalCartItems = function () {
    var totalCartItems = 0;
    for (var item in cart) {
      totalCartItems += cart[item].count;
    }
    return Number(totalCartItems.toFixed(2));
  };

  obj.listCart = function () {
    var cartCopy = [];
    for (var i in cart) {
      item = cart[i];
      itemCopy = {};
      for (var p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total =
        item.count == 3 && item.packOf3Price != 0 && item.packOf3Price != ""
          ? Number(item.packOf3Price).toFixed(2)
          : item.count == 6 && item.packOf6Price != 0 && item.packOf6Price != ""
          ? Number(item.packOf6Price).toFixed(2)
          : item.count == 12 &&
            item.packOf12Price != 0 &&
            item.packOf12Price != ""
          ? Number(item.packOf12Price).toFixed(2)
          : Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  return obj;
})();

// Update the addToCart function to use shoppingCart object
function addToCart(sku) {
  var selectedProduct = list.find((product) => product.sku === sku);
  shoppingCart.addItemToCart(
    selectedProduct.sku,
    selectedProduct.name,
    selectedProduct.price,
    1,
    selectedProduct.description,
    selectedProduct.packOf3Price,
    selectedProduct.packOf6Price,
    selectedProduct.packOf12Price
  );
  displayCart();
}

// Update the displayCart function to display shopping cart contents
function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for (var i in cartArray) {
    var minusButton =
      cartArray[i].count > 1
        ? "<button class='minus-item input-group-addon btn btn-primary' data-sku='" +
          cartArray[i].sku +
          "' data-name='" +
          cartArray[i].name +
          "'>-</button>"
        : "<button class='delete-item btn btn-danger' data-sku='" +
          cartArray[i].sku +
          "' data-name='" +
          cartArray[i].name +
          "'><i class='fa fa-trash'></i></button>";
    output +=
      "<tr>" +
      "<td class='cartTd'>" +
      cartArray[i].name +
      "(" +
      cartArray[i].description +
      ")" +
      "</td>" +
      "<td class='priceInputCart'><div class='input-group'>" +
      minusButton +
      "<input type='tel' style='width:50px' min = 1 class='item-count form-control' data-sku='" +
      cartArray[i].sku +
      "' data-name='" +
      cartArray[i].name +
      "' value='" +
      cartArray[i].count +
      "'>" +
      "<button class='plus-item btn btn-primary input-group-addon' data-sku='" +
      cartArray[i].sku +
      "' data-name='" +
      cartArray[i].name +
      "'>+</button></div></td>" +
      "<td class='cartItemTotal'>" +
      "$ " +
      cartArray[i].total +
      "</td>" +
      "</tr>";
  }
  $(".show-cart").html(output);
  $(".item-cart").html(shoppingCart.totalCartItems());
  $(".total-cart").html(shoppingCart.totalCart());
  $(".total-count").html(shoppingCart.totalCount());
}

// Clear items
$(".clear-cart").click(function () {
  shoppingCart.clearCart();
  displayCart();
});

$(".show-cart").on("click", ".delete-item", function (event) {
  var sku = $(this).data("sku");
  shoppingCart.removeItemFromCartAll(sku);
  displayCart();
});

$(".show-cart").on("click", ".minus-item", function (event) {
  var sku = $(this).data("sku");
  shoppingCart.removeItemFromCart(sku);
  displayCart();
});

$(".show-cart").on("click", ".plus-item", function (event) {
  var sku = $(this).data("sku");
  shoppingCart.addItemToCart(sku);
  displayCart();
});

$(".show-cart").on("change", ".item-count", function (event) {
  var sku = $(this).data("sku");
  var count = Number($(this).val());
  shoppingCart.setCountForItem(sku, count);
  displayCart();
});

// Initial display of cart
displayCart();

$(".checkoutBtn").click(function () {
  $("#cart").modal("hide");
  return;
});

function sendEmail() {
  $(".total-cart").html(shoppingCart.totalCart());
  $(".item-cart").html(shoppingCart.totalCartItems());

  var form = $("#emailForm");

  var cartList = JSON.parse(sessionStorage.getItem("shoppingCart")) || [];
  var customerName = form.find("#name").val();
  var phoneNumber = form.find("#number").val();
  console.log(cartList);
  console.log(customerName);
  console.log(phoneNumber);
  if (cartList.length == 0) {
    alert("Your Cart is empty");
    return;
  }
  if (customerName == "" && phoneNumber == "") {
    alert("Please Enter Your Name and Number to proceed");
    return;
  } else {
    if (customerName == "") {
      alert("Please Enter Your Name to proceed");
      return;
    }
    if (phoneNumber == "") {
      alert("Please Enter Your Number to proceed");
      return;
    }
  }
  var currentDate = new Date().toLocaleDateString();

  // Create a div element for customer info
  var customerInfoDiv = document.createElement("div");
  customerInfoDiv.innerHTML =
    "<p>Customer Name: " +
    customerName +
    ", Phone Number: " +
    phoneNumber +
    "</p>" +
    "<p>Total Items: " +
    shoppingCart.totalCartItems() +
    ", Total Price: " +
    shoppingCart.totalCart() +
    "</p>" +
    "<p>Date: " +
    currentDate +
    "</p>";

  // Create a table element
  var table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  var headerRow = document.createElement("tr");

  var headers = ["SKU", "Name", "Price", "Count", "Description"];

  headers.forEach(function (headerText) {
    var headerCell = document.createElement("th");
    headerCell.style.border = "1px solid black";
    headerCell.style.padding = "8px";
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  table.appendChild(headerRow);

  var tbody = document.createElement("tbody");

  cartList.forEach(function (product) {
    var row = document.createElement("tr");

    for (var key in product) {
      if (
        key != "packOf3Price" &&
        key != "packOf6Price" &&
        key != "packOf12Price"
      ) {
        var cell = document.createElement("td");
        cell.style.border = "1px solid black";
        cell.style.padding = "8px";
        cell.textContent = product[key];
        row.appendChild(cell);
      }
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Combine customer info div and table
  var emailContent = customerInfoDiv.outerHTML + table.outerHTML;

  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "vvariamartt@gmail.com",
    Password: "7171C1284341CEB6F0AA7C24F80761EAD45A",
    To: "vvariamartt@gmail.com",
    From: "ismailyoussef25185@gmail.com, vvariamartt@gmail.com",
    Subject: "Order Details from " + customerName,
    Body: emailContent,
  }).then(function (message) {
    alert("Order Sent\nWe will contact you shortly to confirm the details.");
    sessionStorage.clear();
    location.reload();
  });
}

function closeOrderPopup() {
  var form = $("#emailForm");
  form.find("#name").val("");
  form.find("#number").val("");

  var popupContainer = document.getElementById("popupOrderContainer");
  popupContainer.style.display = "none";
}
