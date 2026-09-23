// Active Menu Categories & Items (Loaded dynamically per restaurant slug)
let MENU_DATA = [];

// Fallback Dataset (Used strictly for offline/unseeded demo when slug is 'royal-food-corner')
const ROYAL_FALLBACK_DATA = [
  {
    "category": "TODAY'S SPECIAL",
    "isFixed": true,
    "items": [
      {
        "name": "Chef Special Butter Chicken",
        "price": "₹340"
      },
      {
        "name": "Royal Paneer Tikka",
        "price": "₹270"
      },
      {
        "name": "Special Mutton Dum Biryani",
        "price": "₹360"
      },
      {
        "name": "Charcoal Smoked Tandoori Pomfret",
        "price": "₹420"
      },
      {
        "name": "Murgh Malai Kasturi Kebab",
        "price": "₹330"
      },
      {
        "name": "Zafrani Shahi Paneer",
        "price": "₹280"
      },
      {
        "name": "Dal Bukhara",
        "price": "₹260"
      },
      {
        "name": "Royal Awadhi Gosht Korma",
        "price": "₹390"
      },
      {
        "name": "Truffle Garlic Naan",
        "price": "₹95"
      },
      {
        "name": "Special Chicken Dum Biryani",
        "price": "₹310"
      },
      {
        "name": "Dahi Ke Kebab",
        "price": "₹240"
      },
      {
        "name": "Bhatti Ka Murgh (Half)",
        "price": "₹320"
      },
      {
        "name": "Paneer Lababdar Special",
        "price": "₹270"
      },
      {
        "name": "Subz Parda Biryani",
        "price": "₹240"
      },
      {
        "name": "Kesar Pista Matka Kulfi",
        "price": "₹120"
      },
      {
        "name": "Shahi Tukda with Rabdi",
        "price": "₹130"
      }
    ]
  },
  {
    "category": "SOUPS & SHORBA",
    "items": [
      {
        "name": "Tomato Dhaniya Shorba",
        "price": "₹140"
      },
      {
        "name": "Hot & Sour Chicken Soup",
        "price": "₹160"
      },
      {
        "name": "Sweet Corn Veg Soup",
        "price": "₹130"
      },
      {
        "name": "Sweet Corn Chicken Soup",
        "price": "₹170"
      },
      {
        "name": "Manchow Veg Soup",
        "price": "₹140"
      },
      {
        "name": "Manchow Chicken Soup",
        "price": "₹175"
      },
      {
        "name": "Lemon Coriander Veg Soup",
        "price": "₹135"
      },
      {
        "name": "Lemon Coriander Chicken Soup",
        "price": "₹165"
      },
      {
        "name": "Murgh Yakhni Shorba",
        "price": "₹190"
      },
      {
        "name": "Mutton Paya Shorba",
        "price": "₹220"
      },
      {
        "name": "Cream of Mushroom Soup",
        "price": "₹150"
      },
      {
        "name": "Cream of Tomato Soup",
        "price": "₹130"
      },
      {
        "name": "Hot & Sour Veg Soup",
        "price": "₹135"
      },
      {
        "name": "Clear Veg Noodle Soup",
        "price": "₹125"
      },
      {
        "name": "Talumein Chicken Soup",
        "price": "₹180"
      },
      {
        "name": "Tom Yum Veg Soup",
        "price": "₹160"
      }
    ]
  },
  {
    "category": "STARTERS & APPETIZERS",
    "items": [
      {
        "name": "Crispy Paneer Tikka",
        "price": "₹260"
      },
      {
        "name": "Galauti Kebab",
        "price": "₹340"
      },
      {
        "name": "Crispy Corn Salt & Pepper",
        "price": "₹180"
      },
      {
        "name": "Chicken 65",
        "price": "₹250"
      },
      {
        "name": "Hara Bhara Kebab",
        "price": "₹210"
      },
      {
        "name": "Dahi Ke Sholey",
        "price": "₹230"
      },
      {
        "name": "Veg Kurkure Spring Rolls",
        "price": "₹170"
      },
      {
        "name": "Chicken Seekh Kebab",
        "price": "₹280"
      },
      {
        "name": "Mutton Kakori Kebab",
        "price": "₹360"
      },
      {
        "name": "Fish Amritsari Tikka",
        "price": "₹340"
      },
      {
        "name": "Chilli Baby Corn",
        "price": "₹190"
      },
      {
        "name": "Honey Chilli Potato",
        "price": "₹170"
      },
      {
        "name": "Chicken Lollipop",
        "price": "₹270"
      },
      {
        "name": "Tandoori Aloo Nazakat",
        "price": "₹220"
      },
      {
        "name": "Kurkure Soya Chaap",
        "price": "₹210"
      },
      {
        "name": "Golden Fried Prawns",
        "price": "₹390"
      },
      {
        "name": "Veg Seekh Kebab",
        "price": "₹220"
      }
    ]
  },
  {
    "category": "TANDOORI SPECIALS",
    "items": [
      {
        "name": "Tandoori Chicken",
        "price": "₹290"
      },
      {
        "name": "Chicken Malai Tikka",
        "price": "₹310"
      },
      {
        "name": "Afghani Soya Chaap",
        "price": "₹240"
      },
      {
        "name": "Paneer Malai Tikka",
        "price": "₹270"
      },
      {
        "name": "Achari Paneer Tikka",
        "price": "₹260"
      },
      {
        "name": "Tangdi Kebab",
        "price": "₹320"
      },
      {
        "name": "Murgh Angara Tikka",
        "price": "₹300"
      },
      {
        "name": "Pahadi Chicken Tikka",
        "price": "₹295"
      },
      {
        "name": "Tandoori Soya Malai Chaap",
        "price": "₹250"
      },
      {
        "name": "Tandoori Bharwan Mushroom",
        "price": "₹260"
      },
      {
        "name": "Fish Tikka Lahori",
        "price": "₹360"
      },
      {
        "name": "Mutton Boti Kebab",
        "price": "₹390"
      },
      {
        "name": "Tandoori Stuffed Paratha Roll",
        "price": "₹180"
      },
      {
        "name": "Kalmi Kebab",
        "price": "₹310"
      },
      {
        "name": "Hariyali Paneer Tikka",
        "price": "₹260"
      },
      {
        "name": "Tandoori Chicken Wings",
        "price": "₹280"
      }
    ]
  },
  {
    "category": "CHINESE & MOMOS",
    "items": [
      {
        "name": "Veg Steamed Momos",
        "price": "₹130"
      },
      {
        "name": "Chicken Kurkure Momos",
        "price": "₹190"
      },
      {
        "name": "Chilli Paneer Dry",
        "price": "₹220"
      },
      {
        "name": "Chilli Chicken Dry",
        "price": "₹260"
      },
      {
        "name": "Veg Fried Momos",
        "price": "₹140"
      },
      {
        "name": "Chicken Steamed Momos",
        "price": "₹160"
      },
      {
        "name": "Paneer Kurkure Momos",
        "price": "₹180"
      },
      {
        "name": "Tandoori Chicken Momos",
        "price": "₹210"
      },
      {
        "name": "Tandoori Veg Momos",
        "price": "₹170"
      },
      {
        "name": "Veg Manchurian Dry",
        "price": "₹190"
      },
      {
        "name": "Dragon Chicken",
        "price": "₹270"
      },
      {
        "name": "Crispy Chilli Garlic Potato",
        "price": "₹160"
      },
      {
        "name": "Chilli Mushroom Dry",
        "price": "₹210"
      },
      {
        "name": "Chicken Spring Rolls",
        "price": "₹220"
      },
      {
        "name": "Schezwan Chilli Paneer",
        "price": "₹230"
      },
      {
        "name": "Drums of Heaven",
        "price": "₹280"
      },
      {
        "name": "Honey Sesame Chicken",
        "price": "₹270"
      }
    ]
  },
  {
    "category": "CRISPY PLATTERS",
    "items": [
      {
        "name": "Royal Veg Kebab Platter",
        "price": "₹420"
      },
      {
        "name": "Non-Veg Tandoori Platter",
        "price": "₹580"
      },
      {
        "name": "Tandoori Soya Chaap Platter",
        "price": "₹360"
      },
      {
        "name": "Seafood Delight Platter",
        "price": "₹650"
      },
      {
        "name": "Paneer Tikka Trio Platter",
        "price": "₹440"
      },
      {
        "name": "Murgh Tikka Degi Platter",
        "price": "₹540"
      },
      {
        "name": "Veg Chinese Starters Platter",
        "price": "₹390"
      },
      {
        "name": "Non-Veg Chinese Platter",
        "price": "₹520"
      },
      {
        "name": "Momos Fiesta Platter",
        "price": "₹350"
      },
      {
        "name": "Royal Assorted Naan Basket",
        "price": "₹220"
      },
      {
        "name": "Tandoori Chicken & Kebab Platter",
        "price": "₹590"
      },
      {
        "name": "Crispy Fried Snack Platter",
        "price": "₹320"
      },
      {
        "name": "Lucknowi Gosht Platter",
        "price": "₹680"
      },
      {
        "name": "Barbeque Wings Platter",
        "price": "₹450"
      },
      {
        "name": "Cheese Corn Bites & Fries",
        "price": "₹290"
      },
      {
        "name": "Grand Royal Feast Platter",
        "price": "₹790"
      }
    ]
  },
  {
    "category": "BIRYANI & PULAO",
    "items": [
      {
        "name": "Hyderabadi Dum Chicken Biryani",
        "price": "₹270"
      },
      {
        "name": "Lucknowi Mutton Biryani",
        "price": "₹360"
      },
      {
        "name": "Paneer Dum Biryani",
        "price": "₹220"
      },
      {
        "name": "Kashmiri Pulao",
        "price": "₹190"
      },
      {
        "name": "Kolkata Chicken Biryani",
        "price": "₹280"
      },
      {
        "name": "Kolkata Mutton Biryani",
        "price": "₹370"
      },
      {
        "name": "Chicken Tikka Biryani",
        "price": "₹295"
      },
      {
        "name": "Handi Mutton Biryani",
        "price": "₹390"
      },
      {
        "name": "Veg Dum Biryani",
        "price": "₹190"
      },
      {
        "name": "Egg Dum Biryani",
        "price": "₹210"
      },
      {
        "name": "Prawns Dum Biryani",
        "price": "₹380"
      },
      {
        "name": "Mushroom Matar Biryani",
        "price": "₹220"
      },
      {
        "name": "Keema Dum Biryani",
        "price": "₹340"
      },
      {
        "name": "Jeera Rice",
        "price": "₹130"
      },
      {
        "name": "Peas Pulao",
        "price": "₹150"
      },
      {
        "name": "Veg Navratan Pulao",
        "price": "₹210"
      },
      {
        "name": "Ghee Steamed Basmati Rice",
        "price": "₹110"
      }
    ]
  },
  {
    "category": "MAIN COURSE",
    "items": [
      {
        "name": "Paneer Butter Masala",
        "price": "₹250"
      },
      {
        "name": "Kadhai Paneer",
        "price": "₹240"
      },
      {
        "name": "Shahi Malai Kofta",
        "price": "₹260"
      },
      {
        "name": "Subz Dum Handi",
        "price": "₹220"
      },
      {
        "name": "Palak Paneer",
        "price": "₹230"
      },
      {
        "name": "Paneer Lababdar",
        "price": "₹260"
      },
      {
        "name": "Matar Paneer",
        "price": "₹220"
      },
      {
        "name": "Paneer Tikka Masala Gravy",
        "price": "₹270"
      },
      {
        "name": "Methi Malai Matar",
        "price": "₹240"
      },
      {
        "name": "Kaju Curry Masala",
        "price": "₹290"
      },
      {
        "name": "Soya Chaap Masala",
        "price": "₹220"
      },
      {
        "name": "Soya Malai Chaap Gravy",
        "price": "₹240"
      },
      {
        "name": "Mushroom Do Pyaza",
        "price": "₹230"
      },
      {
        "name": "Kadhai Mushroom",
        "price": "₹240"
      },
      {
        "name": "Dum Aloo Kashmiri",
        "price": "₹210"
      },
      {
        "name": "Chana Masala Rawalpindi",
        "price": "₹190"
      },
      {
        "name": "Mix Vegetable Korma",
        "price": "₹210"
      },
      {
        "name": "Bhindi Do Pyaza",
        "price": "₹180"
      }
    ]
  },
  {
    "category": "MAIN COURSE",
    "items": [
      {
        "name": "Butter Chicken",
        "price": "₹320"
      },
      {
        "name": "Chicken Tikka Masala",
        "price": "₹290"
      },
      {
        "name": "Mutton Rogan Josh",
        "price": "₹380"
      },
      {
        "name": "Handi Chicken",
        "price": "₹280"
      },
      {
        "name": "Kadhai Chicken",
        "price": "₹270"
      },
      {
        "name": "Chicken Korma Awadhi",
        "price": "₹310"
      },
      {
        "name": "Chicken Rara Punjabi",
        "price": "₹330"
      },
      {
        "name": "Chicken Curry Home Style",
        "price": "₹260"
      },
      {
        "name": "Murgh Lababdar",
        "price": "₹310"
      },
      {
        "name": "Chicken Saagwala",
        "price": "₹290"
      },
      {
        "name": "Bhuna Mutton Masala",
        "price": "₹390"
      },
      {
        "name": "Mutton Korma Shahi",
        "price": "₹410"
      },
      {
        "name": "Mutton Rara Gosht",
        "price": "₹420"
      },
      {
        "name": "Fish Curry Bengali Style",
        "price": "₹320"
      },
      {
        "name": "Fish Tikka Masala",
        "price": "₹350"
      },
      {
        "name": "Prawns Masala Gravy",
        "price": "₹390"
      },
      {
        "name": "Egg Curry Masala",
        "price": "₹180"
      },
      {
        "name": "Keema Matar Gravy",
        "price": "₹340"
      }
    ]
  },
  {
    "category": "DAL & LENTILS",
    "items": [
      {
        "name": "Dal Makhani",
        "price": "₹210"
      },
      {
        "name": "Dal Tadka Double Roti",
        "price": "₹160"
      },
      {
        "name": "Dal Fry",
        "price": "₹140"
      },
      {
        "name": "Dal Panchmel",
        "price": "₹190"
      },
      {
        "name": "Yellow Dal Palak",
        "price": "₹170"
      },
      {
        "name": "Dhaba Style Dal Tadka",
        "price": "₹175"
      },
      {
        "name": "Dal Bukhara Special",
        "price": "₹250"
      },
      {
        "name": "Chana Dal Tadka",
        "price": "₹150"
      },
      {
        "name": "Moong Dal Mughlai",
        "price": "₹165"
      },
      {
        "name": "Gujarati Sweet & Sour Dal",
        "price": "₹160"
      },
      {
        "name": "Sambar South Special",
        "price": "₹120"
      },
      {
        "name": "Maa Ki Dal Homestyle",
        "price": "₹180"
      },
      {
        "name": "Dal Maharani",
        "price": "₹220"
      },
      {
        "name": "Garlic Jeera Dal",
        "price": "₹155"
      },
      {
        "name": "Tomato Dal Tadka",
        "price": "₹150"
      },
      {
        "name": "Urad Dal Fry",
        "price": "₹165"
      }
    ]
  },
  {
    "category": "TANDOORI ROTI & NAAN",
    "items": [
      {
        "name": "Butter Naan",
        "price": "₹55"
      },
      {
        "name": "Garlic Naan",
        "price": "₹70"
      },
      {
        "name": "Tandoori Roti Butter",
        "price": "₹30"
      },
      {
        "name": "Laccha Paratha",
        "price": "₹60"
      },
      {
        "name": "Plain Naan",
        "price": "₹45"
      },
      {
        "name": "Cheese Garlic Naan",
        "price": "₹95"
      },
      {
        "name": "Chilli Garlic Naan",
        "price": "₹75"
      },
      {
        "name": "Kashmiri Sweet Naan",
        "price": "₹90"
      },
      {
        "name": "Pudina Paratha",
        "price": "₹65"
      },
      {
        "name": "Tandoori Roti Plain",
        "price": "₹25"
      },
      {
        "name": "Missi Roti",
        "price": "₹45"
      },
      {
        "name": "Onion Kulcha",
        "price": "₹70"
      },
      {
        "name": "Paneer Kulcha",
        "price": "₹85"
      },
      {
        "name": "Aloo Stuffed Kulcha",
        "price": "₹65"
      },
      {
        "name": "Roomali Roti",
        "price": "₹35"
      },
      {
        "name": "Butter Roomali Roti",
        "price": "₹45"
      }
    ]
  },
  {
    "category": "NOODLES & FRIED RICE",
    "items": [
      {
        "name": "Veg Hakka Noodles",
        "price": "₹170"
      },
      {
        "name": "Schezwan Chicken Noodles",
        "price": "₹210"
      },
      {
        "name": "Veg Fried Rice",
        "price": "₹160"
      },
      {
        "name": "Chicken Fried Rice",
        "price": "₹200"
      },
      {
        "name": "Chilli Garlic Veg Noodles",
        "price": "₹180"
      },
      {
        "name": "Chilli Garlic Chicken Noodles",
        "price": "₹210"
      },
      {
        "name": "Schezwan Veg Noodles",
        "price": "₹180"
      },
      {
        "name": "Egg Hakka Noodles",
        "price": "₹190"
      },
      {
        "name": "Egg Fried Rice",
        "price": "₹180"
      },
      {
        "name": "Schezwan Chicken Fried Rice",
        "price": "₹220"
      },
      {
        "name": "Schezwan Veg Fried Rice",
        "price": "₹175"
      },
      {
        "name": "Singapore Veg Noodles",
        "price": "₹185"
      },
      {
        "name": "Singapore Chicken Noodles",
        "price": "₹225"
      },
      {
        "name": "Burnt Garlic Veg Fried Rice",
        "price": "₹170"
      },
      {
        "name": "Burnt Garlic Chicken Fried Rice",
        "price": "₹210"
      },
      {
        "name": "Mixed Non-Veg Fried Rice",
        "price": "₹260"
      }
    ]
  },
  {
    "category": "SOUTH INDIAN CLASSICS",
    "items": [
      {
        "name": "Masala Dosa",
        "price": "₹120"
      },
      {
        "name": "Mysore Masala Dosa",
        "price": "₹140"
      },
      {
        "name": "Ghee Roast Paper Dosa",
        "price": "₹160"
      },
      {
        "name": "Medu Vada (2pc)",
        "price": "₹80"
      },
      {
        "name": "Plain Dosa",
        "price": "₹90"
      },
      {
        "name": "Onion Rava Masala Dosa",
        "price": "₹150"
      },
      {
        "name": "Paneer Masala Dosa",
        "price": "₹160"
      },
      {
        "name": "Cheese Burst Dosa",
        "price": "₹175"
      },
      {
        "name": "Gunpowder Podi Dosa",
        "price": "₹130"
      },
      {
        "name": "Steamed Idli (2pc) with Sambar",
        "price": "₹70"
      },
      {
        "name": "Ghee Podi Idli",
        "price": "₹110"
      },
      {
        "name": "Onion Tomato Uttapam",
        "price": "₹120"
      },
      {
        "name": "Mixed Vegetable Uttapam",
        "price": "₹130"
      },
      {
        "name": "Paneer Cheese Uttapam",
        "price": "₹150"
      },
      {
        "name": "Sambar Vada (2pc)",
        "price": "₹90"
      },
      {
        "name": "Curd Rice with Tadka",
        "price": "₹120"
      }
    ]
  },
  {
    "category": "ROLLS & WRAPS",
    "items": [
      {
        "name": "Paneer Tikka Roll",
        "price": "₹150"
      },
      {
        "name": "Double Egg Chicken Roll",
        "price": "₹190"
      },
      {
        "name": "Mutton Seekh Roll",
        "price": "₹220"
      },
      {
        "name": "Veg Kathi Roll",
        "price": "₹120"
      },
      {
        "name": "Soya Chaap Tikka Roll",
        "price": "₹140"
      },
      {
        "name": "Achari Paneer Roll",
        "price": "₹160"
      },
      {
        "name": "Malai Chaap Roll",
        "price": "₹150"
      },
      {
        "name": "Single Egg Single Chicken Roll",
        "price": "₹160"
      },
      {
        "name": "Chicken Malai Tikka Roll",
        "price": "₹200"
      },
      {
        "name": "Chilli Chicken Kathi Roll",
        "price": "₹180"
      },
      {
        "name": "Chicken Seekh Kebab Roll",
        "price": "₹195"
      },
      {
        "name": "Double Chicken Double Egg Roll",
        "price": "₹230"
      },
      {
        "name": "Mutton Boti Kebab Roll",
        "price": "₹250"
      },
      {
        "name": "Crispy Corn & Cheese Roll",
        "price": "₹140"
      },
      {
        "name": "Mushroom Tikka Roll",
        "price": "₹150"
      },
      {
        "name": "Schezwan Veg Roll",
        "price": "₹130"
      }
    ]
  },
  {
    "category": "BEVERAGES & SHAKES",
    "items": [
      {
        "name": "Mango Lassi",
        "price": "₹90"
      },
      {
        "name": "Fresh Lime Soda",
        "price": "₹60"
      },
      {
        "name": "Cold Coffee with Ice Cream",
        "price": "₹120"
      },
      {
        "name": "Masala Chaas",
        "price": "₹50"
      },
      {
        "name": "Sweet Lassi Special",
        "price": "₹75"
      },
      {
        "name": "Salted Mint Lassi",
        "price": "₹75"
      },
      {
        "name": "Chocolate Thick Shake",
        "price": "₹130"
      },
      {
        "name": "Oreo Crunch Milkshake",
        "price": "₹140"
      },
      {
        "name": "Strawberry Milkshake",
        "price": "₹120"
      },
      {
        "name": "Vanilla Thick Shake",
        "price": "₹110"
      },
      {
        "name": "Virgin Mojito Mint",
        "price": "₹110"
      },
      {
        "name": "Blue Lagoon Mocktail",
        "price": "₹120"
      },
      {
        "name": "Watermelon Mint Cooler",
        "price": "₹110"
      },
      {
        "name": "Masala Lemonade",
        "price": "₹65"
      },
      {
        "name": "Masala Chai",
        "price": "₹40"
      },
      {
        "name": "Filter Coffee",
        "price": "₹50"
      },
      {
        "name": "Iced Lemon Tea",
        "price": "₹80"
      }
    ]
  },
  {
    "category": "DESSERTS & SWEETS",
    "items": [
      {
        "name": "Gulab Jamun (2pc)",
        "price": "₹80"
      },
      {
        "name": "Kesar Rasmalai (2pc)",
        "price": "₹110"
      },
      {
        "name": "Gajar Ka Halwa",
        "price": "₹100"
      },
      {
        "name": "Warm Brownie with Ice Cream",
        "price": "₹150"
      },
      {
        "name": "Matka Kulfi Pista",
        "price": "₹90"
      },
      {
        "name": "Rabdi Jalebi",
        "price": "₹120"
      },
      {
        "name": "Shahi Tukda Awadhi",
        "price": "₹110"
      },
      {
        "name": "Moong Dal Halwa",
        "price": "₹120"
      },
      {
        "name": "Rasgulla (2pc)",
        "price": "₹70"
      },
      {
        "name": "Angoori Gulab Jamun with Rabdi",
        "price": "₹130"
      },
      {
        "name": "Kesar Phirni",
        "price": "₹95"
      },
      {
        "name": "Vanilla Ice Cream Scoop",
        "price": "₹60"
      },
      {
        "name": "Chocolate Fudge Sundae",
        "price": "₹140"
      },
      {
        "name": "Butterscotch Ice Cream Scoop",
        "price": "₹70"
      },
      {
        "name": "Rajbhog (2pc)",
        "price": "₹90"
      },
      {
        "name": "Sizzling Chocolate Brownie",
        "price": "₹170"
      }
    ]
  }
];

