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
      <svg class="cat-star-icon" viewBox="0 0 24 24" width="14" height="14" fill="#f59e0b" stroke="#d97706" stroke-width="0.8" aria-hidden="true">
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

  let size = 1.05;
  heading.style.letterSpacing = title.length > 12 ? "0.6px" : "1.1px";
  heading.style.fontSize = `${size}rem`;

  while (heading.offsetWidth > maxAllowedWidth && size > 0.75) {
    size -= 0.02;
    heading.style.fontSize = `${size.toFixed(2)}rem`;
  }
}

// =========================================================================
// Category Block Architecture & Sliding Transition
// =========================================================================
let isTransitioningCategory = false;
let activeTransitionTimer = null;
let activeTargetBlock = null;

function updateCategoryDOMReferences(block) {
  if (!block) return;
  categoryHeading = block.querySelector(".category-heading");
  menuScrollBox = block.querySelector(".menu-scroll-box");
  menuCardContainer = block.querySelector(".menu-card-container");
}

function ensureActiveCategoryBlock() {
  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (!stage || !MENU_DATA || MENU_DATA.length === 0) return null;

  let blocks = stage.querySelectorAll(".category-block");
  if (blocks.length === 0) {
    const block = createCategoryBlock(activeCategoryIndex);
    block.style.transform = "translateY(0)";
    block.style.transition = "none";
    stage.appendChild(block);
    updateCategoryDOMReferences(block);
    return block;
  }
  return blocks[blocks.length - 1];
}

function resolveActiveTransition() {
  if (activeTransitionTimer) {
    clearTimeout(activeTransitionTimer);
    activeTransitionTimer = null;
  }

  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (stage) {
    const blocks = Array.from(stage.querySelectorAll(".category-block"));
    if (blocks.length > 0) {
      let winner = (activeTargetBlock && activeTargetBlock.parentNode === stage) 
        ? activeTargetBlock 
        : blocks[blocks.length - 1];

      winner.style.transition = "none";
      winner.style.transform = "translateY(0)";
      updateCategoryDOMReferences(winner);

      blocks.forEach(b => {
        if (b !== winner && b.parentNode) {
          b.remove();
        }
      });
    } else {
      ensureActiveCategoryBlock();
    }
  }

  activeTargetBlock = null;
  peekBlock = null;
  currentBlock = null;
  isTransitioningCategory = false;
  isDraggingCategory = false;
}

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
        if (wasCategoryDragged) return;
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
  if (!stage) return;

  resolveActiveTransition();

  let block = stage.querySelector(".category-block");
  if (!block) {
    block = createCategoryBlock(index);
    block.style.transform = "translateY(0)";
    stage.appendChild(block);
  } else {
    block.style.transform = "translateY(0)";
    block.style.transition = "none";
    populateCategoryBlock(block, index);
  }

  updateCategoryDOMReferences(block);
}

function goToNextCategory() {
  if (!MENU_DATA || MENU_DATA.length === 0) return;
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
  if (!MENU_DATA || MENU_DATA.length === 0) return;
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
  if (!MENU_DATA || MENU_DATA.length === 0) return;
  if (newIndex < 0 || newIndex >= MENU_DATA.length) return;
  if (newIndex === activeCategoryIndex && !isTransitioningCategory) return;

  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (!stage) return;

  // Settle any active transition cleanly before initiating new one
  if (isTransitioningCategory || activeTransitionTimer) {
    resolveActiveTransition();
    if (newIndex === activeCategoryIndex) return;
  }

  isTransitioningCategory = true;
  activeCategoryIndex = newIndex;
  updateActiveSheetItem();
  updateActiveCategoryDot();

  const currentBlock = stage.querySelector(".category-block") || ensureActiveCategoryBlock();
  const nextBlock = createCategoryBlock(newIndex);
  activeTargetBlock = nextBlock;

  // Physical Slide Transitions:
  // 'next': Next block starts below (100%) and slides UP to 0; current block slides UP to -100%
  // 'prev': Next block starts above (-100%) and slides DOWN to 0; current block slides DOWN to 100%
  const startY = direction === 'prev' ? '-100%' : '100%';
  const exitY = direction === 'prev' ? '100%' : '-100%';

  nextBlock.style.transform = `translateY(${startY})`;
  nextBlock.style.transition = 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1)';
  stage.appendChild(nextBlock);

  // Force reflow so initial translation registers before animating
  void nextBlock.offsetWidth;

  if (currentBlock && currentBlock !== nextBlock) {
    currentBlock.style.transition = 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1)';
    currentBlock.style.transform = `translateY(${exitY})`;
  }
  nextBlock.style.transform = 'translateY(0)';

  const oldBlock = currentBlock;
  const finishedBlock = nextBlock;

  activeTransitionTimer = setTimeout(() => {
    activeTransitionTimer = null;
    activeTargetBlock = null;

    if (oldBlock && oldBlock.parentNode && oldBlock !== finishedBlock) {
      oldBlock.remove();
    }
    // Clean any orphan blocks
    const allBlocks = stage.querySelectorAll(".category-block");
    allBlocks.forEach(b => {
      if (b !== finishedBlock && b.parentNode) b.remove();
    });

    updateCategoryDOMReferences(finishedBlock);
    ensureActiveCategoryBlock();
    atBottomSince = 0;
    atTopSince = 0;
    isTransitioningCategory = false;
  }, 340);
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

