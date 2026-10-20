/* ==========================================================================
   Warm Stitch — Product Catalog
   --------------------------------------------------------------------------
   THIS IS THE FILE TO EDIT when prices, names, sizes or photos change.
   Nothing else needs to be touched.

   Each product:
     id          unique string, used by the cart
     name        shown on the card
     gender      'women' | 'men'        -> drives the Women / Men filters
     type        'top' | 'bottom' | 'set' -> drives the Tops / Bottoms / Sets filters
     image       path to the photo, or null to show the placeholder tile
     prices      price PER SIZE in pesos — this is what makes the price change
                 when the shopper picks a different size
     description shown on the card and in the quick-view popup

   To add a photo for one of the placeholder items:
     1. drop the file into  assets/images/products/
     2. change  image: null  to  image: 'assets/images/products/your-file.jpg'
   ========================================================================== */

var WS = window.WS = window.WS || {};

WS.products = [
  /* ---------------------------------------------------------------- WOMEN */
  {
    id: 'rosa-top',
    name: 'WarmStitch Rosa Top',
    gender: 'women',
    type: 'top',
    image: 'assets/images/products/rosa-top.jpg',
    prices: { S: 289, M: 289, L: 309, XL: 399 },
    description: 'A lovely cream top featuring a square neckline, puff sleeves, and delicate button details. Its feminine design makes it easy to style with floral pants, jeans, skirts, or your favorite everyday bottoms.'
  },
  {
    id: 'white-cape-top',
    name: 'White Cropped Cape Top',
    gender: 'women',
    type: 'top',
    image: 'assets/images/products/white-cape-top.jpg',
    prices: { S: 1850, M: 1950, L: 2050, XL: 2200 },
    description: 'Elegant white cropped cape-style top with a refined mandarin collar, short cape sleeves, and four distinctive sculptural gold-tone decorative buttons down the front. Modern, modest, and eye-catching.'
  },
  {
    id: 'rosebud-floral-pants',
    name: 'WarmStitch Rosebud Floral Pants',
    gender: 'women',
    type: 'bottom',
    image: 'assets/images/products/rosebud-floral-pants.jpg',
    prices: { S: 349, M: 349, L: 369, XL: 420 },
    description: 'Featuring a soft cream base with delicate pink rose prints and tiny green leaves, these floral pants bring a charming touch to your everyday outfit. Pair them with a plain top for a cute, coordinated, and effortlessly stylish look.'
  },
  {
    id: 'ivory-satin-skirt',
    name: 'Ivory Satin A-Line Midi Skirt',
    gender: 'women',
    type: 'bottom',
    image: 'assets/images/products/ivory-satin-skirt.jpg',
    prices: { S: 2100, M: 2250, L: 2400, XL: 2600 },
    description: 'Luxurious ivory satin full A-line midi skirt with a wrapped waistband and a dramatic oversized bow detail at the side. Silky, flowing fabric with a timeless, romantic silhouette.'
  },
  {
    id: 'aria-luna-set',
    name: 'Aria & Luna Cream Set',
    gender: 'women',
    type: 'set',
    image: 'assets/images/products/aria-luna-cream-set.jpg',
    prices: { S: 1750, M: 1850, L: 1950, XL: 2250 },
    description: 'This elegant two-piece matching set features the Aria wrap top and Luna wide-leg trousers in a beautiful soft cream hue. The sleeveless top has a flattering wrap V-neck, ruched waist detail with a stylish gold-tone buckle accent, and an asymmetrical peplum hem. Paired with high-waisted wide-leg trousers with subtle front pleats, the fabric is smooth and premium, giving a polished, sophisticated silhouette perfect for office, meetings, luncheons, or semi-formal events.'
  },
  {
    id: 'dolce-crudo-set',
    name: 'Dolce Crudo Denim Set',
    gender: 'women',
    type: 'set',
    image: 'assets/images/products/dolce-crudo-denim-set.jpg',
    prices: { S: 2200, M: 2300, L: 2400, XL: 2500 },
    description: 'A stylish matching outfit featuring a trendy top and high-waisted, wide-leg denim jeans. Perfect for a chic, comfortable, and effortless everyday look.'
  },

  /* ------------------------------------------------------------------ MEN */
  {
    id: 'brown-button-up',
    name: 'Classic Brown Button-Up',
    gender: 'men',
    type: 'top',
    image: 'assets/images/products/classic-brown-button-up.jpg',
    prices: { S: 550, M: 570, L: 590, XL: 620 },
    description: 'A stylish dark brown long-sleeve button-up shirt with a front pocket and a relaxed fit. Perfect for casual outings, school activities, and semi-formal occasions.'
  },
  {
    id: 'cream-plaid-casual',
    name: 'The Cream Plaid Layered Casual',
    gender: 'men',
    type: 'top',
    image: 'assets/images/products/cream-plaid-layered-casual.jpg',
    prices: { S: 850, M: 850, L: 900, XL: 950 },
    description: 'Beige-and-white plaid flannel over a white T-shirt for a cozy, stylish, everyday look.'
  },
  {
    id: 'baggy-denim-streetwear',
    name: 'Baggy Denim Streetwear',
    gender: 'men',
    type: 'bottom',
    image: 'assets/images/products/baggy-denim-streetwear.jpg',
    prices: { S: 1359, M: 1500, L: 1850, XL: 2350 },
    description: 'Faded blue, wide-leg denim jeans with a relaxed fit, perfect for a trendy streetwear look.'
  },
  {
    id: 'lymio-baggy-jeans',
    name: 'Lymio Baggy Jeans for Men',
    gender: 'men',
    type: 'bottom',
    image: null,
    prices: { S: 1300, M: 1550, L: 1850, XL: 2450 },
    description: 'Straight-fit denim jeans with a relaxed, oversized style, perfect for casual streetwear and everyday comfort.'
  },
  {
    id: 'change-status-quo-set',
    name: 'CHANGE Status Quo Shirt & Shorts Set',
    gender: 'men',
    type: 'set',
    image: 'assets/images/products/change-status-quo-set.jpg',
    prices: { S: 549, M: 649, L: 749, XL: 999 },
    description: 'A stylish two-piece casual set featuring a short-sleeve button-up shirt with a black-and-gray color combination and matching gray shorts. The set has a clean, modern design with a “CHANGE status quo” detail, making it suitable for casual outings and everyday wear.'
  },
  {
    id: 'kael-black-coords',
    name: 'Kael Textured Black Coords',
    gender: 'men',
    type: 'set',
    image: 'assets/images/products/kael-textured-black-coords.jpg',
    prices: { S: 900, M: 950, L: 1000, XL: 1500 },
    description: 'A sleek, modern two-piece men’s set in solid black with a subtle vertical ribbed texture. It features a short-sleeve button-down shirt with a classic collar and cuffed sleeves, paired with matching relaxed-fit shorts with an elasticated drawstring waist. Lightweight, comfortable, and effortlessly stylish — great for casual outings, weekend wear, or relaxed smart-casual looks. Plain white inner tee not included.'
  }
];

/* The sizes every product is offered in, in display order. */
WS.SIZES = ['S', 'M', 'L', 'XL'];