let activeCategoryIndex = 0;
const selectedDishes = new Set(); // Stores selected dish names

// Elements
let categoryHeading = document.getElementById("categoryHeading");
let menuScrollBox = document.getElementById("menuScrollBox");
let menuCardContainer = document.querySelector(".menu-card-container");
const mainContentStage = document.getElementById("mainContent") || document.querySelector(".main-content");
const browseBtn = document.getElementById("browseBtn");
const modalBackdrop = document.getElementById("modalBackdrop");
const categorySheet = document.getElementById("categorySheet");
const closeSheetBtn = document.getElementById("closeSheetBtn");
const categorySheetList = document.getElementById("categorySheetList");

// Platter Elements
const platterBtn = document.getElementById("platterBtn");
const platterCount = document.getElementById("platterCount");
const platterBackdrop = document.getElementById("platterBackdrop");
const platterSheet = document.getElementById("platterSheet");
const closePlatterBtn = document.getElementById("closePlatterBtn");
const platterList = document.getElementById("platterList");
const platterDialogCount = document.getElementById("platterDialogCount");
const platterFooter = document.getElementById("platterFooter");
const clearPlatterBtn = document.getElementById("clearPlatterBtn");

// Helper to identify Today's Special category
function isTodaySpecialCategory(cat) {
  if (!cat) return false;
  const name = (typeof cat === "string" ? cat : (cat.category || "")).toUpperCase().trim();
  const isFixed = typeof cat === "object" && cat.isFixed === true;
  return isFixed || name === "TODAY'S SPECIAL" || name.includes("TODAY'S SPECIAL");
}