function renderBrandTitleText(brandTitle, name) {
  if (!name) return;
  brandTitle.textContent = name.trim();
}

function applyBlackOverlay(hex, opacity = 0.35) {
  if (!hex || typeof hex !== "string") return hex;
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map(c => c + c).join("");
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return hex;
  const num = parseInt(clean, 16);
  const r = Math.round(((num >> 16) & 255) * (1 - opacity));
  const g = Math.round(((num >> 8) & 255) * (1 - opacity));
  const b = Math.round((num & 255) * (1 - opacity));
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function updateRestaurantBranding(restaurant) {
  const brandTitle = document.querySelector(".brand-title") || document.getElementById("brandTitle");
  let brandLogo = document.getElementById("brandLogo");

  if (!brandLogo) {
    const stickyHeader = document.querySelector(".sticky-header");
    if (stickyHeader) {
      brandLogo = document.createElement("img");
      brandLogo.id = "brandLogo";
      brandLogo.className = "brand-logo";
      brandLogo.style.display = "none";
      stickyHeader.insertBefore(brandLogo, stickyHeader.firstChild);
    }
  }

  if (restaurant && restaurant.name) {
    document.title = `${restaurant.name} - Menu`;
  }

  const logoUrl = (restaurant && restaurant.branding && restaurant.branding.logoUrl && typeof restaurant.branding.logoUrl === "string")
    ? restaurant.branding.logoUrl.trim()
    : "";

  const stickyHeader = document.querySelector(".sticky-header");

  if (logoUrl) {
    // If a logo is added in the branding page, prioritize the logo on the topbar.
    // No business name will be shown only then.
    if (stickyHeader) {
      stickyHeader.classList.add("has-logo");
    }
    if (brandTitle) {
      brandTitle.style.display = "none";
      brandTitle.innerHTML = "";
    }
    if (brandLogo) {
      brandLogo.src = logoUrl;
      brandLogo.alt = (restaurant && restaurant.name) ? `${restaurant.name} Logo` : "Business Logo";
      brandLogo.style.display = "block";
      brandLogo.onerror = function() {
        // Fallback to name if logo image fails to load
        brandLogo.style.display = "none";
        if (stickyHeader) {
          stickyHeader.classList.remove("has-logo");
        }
        if (brandTitle && restaurant && restaurant.name) {
          brandTitle.style.display = "";
          renderBrandTitleText(brandTitle, restaurant.name);
        }
      };
    }
  } else {
    // No logo: show business name as usual
    if (stickyHeader) {
      stickyHeader.classList.remove("has-logo");
    }
    if (brandLogo) {
      brandLogo.style.display = "none";
      brandLogo.src = "";
    }
    if (brandTitle) {
      brandTitle.style.display = "";
      if (restaurant && restaurant.name) {
        renderBrandTitleText(brandTitle, restaurant.name);
      }
    }
  }

  if (restaurant && restaurant.branding) {
    if (restaurant.branding.accentColor) {
      const brandColor = restaurant.branding.accentColor;
      document.documentElement.style.setProperty("--brand-color", brandColor);
      const darkenedBrand = applyBlackOverlay(brandColor, 0.35);
      document.documentElement.style.setProperty("--theme-darkened-brand", darkenedBrand);
      if (stickyHeader) {
        stickyHeader.style.backgroundColor = brandColor;
      }
      const browseBtn = document.getElementById("browseBtn");
      if (browseBtn) {
        browseBtn.style.backgroundColor = darkenedBrand;
      }
    }
    if (restaurant.branding.backgroundColor) {
      const bgColor = restaurant.branding.backgroundColor;
      document.documentElement.style.setProperty("--menu-bg-color", bgColor);
    }
    if (restaurant.branding.nameTextColor) {
      const nameColor = restaurant.branding.nameTextColor;
      document.documentElement.style.setProperty("--name-text-color", nameColor);
    } else {
      document.documentElement.style.removeProperty("--name-text-color");
    }
    if (restaurant.branding.hasNameStroke === false) {
      document.documentElement.style.setProperty("--name-stroke", "0px transparent");
    } else {
      document.documentElement.style.removeProperty("--name-stroke");
    }
    if (restaurant.branding.nameFont) {
      const fontMap = {
        "Lobster": "'Lobster', cursive, sans-serif",
        "Bebas Neue": "'Bebas Neue', sans-serif",
        "Google Sans": "'Google Sans', sans-serif",
        "Berkshire Swash": "'Berkshire Swash', cursive, serif",
        "Kaushan Script": "'Kaushan Script', cursive"
      };
      const resolvedFont = fontMap[restaurant.branding.nameFont] || `'${restaurant.branding.nameFont}', cursive, sans-serif`;
      document.documentElement.style.setProperty("--name-font", resolvedFont);
    } else {
      document.documentElement.style.removeProperty("--name-font");
    }
  }
}

function handleMenuLoadError(slug, status, errorMsg) {
  const brandTitle = document.querySelector(".brand-title") || document.getElementById("brandTitle");
  const brandLogo = document.getElementById("brandLogo");
  const stickyHeader = document.querySelector(".sticky-header");
  const heading = document.getElementById("categoryHeading");
  const scrollBox = document.getElementById("menuScrollBox");
  const dots = document.getElementById("categoryPageDots");
  const browseBtn = document.getElementById("browseBtn");

  if (stickyHeader) {
    stickyHeader.classList.remove("has-logo");
  }
  if (brandLogo) {
    brandLogo.style.display = "none";
  }

  const readableName = slug && slug !== "royal-food-corner"
    ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Restaurant";

  if (brandTitle) {
    brandTitle.style.display = "";
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
    const response = await fetch(`/api/public/menu?slug=${encodeURIComponent(slug)}&_t=${Date.now()}`, { cache: "no-store" });
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

    // Update menu categories - filter out any category without items (including Today's Special)
    const validCategories = Array.isArray(data.categories)
      ? data.categories.filter(cat => Array.isArray(cat.items) && cat.items.length > 0)
      : [];

    if (validCategories.length > 0) {
      MENU_DATA = validCategories;
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
// Reels / Shorts Fluid 1:1 Category Drag & Transition Engine
// Content moves in real time with the finger, exactly like Shorts/Reels.
// =========================================================================
let isDraggingCategory = false;
let wasCategoryDragged = false;
let categoryDragStartY = 0;
let categoryDragStartX = 0;
let categoryDragStartTime = 0;
let categoryDragOffset = 0;
let peekBlock = null;
let currentBlock = null;
let dragTargetIndex = -1;
let canDragNext = false;
let canDragPrev = false;
let isMouseDown = false;

const mobileApp = document.querySelector(".mobile-app") || document.body;

function getActiveScrollBox() {
  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  const block = stage ? stage.querySelector(".category-block") : null;
  return block ? block.querySelector(".menu-scroll-box") : menuScrollBox;
}

function handleDragStart(clientY, clientX, target) {
  // Do not intercept if modal sheets are open
  if ((categorySheet && categorySheet.classList.contains("active")) || 
      (platterSheet && platterSheet.classList.contains("active"))) {
    return;
  }
  if (!MENU_DATA || MENU_DATA.length <= 1) return;

  // Immediately resolve any in-flight transition so rapid interactions never stall or conflict
  if (isTransitioningCategory || activeTransitionTimer) {
    resolveActiveTransition();
  }

  categoryDragStartY = clientY;
  categoryDragStartX = clientX;
  categoryDragStartTime = Date.now();
  categoryDragOffset = 0;
  isDraggingCategory = false;
  wasCategoryDragged = false;
  dragTargetIndex = -1;
  peekBlock = null;

  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  currentBlock = ensureActiveCategoryBlock();
  if (currentBlock) {
    currentBlock.style.transition = "none";
    currentBlock.style.transform = "translateY(0)";
  }

  const activeBox = getActiveScrollBox();
  const isTouchInsidePanel = !!(target && target.closest && (target.closest(".category-panel") || target.closest(".category-page-dots")));

  if (isTouchInsidePanel || !activeBox) {
    canDragNext = true;
    canDragPrev = true;
  } else {
    const maxScroll = Math.max(0, activeBox.scrollHeight - activeBox.clientHeight);
    if (maxScroll <= 6) {
      canDragNext = true;
      canDragPrev = true;
    } else {
      canDragNext = (maxScroll - activeBox.scrollTop) <= 4;
      canDragPrev = activeBox.scrollTop <= 4;
    }
  }
}

function handleDragMove(clientY, clientX, preventDefaultFn) {
  if (!MENU_DATA || MENU_DATA.length <= 1) return;
  if ((categorySheet && categorySheet.classList.contains("active")) || 
      (platterSheet && platterSheet.classList.contains("active"))) return;

  if (isTransitioningCategory || activeTransitionTimer) {
    resolveActiveTransition();
  }

  const deltaY = clientY - categoryDragStartY;
  const deltaX = clientX - categoryDragStartX;
  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (!stage) return;
  if (!currentBlock || !currentBlock.parentNode) currentBlock = ensureActiveCategoryBlock();
  if (!currentBlock) return;

  const activeBox = getActiveScrollBox();
  const maxScroll = activeBox ? Math.max(0, activeBox.scrollHeight - activeBox.clientHeight) : 0;
  const currentScrollTop = activeBox ? activeBox.scrollTop : 0;
  const isAtBottom = maxScroll <= 6 || (maxScroll - currentScrollTop <= 3);
  const isAtTop = maxScroll <= 6 || (currentScrollTop <= 3);

  // If already dragging 1:1 like reels:
  if (isDraggingCategory) {
    if (preventDefaultFn) preventDefaultFn();
    wasCategoryDragged = true;
    categoryDragOffset = deltaY;

    if (dragTargetIndex > activeCategoryIndex && peekBlock) {
      // Dragging UP towards next category
      if (categoryDragOffset > 0) {
        const pull = categoryDragOffset * 0.26;
        currentBlock.style.transform = `translateY(${pull}px)`;
        peekBlock.style.transform = `translateY(calc(100% + ${pull}px))`;
      } else {
        currentBlock.style.transform = `translateY(${categoryDragOffset}px)`;
        peekBlock.style.transform = `translateY(calc(100% + ${categoryDragOffset}px))`;
      }
    } else if (dragTargetIndex < activeCategoryIndex && dragTargetIndex >= 0 && peekBlock) {
      // Dragging DOWN towards previous category
      if (categoryDragOffset < 0) {
        const pull = categoryDragOffset * 0.26;
        currentBlock.style.transform = `translateY(${pull}px)`;
        peekBlock.style.transform = `translateY(calc(-100% + ${pull}px))`;
      } else {
        currentBlock.style.transform = `translateY(${categoryDragOffset}px)`;
        peekBlock.style.transform = `translateY(calc(-100% + ${categoryDragOffset}px))`;
      }
    } else {
      // Boundary rubber-band (first or last category)
      const resist = categoryDragOffset * 0.22;
      currentBlock.style.transform = `translateY(${resist}px)`;
    }
    return;
  }

  // Check if we should START 1:1 category drag:
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX) * 1.05;
  if (!isVertical) return;

  // Dragging UP (towards next category):
  if (deltaY < -8 && (canDragNext || isAtBottom)) {
    isDraggingCategory = true;
    wasCategoryDragged = true;
    if (preventDefaultFn) preventDefaultFn();

    categoryDragStartY = clientY;
    categoryDragStartTime = Date.now();
    categoryDragOffset = 0;

    currentBlock.style.transition = "none";

    // Purge any orphan category blocks
    const existingBlocks = stage.querySelectorAll(".category-block");
    existingBlocks.forEach(b => {
      if (b !== currentBlock && b.parentNode) b.remove();
    });

    if (activeCategoryIndex < MENU_DATA.length - 1) {
      dragTargetIndex = activeCategoryIndex + 1;
      peekBlock = createCategoryBlock(dragTargetIndex);
      peekBlock.style.transition = "none";
      peekBlock.style.transform = "translateY(100%)";
      stage.appendChild(peekBlock);
    } else {
      dragTargetIndex = -1; // End boundary
    }
    return;
  }

  // Dragging DOWN (towards previous category):
  if (deltaY > 8 && (canDragPrev || isAtTop)) {
    isDraggingCategory = true;
    wasCategoryDragged = true;
    if (preventDefaultFn) preventDefaultFn();

    categoryDragStartY = clientY;
    categoryDragStartTime = Date.now();
    categoryDragOffset = 0;

    currentBlock.style.transition = "none";

    // Purge any orphan category blocks
    const existingBlocks = stage.querySelectorAll(".category-block");
    existingBlocks.forEach(b => {
      if (b !== currentBlock && b.parentNode) b.remove();
    });

    if (activeCategoryIndex > 0) {
      dragTargetIndex = activeCategoryIndex - 1;
      peekBlock = createCategoryBlock(dragTargetIndex);
      peekBlock.style.transition = "none";
      peekBlock.style.transform = "translateY(-100%)";
      stage.appendChild(peekBlock);
    } else {
      dragTargetIndex = -1; // Start boundary
    }
    return;
  }
}

function handleDragEnd() {
  if (!isDraggingCategory) return;
  // IMMEDIATELY unset dragging to prevent re-entrant duplicate calls from touchend / mouseup
  isDraggingCategory = false;

  const stage = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (!stage) return;
  if (!currentBlock || !currentBlock.parentNode) currentBlock = ensureActiveCategoryBlock();
  if (!currentBlock) return;

  const stageH = stage.clientHeight || (window.innerHeight || 600);
  const elapsed = Math.max(1, Date.now() - categoryDragStartTime);
  const velocity = categoryDragOffset / elapsed; // px/ms
  const distance = Math.abs(categoryDragOffset);

  const isFlick = Math.abs(velocity) > 0.35 && distance > 18;
  const isPassedThreshold = distance > stageH * 0.14;
  const shouldCommit = (isFlick || isPassedThreshold);

  // 1. Commit NEXT Category
  if (shouldCommit && dragTargetIndex > activeCategoryIndex && peekBlock && categoryDragOffset < -15) {
    isTransitioningCategory = true;
    const targetIdx = dragTargetIndex;
    activeCategoryIndex = targetIdx;
    updateActiveSheetItem();
    updateActiveCategoryDot();

    const finishedBlock = peekBlock;
    const oldBlock = currentBlock;
    activeTargetBlock = finishedBlock;

    oldBlock.style.transition = "transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)";
    oldBlock.style.transform = "translateY(-100%)";

    finishedBlock.style.transition = "transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)";
    finishedBlock.style.transform = "translateY(0)";

    activeTransitionTimer = setTimeout(() => {
      activeTransitionTimer = null;
      activeTargetBlock = null;
      if (oldBlock && oldBlock.parentNode && oldBlock !== finishedBlock) {
        oldBlock.remove();
      }
      // Ensure only finishedBlock remains
      const allBlocks = stage.querySelectorAll(".category-block");
      allBlocks.forEach(b => {
        if (b !== finishedBlock && b.parentNode) b.remove();
      });

      updateCategoryDOMReferences(finishedBlock);
      ensureActiveCategoryBlock();
      isTransitioningCategory = false;
      peekBlock = null;
      currentBlock = null;
      setTimeout(() => { wasCategoryDragged = false; }, 80);
    }, 300);
    return;
  }

  // 2. Commit PREVIOUS Category
  if (shouldCommit && dragTargetIndex < activeCategoryIndex && dragTargetIndex >= 0 && peekBlock && categoryDragOffset > 15) {
    isTransitioningCategory = true;
    const targetIdx = dragTargetIndex;
    activeCategoryIndex = targetIdx;
    updateActiveSheetItem();
    updateActiveCategoryDot();

    const finishedBlock = peekBlock;
    const oldBlock = currentBlock;
    activeTargetBlock = finishedBlock;

    oldBlock.style.transition = "transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)";
    oldBlock.style.transform = "translateY(100%)";

    finishedBlock.style.transition = "transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)";
    finishedBlock.style.transform = "translateY(0)";

    activeTransitionTimer = setTimeout(() => {
      activeTransitionTimer = null;
      activeTargetBlock = null;
      if (oldBlock && oldBlock.parentNode && oldBlock !== finishedBlock) {
        oldBlock.remove();
      }
      // Ensure only finishedBlock remains
      const allBlocks = stage.querySelectorAll(".category-block");
      allBlocks.forEach(b => {
        if (b !== finishedBlock && b.parentNode) b.remove();
      });

      updateCategoryDOMReferences(finishedBlock);
      ensureActiveCategoryBlock();
      isTransitioningCategory = false;
      peekBlock = null;
      currentBlock = null;
      setTimeout(() => { wasCategoryDragged = false; }, 80);
    }, 300);
    return;
  }

  // 3. CANCEL / REBOUND (Spring back to 0)
  isTransitioningCategory = true;
  const returningBlock = currentBlock;
  const unneededPeek = peekBlock;
  activeTargetBlock = returningBlock;

  returningBlock.style.transition = "transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)";
  returningBlock.style.transform = "translateY(0)";

  if (unneededPeek) {
    unneededPeek.style.transition = "transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)";
    unneededPeek.style.transform = dragTargetIndex > activeCategoryIndex ? "translateY(100%)" : "translateY(-100%)";
  }

  activeTransitionTimer = setTimeout(() => {
    activeTransitionTimer = null;
    activeTargetBlock = null;
    if (unneededPeek && unneededPeek.parentNode && unneededPeek !== returningBlock) {
      unneededPeek.remove();
    }
    // Clean any stray blocks
    const allBlocks = stage.querySelectorAll(".category-block");
    allBlocks.forEach(b => {
      if (b !== returningBlock && b.parentNode) b.remove();
    });

    updateCategoryDOMReferences(returningBlock);
    ensureActiveCategoryBlock();
    isTransitioningCategory = false;
    peekBlock = null;
    currentBlock = null;
    setTimeout(() => { wasCategoryDragged = false; }, 80);
  }, 260);
}

// Mobile Touch Listeners
mobileApp.addEventListener("touchstart", (e) => {
  if (!e.touches || e.touches.length !== 1) return;
  handleDragStart(e.touches[0].clientY, e.touches[0].clientX, e.target);
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!e.touches || e.touches.length !== 1) return;
  handleDragMove(e.touches[0].clientY, e.touches[0].clientX, () => {
    if (e.cancelable) e.preventDefault();
  });
}, { passive: false });

window.addEventListener("touchend", () => {
  handleDragEnd();
}, { passive: true });

window.addEventListener("touchcancel", () => {
  handleDragEnd();
}, { passive: true });

// Desktop Mouse Drag Listeners (allows click-and-drag testing on desktop)
mobileApp.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  isMouseDown = true;
  handleDragStart(e.clientY, e.clientX, e.target);
});

