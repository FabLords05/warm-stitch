# Warm Stitch — E-Commerce Concept Website

**Step Into Confidence**

A storefront website for Warm Stitch, a premium apparel brand based in Cagayan de Oro City.
Customers can browse individual pieces and coordinated sets, pick a size (the price updates to
match), open a photo for a closer look, add items to a shopping bag, and complete a demonstration
checkout.

> **No real payments.** The checkout collects delivery details and shows an order confirmation,
> but nothing is sent anywhere and no card details are ever collected.

---

## Folder map

```
website/
├── README.md              ← you are here
│
├── src/                   ← THE WEBSITE. Everything the site needs lives here.
│   ├── index.html         ← the page itself (markup only — no JavaScript inside)
│   └── assets/
│       ├── css/styles.css
│       ├── js/            ← one file per job, see the table below
│       └── images/
│           ├── logo/
│           └── products/
│
├── docs/
│   └── concept-paper/     ← the written concept paper
│
└── archive/               ← the previous version of the site, kept for reference
    ├── Website.html
    ├── backup-website/
    ├── images/
    └── original-instructions.txt
```

Everything in `archive/` is the older single-file version of this site. It is kept so nothing is
lost, but it is **not** part of the current website and nothing in `src/` depends on it.

> Note: `archive/Website.html` expects its photos to sit in the same folder, so if you open it the
> pictures show as grey placeholders. The images themselves are safe in `archive/images/`. This is
> exactly the problem the new structure fixes.

---

## Running it

**The easy way** — double-click `src/index.html`. It opens in your browser and everything works.

**The accurate way** — serve it over HTTP, which is how a real web server would deliver it:

```bash
cd src
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Both work. The second is worth doing once before any presentation, because it is closer to how the
site behaves when hosted.

> One small difference: when opened by double-click, some browsers block a page from remembering
> things between visits, so the shopping bag may empty on refresh. Served over HTTP it always
> remembers. Nothing else changes.

---

## The JavaScript files

| File | What it does |
|---|---|
| `products.js` | **The catalog data.** Names, prices, sizes, descriptions, photos. |
| `catalog.js` | Draws the product cards, runs the filters and the search box. |
| `quickview.js` | The popup that opens when you click a product photo. |
| `cart.js` | The shopping bag: adding, quantities, totals, saving between visits. |
| `checkout.js` | The demonstration checkout and the order confirmation. |
| `ui.js` | Shared bits — notifications, opening/closing popups, peso formatting. |
| `main.js` | Starts everything up and connects the buttons to the code. |
| `theme.js` | The brand colours and fonts. |

---

## Common edits

### Changing a price, name, size or description

Open **`src/assets/js/products.js`**. That is the only file you need. Each product looks like this:

```js
{
  id: 'rosa-top',
  name: 'WarmStitch Rosa Top',
  gender: 'women',          // 'women' or 'men'   -> Women / Men filters
  type: 'top',              // 'top', 'bottom' or 'set' -> Tops / Bottoms / Sets filters
  image: 'assets/images/products/rosa-top.jpg',
  prices: { S: 289, M: 289, L: 309, XL: 399 },   // <- price per size
  description: 'A lovely cream top featuring a square neckline...'
}
```

Change a number in `prices` and the website shows the new price immediately — on the card, in the
popup and in the bag. Save the file and refresh the page.

### Adding a photo to a product that doesn't have one

One product currently shows a cream **"Photo coming soon"** tile instead of a photograph:

| Product | Expected filename |
|---|---|
| Lymio Baggy Jeans for Men | `lymio-baggy-jeans.jpg` |

Send the original image files rather than screenshots of them — a photo cropped out of a chat
screenshot comes through at roughly 150 px wide, which looks blurry at the size the cards display.

To give one a real photo:

1. Put the image file in `src/assets/images/products/`.
   Name it in lowercase with hyphens and **no spaces** — `cape-top.jpg`, not `Cape Top.png`.
2. In `products.js`, find that product and change:
   ```js
   image: null,
   ```
   to:
   ```js
   image: 'assets/images/products/cape-top.jpg',
   ```
3. Refresh the page.

Tall, portrait-shaped photos look best — the cards are sized 3:4.

### Adding a brand-new product

Copy any existing block in `products.js`, paste it into the list, and change the values. Give it an
`id` that no other product uses. Nothing else needs editing.

---

## How it's built

Plain HTML, CSS and JavaScript — no frameworks to install, no build step, no `node_modules`.
The folder *is* the website. Two notes for anyone reviewing the code:

- **The `<script>` tags are ordinary ones, not ES modules.** Modules refuse to load when a page is
  opened directly from a folder (`file://`), which would make double-clicking `index.html` show a
  blank page. Ordinary scripts keep the code just as neatly separated while still working either
  way. Each file hangs its functions off one shared `WS` object.

- **Tailwind CSS is loaded from a CDN** rather than compiled. That keeps the project toolchain-free.
  It does print a "not for production" note in the browser's developer console — visitors never see
  it. To remove it later, compile Tailwind properly:
  ```bash
  npx tailwindcss@3.4.17 -i assets/css/styles.css -o assets/css/build.css --minify
  ```
  then swap the CDN `<script>` tag in `index.html` for a link to `build.css`.

---

## What the website covers

| Requirement | Where |
|---|---|
| Business name, logo, tagline | Header and hero |
| Featured products, call-to-action | Hero — *Shop the Collection* / *Learn Our Story* |
| Business background, mission, vision | About Us |
| The people behind the business | About Us — *The Minds Behind Warm Stitch* |
| Product names, descriptions, prices, images, size variations | Catalog |
| Add-to-cart, checkout | Bag drawer and checkout popup |
| Contact number, email, location, inquiry form | Contact Us |
| Working social media links | Header, mobile menu, Contact Us, footer |
| Payment methods, delivery options, returns policy | Payment & Delivery |
