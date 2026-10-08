/* ============================================================
   MIKI TECH STORE — store configuration & product catalog
   ------------------------------------------------------------
   1. Set your WhatsApp number below (digits only, country code,
      no + or leading 0). Example Kenya number: 2547XXXXXXXX
   2. Edit / add products in the PRODUCTS array. Swap "image"
      for a real photo URL (or a path like "assets/products/x.jpg"
      after you add the file to the assets/products folder).
   ============================================================ */

const WHATSAPP_NUMBER = "254791085874"; // <-- REPLACE with your real WhatsApp number

const CURRENCY = "KSh";

const PRODUCTS = [
  // ---------------- SMARTPHONES ----------------
  // Prices remain unset until supplied by the owner.
  {
    id: "phone-redmi-15c", category: "smartphones", brand: "Redmi",
    title: "Redmi 15C", description: "Midnight Black · 256GB storage · 8GB RAM + 8GB extended RAM.",
    price: null, image: "assets/phones/studio/redmi-15c-studio.png"
  },
  {
    id: "phone-tecno-spark30c", category: "smartphones", brand: "Tecno",
    title: "Tecno Spark 30C", description: "4GB RAM · 128GB storage.",
    price: null, image: "assets/phones/studio/tecno-spark30c-studio.png"
  },
  {
    id: "phone-samsung-a07", category: "smartphones", brand: "Samsung",
    title: "Samsung Galaxy A07", description: "4GB RAM · 128GB storage.",
    price: null, image: "assets/phones/studio/samsung-a07-studio.png"
  },

  // ---------------- PROTECTORS ----------------
  // Set compatibleBrands: ["Samsung", "Tecno"] from verified fit data for brand filtering.
  // Unassigned protectors remain visible under All brands.
  {
    id: "pr-01",
    category: "protectors",
    title: "Tempered Glass 9H",
    description: "Ultra-clear scratch resistant screen guard, easy-install kit.",
    price: 499,
    image: "https://placehold.co/600x600/0b1220/4dabff?text=Glass+9H"
  },
  {
    id: "pr-02",
    category: "protectors",
    title: "Privacy Screen Guard",
    description: "Anti-spy tempered glass, blocks side-angle viewing.",
    price: 799,
    image: "https://placehold.co/600x600/0b1220/4dabff?text=Privacy+Guard"
  },
  {
    id: "pr-03",
    category: "protectors",
    title: "Camera Lens Protector",
    description: "Full-lens coverage ring guard, set of 2.",
    price: 349,
    image: "https://placehold.co/600x600/0b1220/4dabff?text=Lens+Guard"
  },
  {
    id: "pr-04",
    category: "protectors",
    title: "Matte Anti-Glare Film",
    description: "Fingerprint resistant, smooth matte finish.",
    price: 599,
    image: "https://placehold.co/600x600/0b1220/4dabff?text=Matte+Film"
  },

  // ---------------- COVERS ----------------
  {
    id: "cv-01",
    category: "covers",
    title: "Shockproof Armor Case",
    description: "Military-grade drop protection with raised bezel.",
    price: 1299,
    image: "https://placehold.co/600x600/0b1220/2f5fff?text=Armor+Case"
  },
  {
    id: "cv-02",
    category: "covers",
    title: "Clear Silicone Cover",
    description: "Slim, transparent, shows off your phone's original look.",
    price: 699,
    image: "https://placehold.co/600x600/0b1220/2f5fff?text=Clear+Cover"
  },
  {
    id: "cv-03",
    category: "covers",
    title: "Leather Wallet Flip Case",
    description: "PU leather flip cover with card slots and stand.",
    price: 1499,
    image: "https://placehold.co/600x600/0b1220/2f5fff?text=Wallet+Case"
  },
  {
    id: "cv-04",
    category: "covers",
    title: "Neon Glow Case",
    description: "Glow-in-the-dark edge design, soft-touch finish.",
    price: 999,
    image: "https://placehold.co/600x600/0b1220/2f5fff?text=Neon+Case"
  },

  // ---------------- EARPHONES / HEADPHONES ----------------
  {
    id: "ep-01",
    category: "earphones",
    title: "Buds Air Pro 2",
    description: "True wireless earbuds, active noise cancellation, 30h case.",
    price: 4999,
    image: "https://placehold.co/600x600/0b1220/7ff0ff?text=Buds+Air+Pro+2"
  },
  {
    id: "ep-02",
    category: "earphones",
    title: "BassLine Wired Earphones",
    description: "In-ear wired earphones with mic, deep bass tuning.",
    price: 799,
    image: "https://placehold.co/600x600/0b1220/7ff0ff?text=BassLine"
  },
  {
    id: "ep-03",
    category: "earphones",
    title: "SoundMax Over-Ear Headphones",
    description: "Bluetooth 5.3, 40h playtime, foldable design.",
    price: 6499,
    image: "https://placehold.co/600x600/0b1220/7ff0ff?text=SoundMax"
  },
  {
    id: "ep-04",
    category: "earphones",
    title: "SportFit Neckband",
    description: "Sweat-resistant magnetic earbuds, 12h battery.",
    price: 1999,
    image: "https://placehold.co/600x600/0b1220/7ff0ff?text=SportFit"
  }
];