window.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  handleDragMove(e.clientY, e.clientX, () => {
    e.preventDefault();
  });
});

window.addEventListener("mouseup", (e) => {
  if (!isMouseDown) return;
  isMouseDown = false;
  handleDragEnd();
});

// Desktop Wheel / Trackpad Support
let wheelCooldown = false;
let atBottomSince = 0;
let atTopSince = 0;

window.addEventListener("wheel", (e) => {
  const activeBox = getActiveScrollBox();
  if (!activeBox) return;

  const isInsideMenu = !!(e.target && e.target.closest && (e.target.closest(".menu-scroll-box") || e.target.closest(".category-block, .main-content")));
  if (!isInsideMenu) return;

  const maxScroll = Math.max(0, activeBox.scrollHeight - activeBox.clientHeight);
  const scrollBottom = maxScroll - activeBox.scrollTop;
  const scrollTop = activeBox.scrollTop;

  if (wheelCooldown) return;
  if ((categorySheet && categorySheet.classList.contains("active")) || 
      (platterSheet && platterSheet.classList.contains("active"))) return;

  const now = Date.now();

  // Scroll DOWN: switches to next category at bottom
  if (e.deltaY > 24) {
    if (maxScroll <= 6) {
      wheelCooldown = true;
      goToNextCategory();
      setTimeout(() => { wheelCooldown = false; }, 380);
      return;
    }

    if (scrollBottom <= 3) {
      if (atBottomSince === 0) {
        atBottomSince = now;
      } else if (now - atBottomSince > 130) {
        atBottomSince = 0;
        wheelCooldown = true;
        goToNextCategory();
        setTimeout(() => { wheelCooldown = false; }, 380);
      }
    } else {
      atBottomSince = 0;
    }
  } else {
    atBottomSince = 0;
  }

  // Scroll UP: switches to prev category at top
  if (e.deltaY < -24) {
    if (maxScroll <= 6) {
      wheelCooldown = true;
      goToPrevCategory();
      setTimeout(() => { wheelCooldown = false; }, 380);
      return;
    }

    if (scrollTop <= 3) {
      if (atTopSince === 0) {
        atTopSince = now;
      } else if (now - atTopSince > 130) {
        atTopSince = 0;
        wheelCooldown = true;
        goToPrevCategory();
        setTimeout(() => { wheelCooldown = false; }, 380);
      }
    } else {
      atTopSince = 0;
    }
  } else {
    atTopSince = 0;
  }
}, { passive: false });

