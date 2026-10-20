# ShopEase – E-commerce Product Listing Website

A frontend demonstration of an online store built with HTML5, CSS3 and vanilla JavaScript.
**It uses sample data only. There is no backend, no order processing and no payment gateway.**

## Objectives
- Browse products by category, search, filter by price and sort.
- View product details.
- Manage a shopping cart that survives page refreshes.

## Features
- Responsive navbar (logo, Home, categories, search, cart icon with live count) and hero section.
- Category cards: All Products, Electronics, Clothing, Accessories.
- 12 products rendered dynamically, with a "Showing X of 12 products" counter and an empty-results message.
- Search (name and category), min/max price filters with validation, sorting (price low-high, high-low, name A-Z), Clear Filters.
- Product details view with image, name, price, category, rating, description and Add to Cart.
- Cart: add, merge duplicates, + / − quantity (never below 1), Remove, line subtotals, total, empty-cart message, Continue Shopping, demo checkout notice.
- Image fallback if a picture cannot load; toast messages instead of alerts.

## Technologies
HTML5, CSS3 (Grid and Flexbox), vanilla JavaScript, browser `localStorage`.

## File structure
```
ecommerce-product-listing/
├── index.html   page structure (home, details and cart views)
├── style.css    styling and responsive rules
├── script.js    data, filtering, cart, rendering, events
└── README.md
```

## Run locally
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.
(Double-clicking `index.html` also works. Product images need an internet connection.)

## How product data is stored
All products live in one array called `products` at the top of `script.js`. Each object has `id`, `name`, `category`, `price` (number, in ₹), `image`, `description` and `rating`.

## How the main features work
- **Filtering / search / sorting:** one `filters` object stores the current category, search text, min, max and sort. `getVisibleProducts()` applies them all in order, so they never overwrite each other. `renderProducts()` redraws only the grid.
- **Price validation:** `readPriceInputs()` rejects negative or non-numeric values and a minimum greater than the maximum, showing an inline message.
- **Views:** the URL hash (`#/`, `#/product/3`, `#/cart`) decides which section is visible; `router()` handles this without reloading.
- **Cart:** stored as `[{ id, qty }]` under the key `shopEaseCart`. `addToCart` increases `qty` if the item exists. `loadCart()` uses try/catch and discards invalid entries. Totals come from `getCartTotal()`; the badge from `getCartCount()`.

## Testing checklist
- [ ] Page loads with no console errors
- [ ] Category cards and nav links filter correctly
- [ ] Search matches names and categories
- [ ] Min/max price filters work; invalid input shows a message
- [ ] Search + category + price + sort work together
- [ ] Clear Filters resets everything
- [ ] View Details shows the right product
- [ ] Add to Cart works from cards and details page
- [ ] + / − / Remove work; totals and badge are correct
- [ ] Cart persists after refresh
- [ ] Empty results and empty cart messages appear
- [ ] Layout works at mobile, tablet and desktop widths

## Limitations
- Sample data and a demo checkout only; no real orders, accounts or payments.
- Images are loaded from Unsplash and need internet access; a placeholder appears if they fail.
- The cart is saved only in the current browser.