// Set Category Title size: reduced size and single-line fit inside the fixed-height outline box
function updateCategoryTitle(title, isSpecial = false, targetHeading = null) {
  const heading = targetHeading || categoryHeading || document.getElementById("categoryHeading");
  if (!heading) return;

  if (isSpecial) {
    heading.classList.add("is-today-special");
    heading.innerHTML = `
      <svg class="cat-star-icon" viewBox="0 0 24 24" width="17" height="17" fill="#f59e0b" stroke="#d97706" stroke-width="0.8" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <span class="cat-heading-text">${title}</span>
    `;
  } else {
    heading.classList.remove("is-today-special");
    heading.innerHTML = `<span class="cat-heading-text">${title}</span>`;
  }

  const panel = heading.parentElement;
  const maxAllowedWidth = panel && panel.clientWidth > 0 ? (panel.clientWidth * 0.94) : (window.innerWidth * 0.94);

  let size = 1.32;
  heading.style.letterSpacing = title.length > 12 ? "0.8px" : "1.4px";
  heading.style.fontSize = `${size}rem`;

  while (heading.offsetWidth > maxAllowedWidth && size > 0.85) {
    size -= 0.02;
    heading.style.fontSize = `${size.toFixed(2)}rem`;
  }
}

// =========================================================================
// Category Block Architecture & Sliding Transition
// =========================================================================
let isTransitioningCategory = false;

