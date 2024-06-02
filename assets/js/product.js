var list = [];
var fileTitle = "";
var url = "./Json/";
var hashName = window.location.hash;

$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
 var categoryId = urlParams.get("categoryId");

  const hashValue = window.location.hash;

  if (hashValue == "") {
    if (categoryId == 1) {
      fileTitle = "homeCare";
      $("#categoryName").text("- Home Care");
    } else if (categoryId == 2) {
      fileTitle = "personalCare";
      $("#categoryName").text("- Personal Care");
    } else if (categoryId == 3) {
      fileTitle = "babyCare";
      $("#categoryName").text("- Baby Care");
    } else if (categoryId == 4) {
      fileTitle = "teethCare";
      $("#categoryName").text("- Teeth Care");
    } else if (categoryId == 5) {
      fileTitle = "cloth";
      $("#categoryName").text("- Cloth");
    } else if (categoryId == null) {
      window.location.href = "index.html";
    }
  } else {
    if (categoryId == 1) {
      fileTitle = "boyCloth";
      $("#categoryName").text("- Cloth Boys");
      $(".mainbackArrow").attr("href", "product-details.html?categoryId=5");    } else if (categoryId == 2) {
      fileTitle = "girlCloth";
      $("#categoryName").text("- Cloth Girls");
      $(".mainbackArrow").attr("href", "product-details.html?categoryId=5");    }
  }

  $(".empty-div").click(function () {
    console.log("empty-div");
  });

  if (categoryId == 5) {
    getClothCategories();
  } else {
    getProducts();
  }
});

function openProducts(categoryId, name) {
  console.log(categoryId);
  window.location.href =
    "product-details.html?categoryId=" + categoryId + "#" + name;
}

function getClothCategories() {
  $.getJSON("./Json/clothCategoryList.json", function (data) {
    var categoryContainer = $("#categoryContainer");

    var list = data.list;

    list.forEach((category) => {
      if (category.active) {
        var categoryHTML = `
    <div class="col-lg-2 col-6 p-3 ${
      category.comingSoon ? "" : `category-item`
    }">
      <a ${
        category.comingSoon
          ? ""
          : `onclick="openProducts(${category.id} , '${category.name}')"`
      } id="${category.id}">
        <div class="item">
          <div class="image">
            <img
              src="assets/images/categories/${category.src}"
              alt="${category.name}"
              style="max-width: 70px"
            />
          </div>
          <h4 class="category-Name">${category.name}</h4>
          ${category.comingSoon ? `<p class="comingSoon">Coming Soon</p>` : ""}
        </div>
      </a>
    </div>`;
      }
      // Append the HTML to categoryContainer
      categoryContainer.append(categoryHTML);
    });
  }).fail(function () {
    console.log("An error has occurred.");
  });
}

function getProducts() {
  fetch(url + fileTitle + "ProductList.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      var productContainer = document.getElementById("productContainer");
      list = data.list;

      list.forEach(function (product) {
        if (product.active) {
          var productHTML =
            '<div class="col-lg-2 col-6">' +
            '<div class="item product-item" style="background-image: url(assets/images/products/' +
            fileTitle +
            "/" +
            product.src +
            ');">' +
            '<div class="thumb">' +
            '<div class="empty-div"><input readonly type="text" class="hidden-input" id="myInput" onclick="openPopup(\'' +
            product.sku +
            "')\"></div>" + // Empty div added here
            (product.discountedPrice !== 0
              ? '<span class="price price-discount"><em>' +
                product.currency +
                product.price +
                "</em>" +
                product.currency +
                product.discountedPrice +
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
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
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
            <td class="grey-bg">Description</td>
            <td>${product.description}</td> <!-- Fixed typo here -->
          </tr>
          ${hashName == "#Boys" || hashName == "#Girls" ? 
            `<tr style="color:#efb611">
              <td class="grey-bg" style="vertical-align: middle;"><strong>Age</strong></td>
              <td><strong>${product.age}</strong></td> 
            </tr>` : ""
          }
          <tr>
            <td class="grey-bg">Price</td>
            ${
              product.discountedPrice !== 0
                ? `<td style="color: red;"><span style="text-decoration: line-through;">${product.currency}${product.price}</span>&nbsp;<span>${product.currency}${product.discountedPrice}</span></td>`
                : `<td class="price">${product.currency}${product.price}</td>`
            }
          </tr>
          ${
            fileTitle != "boyCloth" && fileTitle != "girlCloth"
              ? `
            <tr>
              <td class="grey-bg">Pack of 3</td>
              ${
                product.packOf3Price !== 0
                  ? `<td>${product.currency}${product.packOf3Price}</td>`
                  : `<td>-</td>`
              }
            </tr>
            <tr>
              <td class="grey-bg">Pack of 6</td>
              ${
                product.packOf6Price !== 0
                  ? `<td>${product.currency}${product.packOf6Price}</td>`
                  : `<td>-</td>`
              }
            </tr>
            <tr>
              <td class="grey-bg">Pack of 12</td>
              ${
                product.packOf12Price !== 0
                  ? `<td>${product.currency}${product.packOf12Price}</td>`
                  : `<td>-</td>`
              }
            </tr>
            `
              : ""
          }
        </table>
      `;
  
      var imageUrl1 = `assets/images/products/${fileTitle}/${product.src}`;
      var imageUrl2 = `assets/images/products/${fileTitle}/${product.src1}`;
  
      popupImage.src = imageUrl1;
      popupImage.classList.add("modal-content");
  
      // Set fixed width and height for the images
      popupImage.style.width = "280px"; // Set your desired width
      popupImage.style.height = "200px"; // Set your desired height
  
      // Set object-fit to contain
      popupImage.style.objectFit = "contain";
  
      // Create arrow buttons for image switching
      const prevButton = document.createElement("button");
      // Create an icon element for the previous button
      const prevIcon = document.createElement("i");
      prevIcon.classList.add("fa-solid", "fa-chevron-left"); // Assuming you have Font Awesome loaded
  
      // Append the icon to the previous button
      prevButton.appendChild(prevIcon);
  
      const nextButton = document.createElement("button");
      // Create an icon element for the previous button
      const nextIcon = document.createElement("i");
      nextIcon.classList.add("fa-solid", "fa-chevron-right"); // Assuming you have Font Awesome loaded
  
      // Append the icon to the previous button
      nextButton.appendChild(nextIcon);
  
      // Append buttons to the modal
      const btnsDiv = document.querySelector(".btns");
      btnsDiv.innerHTML = "";
      if (product.src1 !== undefined) {
        btnsDiv.appendChild(prevButton);
        btnsDiv.appendChild(nextButton);
      }
      let currentImageIndex = 1; // Start with the first image
  
      // Function to update the displayed image
      function updateImage(index) {
        if (index === 1) {
          popupImage.src = imageUrl1;
        } else if (index === 2) {
          popupImage.src = imageUrl2;
        }
      }
  
      // Event listeners for arrow buttons
      prevButton.addEventListener("click", () => {
        currentImageIndex = currentImageIndex === 1 ? 2 : 1;
        updateImage(currentImageIndex);
      });
  
      nextButton.addEventListener("click", () => {
        currentImageIndex = currentImageIndex === 1 ? 2 : 1;
        updateImage(currentImageIndex);
      });
  
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
