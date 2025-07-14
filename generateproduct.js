const fs = require('fs');

function generateProduct(id, titlePrefix, category) {
  return {
    id: id,
    title: `${titlePrefix} Product ${id}`,
    price: (Math.random() * (500 - 10) + 10).toFixed(2),
    category: category,
    image: "https://via.placeholder.com/150"
  };
}

let products = [];

// 25 electronics
for (let i = 1; i <= 25; i++) {
  products.push(generateProduct(i, "Electronics", "electronics"));
}

// 20 jewelery
for (let i = 26; i <= 45; i++) {
  products.push(generateProduct(i, "Jewelery", "jewelery"));
}

// 20 men's clothing
for (let i = 46; i <= 65; i++) {
  products.push(generateProduct(i, "Men's Clothing", "men's clothing"));
}

// 20 women's clothing
for (let i = 66; i <= 85; i++) {
  products.push(generateProduct(i, "Women's Clothing", "women's clothing"));
}

// Write to products.json
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

console.log("✅ products.json file created successfully!");