function populateCategoryBlock(block, index) {
  const currentCategory = MENU_DATA[index];
  if (!currentCategory) return;
  const title = currentCategory.category;
  const isSpecial = isTodaySpecialCategory(currentCategory);

  const heading = block.querySelector(".category-heading");
  if (heading) {
    updateCategoryTitle(title, isSpecial, heading);
  }

  const scrollBox = block.querySelector(".menu-scroll-box");
  const container = block.querySelector(".menu-card-container");
  if (!scrollBox) return;

  scrollBox.innerHTML = "";

  if (!currentCategory.items || currentCategory.items.length === 0) {
    const emptyNotice = document.createElement("div");
    emptyNotice.className = "empty-menu-notice";
    emptyNotice.textContent = "Today's specials will be updated shortly. Check back soon!";
    scrollBox.appendChild(emptyNotice);
  } else {
    currentCategory.items.forEach(dish => {
      const row = document.createElement("div");
      row.className = `menu-row ${selectedDishes.has(dish.name) ? 'selected' : ''}`;
      row.dataset.dish = dish.name;

      const formattedName = dish.name.replace(/(\([^)]+\))/g, '<span class="dish-note">$1</span>');
      const formattedPrice = dish.price.replace(/(₹|Rs\.?)\s*/g, '').trim();

      row.innerHTML = `
        <span class="row-selector" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" class="check-icon">
            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="dish-name">${formattedName}</span>
        <span class="dot-leader"></span>
        <span class="dish-price">${formattedPrice}</span>
      `;

      row.addEventListener("click", () => {
        if (selectedDishes.has(dish.name)) {
          selectedDishes.delete(dish.name);
          row.classList.remove("selected");
        } else {
          selectedDishes.add(dish.name);
          row.classList.add("selected");
        }
        updatePlatterCountBadge();
        if (platterSheet.classList.contains("active")) {
          renderPlatterList();
        }
      });

      scrollBox.appendChild(row);
    });
  }

  scrollBox.scrollTop = 0;
  if (container) {
    container.classList.remove("has-scrolled");
  }
}

// =========================================================================
// Category Block Scroll Box Listeners & Boundary Bounce Effects
// =========================================================================
function triggerScrollBounce(scrollBox, direction) {
  if (!scrollBox) return;
  if (scrollBox.classList.contains("bounce-bottom") || scrollBox.classList.contains("bounce-top")) return;
  
  const cls = direction === "bottom" ? "bounce-bottom" : "bounce-top";
  scrollBox.classList.remove("bounce-bottom", "bounce-top");
  void scrollBox.offsetWidth; // Force reflow
  scrollBox.classList.add(cls);
  
  setTimeout(() => {
    scrollBox.classList.remove(cls);
  }, 530);
}

function setupScrollBoxListeners(scrollBox, container) {
  if (!scrollBox) return;
  
  let hasBouncedBottom = false;
  let hasBouncedTop = true; // initially starts at top
  
  scrollBox.addEventListener("scroll", () => {
    const maxScroll = scrollBox.scrollHeight - scrollBox.clientHeight;
    const currentScrollTop = scrollBox.scrollTop;
    const scrollBottom = maxScroll - currentScrollTop;

    if (container) {
      if (currentScrollTop > 8) {
        container.classList.add("has-scrolled");
      } else {
        container.classList.remove("has-scrolled");
      }
    }

    // Bounce detection for lists with scrollable content
    if (maxScroll > 15) {
      // Re-arm bounce flags when user scrolls away from boundary
      if (scrollBottom > 35) {
        hasBouncedBottom = false;
      }
      if (currentScrollTop > 35) {
        hasBouncedTop = false;
      }

      // FIRST SCROLL: Trigger bounce when reaching the bottom of the list!
      if (scrollBottom <= 3 && !hasBouncedBottom && !isTransitioningCategory) {
        hasBouncedBottom = true;
        triggerScrollBounce(scrollBox, "bottom");
      }

      // FIRST SCROLL: Trigger bounce when reaching the top of the list!
      if (currentScrollTop <= 3 && !hasBouncedTop && !isTransitioningCategory) {
        hasBouncedTop = true;
        triggerScrollBounce(scrollBox, "top");
      }
    }
  }, { passive: true });
}

