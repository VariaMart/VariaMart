var list = [];
var fileTitle = "";

$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var categoryId = urlParams.get("categoryId");

  var url = "./Json/";
  if (categoryId == 1) {
    fileTitle = "home";
    $("#categoryName").text("- Cleaning & Household");
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

  $.getJSON((url += fileTitle + "CareProductList.json"), function (data) {
    var productContainer = $("#productContainer");

    list = data.list;

    list.forEach((product) => {
      if (product.active) {
        var productHTML = ` <div class="col-lg-2 col-6">
      <div class="item product-item" onclick="openPopup('${
        product.SKU
      }')" style="background-image: url(assets/images/products/${fileTitle}Care/${
          product.src
        });">
        <div class="thumb">
          ${
            product.discountedPrice !== 0
              ? `<span class="price price-discount"><em>${product.currency}${product.price}</em>${product.currency}${product.discountedPrice}</span>`
              : `<span class="price">${product.currency}${product.price}</span>`
          }
        </div>
        <div class="down-content">
          <a style="width:150px"><i class="fa fa-shopping-bag" style="margin-right:10px"></i>${
            product.SKU
          }</a>
        </div>
      </div>
    </div>`;
        productContainer.append(productHTML);
      }
    });
  }).fail(function () {
    console.log("An error has occurred.");
  });
});

function openPopup(SKU) {
  var popupContainer = document.getElementById("popupContainer");
  var popupImage = document.getElementById("popupImage");
  var popupDescription = document.getElementById("popupDescription");

  for (const product of list) {
    if (product.SKU == SKU) {
      var Description = `
      <table>
        <tr>
          <td class="grey-bg">SKU</td>
          <td>${product.SKU}</td>
        </tr>
        <tr>
          <td class="grey-bg">Name</td>
          <td>${product.Name}</td>
        </tr>
        <tr>
          <td class="grey-bg">Price</td>
          ${
            product.discountedPrice !== 0
              ? `<td style="color: red;"><span style="text-decoration: line-through;">${product.currency}${product.price}</span>&nbsp;<span>${product.currency}${product.discountedPrice}</span></td>`
              : `<td class="price">${product.currency}${product.price}</td>`
          }
        </tr>
        <tr>
        <td class="grey-bg">Pack of 3</td>
        ${
          product.packOf3Price !== 0
            ? `<td>
              ${product.currency}${product.packOf3Price}
            </td>`
            : `<td>-</td>`
        }
      </tr>
      <tr>
      <td class="grey-bg">Pack of 6</td>
      ${
        product.packOf6Price !== 0
          ? `<td>
            ${product.currency}${product.packOf6Price}
          </td>`
          : `<td>-</td>`
      }
    </tr>
    <tr>
    <td class="grey-bg">Pack of 12</td>
    ${
      product.packOf12Price !== 0
        ? `<td>
          ${product.currency}${product.packOf12Price}
        </td>`
        : `<td>-</td>`
    }
  </tr>
      </table>
    `;

      var imageUrl = `assets/images/products/${fileTitle}Care/${product.src}`;
      popupImage.src = imageUrl;
      popupImage.classList.add("modal-content");

      // Set fixed width and height
      popupImage.style.width = "300px"; // Set your desired width
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
