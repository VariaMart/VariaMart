var list = [];
var fileTitle = "";

$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var categoryId = urlParams.get("categoryId");

  var url = "./Json/";
  if (categoryId == 1) {
    fileTitle = "home";
    $("#categoryName").text("- Home Care");
  } else if (categoryId == 2) {
    fileTitle = "personal";
    $("#categoryName").text("- Personal Care");
  } else if (categoryId == 3) {
    fileTitle = "baby";
    $("#categoryName").text("- Baby Care");
  } else if (categoryId == 4) {
    fileTitle = "teeth";
    $("#categoryName").text("- Teeth Care");
  } else if (categoryId == 5) {
    fileTitle = "Cloth";
    $("#categoryName").text("- Cloth");
  } else if (categoryId == null) {
    window.location.href = "index.html";
  }

  $(".empty-div").click(function () {
    console.log("empty-div");
  });

  getProducts();
});

async function getProducts() {
  // fetch(url + fileTitle + "CareProductList.json")
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {

  const sheetName = "Products";
  const sheetId = "16VszPnGRiPHcFnU78eczPRI3hRJEjHbFFG3vBJUq8wM";

  var productContainer = document.getElementById("productContainer");
  list = await readData(sheetId, sheetName);

  list.forEach(function (product) {
    if (product.active) {
      var productHTML =
        '<div class="col-lg-2 col-6">' +
        '<div class="item product-item" style="background-image: url(' +
        product.image +
        ');">' +
        '<div class="thumb">' +
        '<div class="empty-div"><input readonly type="text" class="hidden-input" id="myInput" onclick="openPopup(\'' +
        product.sku +
        "')\"></div>" + // Empty div added here
        (product.discounted_price != 0 && product.discounted_price != ""
          ? '<span class="price price-discount"><em>' +
            product.currency +
            product.price +
            "</em>" +
            product.currency +
            product.discounted_price +
            "</span>"
          : '<span class="price">' +
            product.currency +
            product.price +
            "</span>") +
        "</div>" +
        '<div class="down-content">' +
        "<a onclick=\"addToCart('" +
        product.sku +
        '\')" data-sku="' +
        product.sku +
        '" style="width:150px"><i class="fa fa-shopping-bag" style="margin-right:10px"></i>Add';
      "</a>" + "</div>" + "</div>" + "</div>";
      productContainer.insertAdjacentHTML("beforeend", productHTML);
    }
  });

  // })
  // .catch((error) => {
  //   console.error("There was a problem with the fetch operation:", error);
  // });
}

function openPopup(sku) {
  var popupContainer = document.getElementById("popupContainer");
  var popupImage = document.getElementById("popupImage");
  var popupDescription = document.getElementById("popupDescription");

  for (const product of list) {
    if (product.sku == sku) {
      var Description = `
      <table class='cartTable table table-striped table-bordered'>
        <tr>
          <td class="grey-bg">SKU</td>
          <td>${product.sku}</td>
        </tr>
        <tr>
          <td class="grey-bg">Name</td>
          <td>${product.name}</td>
        </tr>
        <tr>
          <td class="grey-bg">Price</td>
          ${
            product.discounted_price != 0 && product.discounted_price != ""
              ? `<td style="color: red;"><span style="text-decoration: line-through;">${product.currency}${product.price}</span>&nbsp;<span>${product.currency}${product.discounted_price}</span></td>`
              : `<td class="price">${product.currency}${product.price}</td>`
          }
        </tr>
        <tr>
        <td class="grey-bg">Pack of 3</td>
        ${
          product.pack_of_3_price !== 0 && product.pack_of_3_price != ""
            ? `<td>
              ${product.currency}${product.pack_of_3_Price}
            </td>`
            : `<td>-</td>`
        }
      </tr>
      <tr>
      <td class="grey-bg">Pack of 6</td>
      ${
        product.pack_of_6_price !== 0 && product.pack_of_6_price != ""
          ? `<td>
            ${product.currency}${product.pack_of_6_price}
          </td>`
          : `<td>-</td>`
      }
    </tr>
    <tr>
    <td class="grey-bg">Pack of 12</td>
    ${
      product.pack_of_12_price !== 0 && product.pack_of_12_price != ""
        ? `<td>
          ${product.currency}${product.pack_of_12_price}
        </td>`
        : `<td>-</td>`
    }
  </tr>
      </table>
    `;

      var imageUrl = product.image;
      // var imageUrl = `assets/images/products/${fileTitle}Care/${product.src}`;
      popupImage.src = imageUrl;
      popupImage.classList.add("modal-content");

      // Set fixed width and height
      popupImage.style.width = "280px"; // Set your desired width
      popupImage.style.height = "200px"; // Set your desired height

      // Set object-fit to contain
      popupImage.style.objectFit = "contain";

      popupDescription.innerHTML = Description;
      popupContainer.style.display = "block";

      return;
    }
  }
}

function closePopup() {
  var popupContainer = document.getElementById("popupContainer");
  popupContainer.style.display = "none";
}