function createCategoryBlock(index) {
  const block = document.createElement("div");
  block.className = "category-block";
  block.innerHTML = `
    <div class="category-panel">
      <h2 class="category-heading" title="Click to browse categories" role="button" tabindex="0">
        <span class="cat-heading-text"></span>
      </h2>
    </div>
    <div class="menu-card-container">
      <div class="menu-scroll-box" role="list"></div>
    </div>
  `;

  const scrollBox = block.querySelector(".menu-scroll-box");
  const container = block.querySelector(".menu-card-container");

  if (scrollBox && container) {
    setupScrollBoxListeners(scrollBox, container);
  }

  populateCategoryBlock(block, index);
  return block;
}

function renderMenuItems(index) {
  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  let block = stage ? stage.querySelector(".category-block") : null;
  if (!block && stage) {
    block = createCategoryBlock(index);
    stage.appendChild(block);
  } else if (block) {
    populateCategoryBlock(block, index);
  }

  if (block) {
    categoryHeading = block.querySelector(".category-heading");
    menuScrollBox = block.querySelector(".menu-scroll-box");
    menuCardContainer = block.querySelector(".menu-card-container");
  }
}

function goToNextCategory() {
  if (isTransitioningCategory || !MENU_DATA || MENU_DATA.length === 0) return;
  // Non-looping: stop at the last category (cannot loop to Today's Special)
  if (activeCategoryIndex >= MENU_DATA.length - 1) {
    const activeBox = document.querySelector(".category-block .menu-scroll-box") || menuScrollBox;
    triggerScrollBounce(activeBox, "bottom");
    return;
  }
  const nextIdx = activeCategoryIndex + 1;
  switchCategorySmoothly(nextIdx, 'next');
}

function goToPrevCategory() {
  if (isTransitioningCategory || !MENU_DATA || MENU_DATA.length === 0) return;
  // Non-looping: stop at the first category (cannot loop to Desserts)
  if (activeCategoryIndex <= 0) {
    const activeBox = document.querySelector(".category-block .menu-scroll-box") || menuScrollBox;
    triggerScrollBounce(activeBox, "top");
    return;
  }
  const prevIdx = activeCategoryIndex - 1;
  switchCategorySmoothly(prevIdx, 'prev');
}

function switchCategorySmoothly(newIndex, direction = 'next') {
  if (isTransitioningCategory) return;
  if (!MENU_DATA || MENU_DATA.length === 0) return;
  if (newIndex < 0 || newIndex >= MENU_DATA.length) return;
  if (newIndex === activeCategoryIndex) return;

  isTransitioningCategory = true;
  activeCategoryIndex = newIndex;
  updateActiveSheetItem();
  updateActiveCategoryDot();

  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (!stage) {
    isTransitioningCategory = false;
    return;
  }

  const currentBlock = stage.querySelector(".category-block");
  const nextBlock = createCategoryBlock(newIndex);

  // Physical Slide Transitions:
  // 'next': Next block is hidden below (translateY 100%) and slides UP into view; current block slides UP to -100%
  // 'prev': Next block is hidden above (translateY -100%) and slides DOWN into view; current block slides DOWN to +100%
  const startY = direction === 'prev' ? '-100%' : '100%';
  const exitY = direction === 'prev' ? '100%' : '-100%';

  nextBlock.style.transform = `translateY(${startY})`;
  nextBlock.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
  stage.appendChild(nextBlock);

  // Force reflow so initial translation registers before animating
  void nextBlock.offsetWidth;

  if (currentBlock) {
    currentBlock.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
    currentBlock.style.transform = `translateY(${exitY})`;
  }
  nextBlock.style.transform = 'translateY(0)';

  setTimeout(() => {
    if (currentBlock && currentBlock.parentNode) {
      currentBlock.remove();
    }
    categoryHeading = nextBlock.querySelector(".category-heading");
    menuScrollBox = nextBlock.querySelector(".menu-scroll-box");
    menuCardContainer = nextBlock.querySelector(".menu-card-container");
    atBottomSince = 0;
    atTopSince = 0;
    hasBouncedAtBottom = false;
    hasBouncedAtTop = true;
    wasAtBottomAtTouchStart = false;
    wasAtTopAtTouchStart = false;
    isTransitioningCategory = false;
  }, 780);
}

// Update Platter Count Digit inside the Platter Icon
function updatePlatterCountBadge() {
  const count = selectedDishes.size;
  platterCount.textContent = count;

  // Pop bounce animation on counter digit
  platterBtn.classList.remove("bounce");
  void platterBtn.offsetWidth; // Force reflow
  platterBtn.classList.add("bounce");
  setTimeout(() => {
    platterBtn.classList.remove("bounce");
  }, 240);
}

// Render Platter Review Dialog (Selected dish names ONLY, strictly no prices)
function renderPlatterList() {
  const count = selectedDishes.size;
  platterDialogCount.textContent = count;
  platterList.innerHTML = "";

  if (count === 0) {
    platterList.innerHTML = `
      <div class="platter-empty">
        <img src="/assets/platter.png" alt="" class="platter-empty-icon">
        <p style="font-weight: 600; color: #444;">Your platter is empty</p>
        <p style="font-size: 0.85rem; color: #888; margin-top: 4px;">Tap any dish in the menu to add it to your platter.</p>
      </div>
    `;
    if (platterFooter) platterFooter.style.display = "none";
    clearPlatterBtn.style.display = "none";
    return;
  }

  if (platterFooter) platterFooter.style.display = "flex";
  clearPlatterBtn.style.display = "block";

  selectedDishes.forEach(dishName => {
    const item = document.createElement("div");
    item.className = "platter-item";

    // Show selected dish name only (not the price)
    item.innerHTML = `
      <span class="platter-item-name">${dishName}</span>
      <button class="platter-item-remove" aria-label="Remove ${dishName}">&times;</button>
    `;

    // Remove button handler
    const removeBtn = item.querySelector(".platter-item-remove");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedDishes.delete(dishName);
      updatePlatterCountBadge();
      renderPlatterList();

      // Deselect corresponding row if currently displayed in active category
      const targetRow = menuScrollBox.querySelector(`[data-dish="${dishName}"]`);
      if (targetRow) {
        targetRow.classList.remove("selected");
      }
    });

    platterList.appendChild(item);
  });
}

// Platter Dialog Controls
function openPlatter() {
  renderPlatterList();
  platterSheet.classList.add("active");
  platterBackdrop.classList.add("active");
}

function closePlatter() {
  platterSheet.classList.remove("active");
  platterBackdrop.classList.remove("active");
}

// Clear all items from platter
clearPlatterBtn.addEventListener("click", () => {
  selectedDishes.clear();
  updatePlatterCountBadge();
  renderPlatterList();
  const selectedRows = menuScrollBox.querySelectorAll(".menu-row.selected");
  selectedRows.forEach(row => row.classList.remove("selected"));
});

// Platter Event Listeners
platterBtn.addEventListener("click", openPlatter);
closePlatterBtn.addEventListener("click", closePlatter);
platterBackdrop.addEventListener("click", closePlatter);

// Setup pure Y-axis bounce, touch overdrag, and wheel effects for bottom dialog sheets
function setupSheetScrollAndBounce(sheetListEl) {
  if (!sheetListEl || sheetListEl.dataset.bounceInitialized === "true") return;
  sheetListEl.dataset.bounceInitialized = "true";

  setupScrollBoxListeners(sheetListEl, sheetListEl);

  let startY = 0;
  let dragBottomY = null;
  let dragTopY = null;

  sheetListEl.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    dragBottomY = null;
    dragTopY = null;
  }, { passive: true });

  sheetListEl.addEventListener("touchmove", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    const scrollTop = sheetListEl.scrollTop;
    const maxScroll = Math.max(0, sheetListEl.scrollHeight - sheetListEl.clientHeight);

    if (maxScroll > 6) {
      // Direct tactile drag pull up at bottom
      if (deltaY < 0 && scrollTop >= maxScroll - 1) {
        if (dragBottomY === null) dragBottomY = currentY;
        const overDrag = dragBottomY - currentY;
        if (overDrag > 0) {
          const pull = Math.min(22, Math.pow(overDrag, 0.7) * 1.3);
          sheetListEl.style.transform = `translateY(-${pull}px)`;
        }
        return;
      } else {
        dragBottomY = null;
      }

      // Direct tactile drag pull down at top
      if (deltaY > 0 && scrollTop <= 1) {
        if (dragTopY === null) dragTopY = currentY;
        const overDragDown = currentY - dragTopY;
        if (overDragDown > 0) {
          const pullDown = Math.min(22, Math.pow(overDragDown, 0.7) * 1.3);
          sheetListEl.style.transform = `translateY(${pullDown}px)`;
        }
        return;
      } else {
        dragTopY = null;
      }
    }
  }, { passive: true });

  sheetListEl.addEventListener("touchend", () => {
    if (sheetListEl.style.transform && sheetListEl.style.transform !== "none" && sheetListEl.style.transform !== "translateY(0px)") {
      sheetListEl.style.transition = "transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)";
      sheetListEl.style.transform = "translateY(0px)";
      setTimeout(() => {
        sheetListEl.style.transition = "";
        sheetListEl.style.transform = "";
      }, 500);
    }
  }, { passive: true });

  sheetListEl.addEventListener("wheel", (e) => {
    const maxScroll = sheetListEl.scrollHeight - sheetListEl.clientHeight;
    const scrollBottom = maxScroll - sheetListEl.scrollTop;
    const scrollTop = sheetListEl.scrollTop;

    if (maxScroll <= 6) return;

    if (e.deltaY > 20 && scrollBottom <= 3) {
      triggerScrollBounce(sheetListEl, "bottom");
    } else if (e.deltaY < -20 && scrollTop <= 3) {
      triggerScrollBounce(sheetListEl, "top");
    }
  }, { passive: true });
}

// Build Category Sheet List
function setupCategorySheet() {
  setupSheetScrollAndBounce(categorySheetList);
  categorySheetList.innerHTML = "";
  MENU_DATA.forEach((cat, idx) => {
    const isSpecial = isTodaySpecialCategory(cat);
    const item = document.createElement("div");
    item.className = `sheet-item ${idx === activeCategoryIndex ? 'active' : ''} ${isSpecial ? 'today-special-sheet-item' : ''}`;
    item.innerHTML = `
      <span>${isSpecial ? '⭐ ' : ''}${cat.category}</span>
      <span style="font-size:0.8rem; color:#888;">${cat.items.length} items</span>
    `;
    item.addEventListener("click", () => {
      if (activeCategoryIndex === idx) {
        closeSheet();
        return;
      }
      closeSheet();
      const dir = idx >= activeCategoryIndex ? 'next' : 'prev';
      switchCategorySmoothly(idx, dir);
    });
    categorySheetList.appendChild(item);
  });
}

function updateActiveSheetItem() {
  const items = categorySheetList.querySelectorAll(".sheet-item");
  items.forEach((item, idx) => {
    item.classList.toggle("active", idx === activeCategoryIndex);
  });
}

// Render vertical dot page scroll points on right side of prices
function renderCategoryPageDots() {
  let dotsContainer = document.getElementById("categoryPageDots");
  if (!dotsContainer) {
    const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
    if (!stage) return;
    dotsContainer = document.createElement("nav");
    dotsContainer.className = "category-page-dots";
    dotsContainer.id = "categoryPageDots";
    dotsContainer.setAttribute("aria-label", "Category Navigation Dots");
    stage.appendChild(dotsContainer);
  }

  dotsContainer.innerHTML = "";
  if (!MENU_DATA || MENU_DATA.length <= 1) {
    dotsContainer.style.display = "none";
    return;
  }
  dotsContainer.style.display = "flex";

  MENU_DATA.forEach((cat, idx) => {
    const dot = document.createElement("button");
    dot.className = `category-dot ${idx === activeCategoryIndex ? 'active' : ''}`;
    dot.dataset.index = idx;
    dot.setAttribute("aria-label", `Category ${idx + 1}: ${cat.category}`);
    dot.title = `${idx + 1}. ${cat.category}`;

    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      if (idx === activeCategoryIndex || isTransitioningCategory) return;
      const dir = idx > activeCategoryIndex ? 'next' : 'prev';
      switchCategorySmoothly(idx, dir);
    });

    dotsContainer.appendChild(dot);
  });
}

function updateActiveCategoryDot() {
  const dots = document.querySelectorAll(".category-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === activeCategoryIndex);
  });
}

// Open / Close Category Modal
function openSheet() {
  categorySheet.classList.add("active");
  modalBackdrop.classList.add("active");
  if (categorySheetList && categorySheetList.scrollTop <= 8) {
    categorySheetList.classList.remove("has-scrolled");
  }
}

function closeSheet() {
  categorySheet.classList.remove("active");
  modalBackdrop.classList.remove("active");
}

// Category Sheet Event Listeners
browseBtn.addEventListener("click", openSheet);
closeSheetBtn.addEventListener("click", closeSheet);
modalBackdrop.addEventListener("click", closeSheet);

// Category Heading Click to open categories (delegated across current & dynamically swapped blocks)
if (mainContentStage) {
  mainContentStage.addEventListener("click", (e) => {
    if (e.target.closest(".category-heading")) {
      openSheet();
    }
  });
}

// Detect Restaurant Slug from URL Path (/r/:slug) or Query Parameter (?r=:slug or ?restaurant=:slug)
function getRestaurantSlug() {
  const path = window.location.pathname;
  if (path.startsWith("/r/")) {
    const parts = path.split("/r/")[1].split("/").filter(Boolean);
    if (parts.length > 0) return parts[0];
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("restaurant") || params.get("r") || "royal-food-corner";
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateRestaurantBranding(restaurant) {
  const brandTitle = document.querySelector(".brand-title") || document.getElementById("brandTitle");
  if (brandTitle && restaurant && restaurant.name) {
    const words = restaurant.name.trim().split(/\s+/);
    if (words.length >= 3) {
      brandTitle.innerHTML = `${escapeHtml(words[0])} <span class="brand-accent">${escapeHtml(words[1])}</span> ${escapeHtml(words.slice(2).join(" "))}`;
    } else if (words.length === 2) {
      brandTitle.innerHTML = `${escapeHtml(words[0])} <span class="brand-accent">${escapeHtml(words[1])}</span>`;
    } else {
      brandTitle.textContent = restaurant.name;
    }
    document.title = `${restaurant.name} - Menu`;
  }

  if (restaurant && restaurant.branding && restaurant.branding.accentColor) {
    const stickyHeader = document.querySelector(".sticky-header");
    if (stickyHeader) {
      stickyHeader.style.backgroundColor = restaurant.branding.accentColor;
    }
  }
}

function handleMenuLoadError(slug, status, errorMsg) {
  const brandTitle = document.querySelector(".brand-title") || document.getElementById("brandTitle");
  const heading = document.getElementById("categoryHeading");
  const scrollBox = document.getElementById("menuScrollBox");
  const dots = document.getElementById("categoryPageDots");
  const browseBtn = document.getElementById("browseBtn");

  const readableName = slug && slug !== "royal-food-corner"
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Restaurant";

  if (brandTitle) {
    brandTitle.textContent = status === 404 ? "Menu Not Found" : readableName;
  }
  document.title = status === 404 ? "Menu Not Found" : `${readableName} - Menu`;

  if (heading) {
    heading.classList.remove("is-today-special");
    heading.innerHTML = `<span class="cat-heading-text" style="color: #64748b;">${status === 403 ? "COMING SOON" : "MENU"}</span>`;
    heading.style.pointerEvents = "none";
  }

  if (scrollBox) {
    scrollBox.innerHTML = `
      <div class="empty-menu-notice" style="padding: 48px 16px; text-align: center;">
        <svg style="margin: 0 auto 12px; display: block; opacity: 0.5;" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#78716c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p style="font-size: 0.95rem; font-weight: 600; color: #44403c; margin-bottom: 6px;">${escapeHtml(errorMsg)}</p>
        <p style="font-size: 0.82rem; color: #78716c;">Please check back again later.</p>
      </div>
    `;
  }

  if (dots) dots.innerHTML = "";
  if (browseBtn) browseBtn.style.display = "none";
}

function renderEmptyMenuState(message) {
  const heading = document.getElementById("categoryHeading");
  const scrollBox = document.getElementById("menuScrollBox");
  const dots = document.getElementById("categoryPageDots");
  const browseBtn = document.getElementById("browseBtn");

  if (heading) {
    heading.classList.remove("is-today-special");
    heading.innerHTML = `<span class="cat-heading-text">MENU</span>`;
  }

  if (scrollBox) {
    scrollBox.innerHTML = `
      <div class="empty-menu-notice" style="padding: 48px 16px; text-align: center;">
        <p style="font-size: 0.95rem; color: #78716c;">${escapeHtml(message)}</p>
      </div>
    `;
  }

  if (dots) dots.innerHTML = "";
  if (browseBtn) browseBtn.style.display = "none";
}

// Fetch dynamic menu from the read-only public API (/api/public/menu?slug=:slug)
async function loadDynamicMenu() {
  const slug = getRestaurantSlug();
  const browseBtn = document.getElementById("browseBtn");

  try {
    const response = await fetch(`/api/public/menu?slug=${encodeURIComponent(slug)}`);
    const data = await response.json().catch(() => null);

    if (!response.ok || !data || !data.success) {
      const errorMsg = (data && data.error)
        ? data.error
        : (response && response.status === 404 ? "This restaurant menu could not be found." : "This menu is currently unavailable.");
      handleMenuLoadError(slug, response ? response.status : 0, errorMsg);
      return;
    }

    // Update restaurant brand title & accent styling
    if (data.restaurant) {
      updateRestaurantBranding(data.restaurant);
    }

    // Update menu categories
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      MENU_DATA = data.categories;
      activeCategoryIndex = 0;
      renderMenuItems(activeCategoryIndex);
      setupCategorySheet();
      renderCategoryPageDots();
      if (browseBtn) {
        browseBtn.style.display = MENU_DATA.length > 1 ? "" : "none";
      }
    } else {
      MENU_DATA = [];
      renderEmptyMenuState("No items have been added to this menu yet. Please check back soon!");
    }
  } catch (err) {
    console.info("ℹ️ Error loading dynamic menu:", err.message);
    if (slug === "royal-food-corner" && typeof ROYAL_FALLBACK_DATA !== "undefined") {
      MENU_DATA = ROYAL_FALLBACK_DATA;
      updateRestaurantBranding({ name: "Royal Food Corner" });
      activeCategoryIndex = 0;
      renderMenuItems(activeCategoryIndex);
      setupCategorySheet();
      renderCategoryPageDots();
      if (browseBtn) browseBtn.style.display = "";
    } else {
      handleMenuLoadError(slug, 0, "Unable to load menu. Please check your connection.");
    }
  }
}

/**
 * Reveal page with smooth dissolve transition once contents are loaded
 */
let pageRevealed = false;
function revealPage() {
  if (pageRevealed) return;
  pageRevealed = true;
  requestAnimationFrame(() => {
    const overlay = document.getElementById("pageLoaderOverlay");
    if (overlay) {
      overlay.classList.add("dissolve");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 850);
    }
  });
}

// Initial Load
document.addEventListener("DOMContentLoaded", async () => {
  const initialBlock = document.getElementById("categoryBlock");
  if (initialBlock) {
    const scrollBox = initialBlock.querySelector(".menu-scroll-box");
    const container = initialBlock.querySelector(".menu-card-container");
    if (scrollBox && container) {
      setupScrollBoxListeners(scrollBox, container);
    }
  }

  setupSheetScrollAndBounce(document.getElementById("platterList"));
  updatePlatterCountBadge();

  // Watchdog timer (7s) to guarantee overlay dissolves even on extreme network timeouts
  const watchdog = setTimeout(revealPage, 7000);

  try {
    await loadDynamicMenu();
  } finally {
    clearTimeout(watchdog);
    revealPage();
  }
});

// Update title sizing on screen orientation change or resize
window.addEventListener("resize", () => {
  const currentCategory = MENU_DATA[activeCategoryIndex];
  if (currentCategory) {
    updateCategoryTitle(currentCategory.category, isTodaySpecialCategory(currentCategory));
  }
});

// Disable right click, text selection, and drag globally
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});

document.addEventListener("selectstart", (e) => {
  e.preventDefault();
  return false;
});

document.addEventListener("dragstart", (e) => {
  e.preventDefault();
  return false;
});

// =========================================================================
// Swipe UP / DOWN to Slide Next / Previous Category Block
// =========================================================================
// Swipe UP / DOWN to Slide Next / Previous Category Block
// Rule: First scroll moves till the last of the menu list with bounce effect;
// scrolling again switches category
// =========================================================================
let touchStartY = 0;
let touchStartX = 0;
let touchStartTime = 0;
let touchStartScrollTop = 0;
let touchDragBottomY = null;
let touchDragTopY = null;
let wasAtBottomAtTouchStart = false;
let wasAtTopAtTouchStart = false;

const mobileApp = document.querySelector(".mobile-app") || document.body;

mobileApp.addEventListener("touchstart", (e) => {
  if (!e.touches || e.touches.length !== 1) return;

  // Do not trigger if modal sheets are open
  if ((categorySheet && categorySheet.classList.contains("active")) || 
      (platterSheet && platterSheet.classList.contains("active"))) {
    wasAtBottomAtTouchStart = false;
    wasAtTopAtTouchStart = false;
    return;
  }

  const touch = e.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
  touchStartTime = Date.now();
  touchDragBottomY = null;
  touchDragTopY = null;

  const activeBox = document.querySelector(".category-block .menu-scroll-box") || menuScrollBox;
  if (activeBox) {
    touchStartScrollTop = activeBox.scrollTop;
    const maxScroll = activeBox.scrollHeight - activeBox.clientHeight;
    // If list does not have overflow, all items already fit on screen
    if (maxScroll <= 6) {
      wasAtBottomAtTouchStart = true;
      wasAtTopAtTouchStart = true;
    } else {
      const scrollBottom = maxScroll - activeBox.scrollTop;
      wasAtBottomAtTouchStart = scrollBottom <= 4;
      wasAtTopAtTouchStart = activeBox.scrollTop <= 4;
    }
  } else {
    touchStartScrollTop = 0;
    wasAtBottomAtTouchStart = true;
    wasAtTopAtTouchStart = true;
  }
}, { passive: true });

mobileApp.addEventListener("touchend", (e) => {
  if (!e.changedTouches || e.changedTouches.length !== 1) return;
  if (isTransitioningCategory) return;
  if ((categorySheet && categorySheet.classList.contains("active")) || 
      (platterSheet && platterSheet.classList.contains("active"))) return;

  const activeBox = document.querySelector(".category-block .menu-scroll-box") || menuScrollBox;

  // If activeBox was displaced during direct touch drag, spring it back smoothly along Y-axis
  if (activeBox && activeBox.style.transform && activeBox.style.transform !== "none" && activeBox.style.transform !== "translateY(0px)") {
    activeBox.style.transition = "transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)";
    activeBox.style.transform = "translateY(0px)";
    setTimeout(() => {
      activeBox.style.transition = "";
      activeBox.style.transform = "";
      activeBox.style.transformOrigin = "";
    }, 500);
  }

  const touch = e.changedTouches[0];
  const deltaY = touch.clientY - touchStartY;
  const deltaX = touch.clientX - touchStartX;

  // Vertical swipe dominance
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX) * 1.2;
  const isSwipeUp = deltaY < -35;
  const isSwipeDown = deltaY > 35;

  if (isVertical) {
    const maxScroll = activeBox ? (activeBox.scrollHeight - activeBox.clientHeight) : 0;
    const scrollBottom = activeBox ? (maxScroll - activeBox.scrollTop) : 0;
    const scrollTop = activeBox ? activeBox.scrollTop : 0;

    // NEXT CATEGORY: User MUST have started the touch already at the bottom (wasAtBottomAtTouchStart).
    // If they started higher up, the first scroll displayed the bounce at the end and stopped at the last item.
    if (isSwipeUp && wasAtBottomAtTouchStart && (maxScroll <= 6 || scrollBottom <= 6)) {
      goToNextCategory();
    }
    // PREVIOUS CATEGORY: User MUST have started the touch already at the top (wasAtTopAtTouchStart).
    else if (isSwipeDown && wasAtTopAtTouchStart && (maxScroll <= 6 || scrollTop <= 6)) {
      goToPrevCategory();
    }
  }
}, { passive: true });

// Scroll bounce & rubber-banding handler
window.addEventListener("touchmove", (e) => {
  if (!e.touches || e.touches.length !== 1) return;

  // Check if inside an active bottom sheet list or menu scroll box
  const activeModalScroll = document.querySelector(".bottom-sheet.active .sheet-list, .bottom-sheet.active .platter-list");
  const activeBox = document.querySelector(".category-block .menu-scroll-box") || menuScrollBox;
  const scrollTarget = activeModalScroll || (e.target && e.target.closest ? e.target.closest(".menu-scroll-box") : null) || activeBox;

  // If touched on non-scrollable UI (e.g. sticky header, bottom bar, modal backdrop), prevent page pull
  if (!scrollTarget) {
    if (e.cancelable) e.preventDefault();
    return;
  }

  const currentY = e.touches[0].clientY;
  const deltaY = currentY - touchStartY;
  const scrollTop = scrollTarget.scrollTop;
  const maxScroll = Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight);
  const isMenuScrollBox = scrollTarget.classList.contains("menu-scroll-box");

  // On a longer list of menu items, the FIRST scroll allows direct tactile drag bounce:
  if (isMenuScrollBox && maxScroll > 6) {
    // 1. First scroll downwards towards the bottom: allow pure Y-axis transform bounce (no stretch!)
    if (!wasAtBottomAtTouchStart && deltaY < 0) {
      if (scrollTop >= maxScroll - 1) {
        if (touchDragBottomY === null) touchDragBottomY = currentY;
        const overDrag = touchDragBottomY - currentY;
        if (overDrag > 0) {
          const pull = Math.min(22, Math.pow(overDrag, 0.7) * 1.3);
          scrollTarget.style.transform = `translateY(-${pull}px)`;
        }
      } else {
        touchDragBottomY = null;
      }
      return; // Allow native/momentum scroll to run freely!
    }

    // 2. First scroll upwards towards the top: allow pure Y-axis transform bounce (no stretch!)
    if (!wasAtTopAtTouchStart && deltaY > 0) {
      if (scrollTop <= 1) {
        if (touchDragTopY === null) touchDragTopY = currentY;
        const overDragDown = currentY - touchDragTopY;
        if (overDragDown > 0) {
          const pullDown = Math.min(22, Math.pow(overDragDown, 0.7) * 1.3);
          scrollTarget.style.transform = `translateY(${pullDown}px)`;
        }
      } else {
        touchDragTopY = null;
      }
      return; // Allow native/momentum scroll to run freely!
    }
  }

  // When already at the boundary at touch start, prevent default window scrolling so swipe cleanly switches category
  if (wasAtBottomAtTouchStart && deltaY < 0 && (scrollTop >= maxScroll - 1)) {
    if (e.cancelable) e.preventDefault();
    return;
  }

  if (wasAtTopAtTouchStart && deltaY > 0 && scrollTop <= 1) {
    if (e.cancelable) e.preventDefault();
    return;
  }
}, { passive: false });

// Desktop Wheel / Trackpad: Scroll till end with bounce, then scroll again to switch
let wheelCooldown = false;
let atBottomSince = 0;
let atTopSince = 0;

window.addEventListener("wheel", (e) => {
  const activeBox = document.querySelector(".category-block .menu-scroll-box") || menuScrollBox;
  if (!activeBox) return;

  const isInsideMenu = !!(e.target && e.target.closest && (e.target.closest(".menu-scroll-box") || e.target.closest(".category-block, .main-content")));
  if (!isInsideMenu) return;

  const maxScroll = activeBox.scrollHeight - activeBox.clientHeight;
  const scrollBottom = maxScroll - activeBox.scrollTop;
  const scrollTop = activeBox.scrollTop;

  if (wheelCooldown || isTransitioningCategory) return;
  if ((categorySheet && categorySheet.classList.contains("active")) || 
      (platterSheet && platterSheet.classList.contains("active"))) return;

  const now = Date.now();

  // Scroll DOWN: First scroll reaches bottom with bounce; scrolling again switches category
  if (e.deltaY > 25) {
    if (maxScroll <= 6) {
      wheelCooldown = true;
      goToNextCategory();
      setTimeout(() => { wheelCooldown = false; }, 880);
      return;
    }

    if (scrollBottom <= 3) {
      if (atBottomSince === 0) {
        atBottomSince = now;
        triggerScrollBounce(activeBox, "bottom");
      } else if (now - atBottomSince > 220) {
        atBottomSince = 0;
        wheelCooldown = true;
        goToNextCategory();
        setTimeout(() => { wheelCooldown = false; }, 880);
      }
    } else {
      atBottomSince = 0;
    }
  } else {
    atBottomSince = 0;
  }

  // Scroll UP: First scroll reaches top with bounce; scrolling again switches category
  if (e.deltaY < -25) {
    if (maxScroll <= 6) {
      wheelCooldown = true;
      goToPrevCategory();
      setTimeout(() => { wheelCooldown = false; }, 880);
      return;
    }

    if (scrollTop <= 3) {
      if (atTopSince === 0) {
        atTopSince = now;
        triggerScrollBounce(activeBox, "top");
      } else if (now - atTopSince > 220) {
        atTopSince = 0;
        wheelCooldown = true;
        goToPrevCategory();
        setTimeout(() => { wheelCooldown = false; }, 880);
      }
    } else {
      atTopSince = 0;
    }
  } else {
    atTopSince = 0;
  }
}, { passive: false });

