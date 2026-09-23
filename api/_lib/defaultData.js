const DEFAULT_TODAY_SPECIAL_ITEMS = [
  { name: "Chef Special Butter Chicken", price: 340, description: "Tender chicken cooked in rich and velvety makhani gravy, crafted fresh daily by our head chef." },
  { name: "Royal Paneer Tikka", price: 270, description: "Fresh cottage cheese cubes marinated in saffron yogurt cream and charcoal grilled to perfection." },
  { name: "Special Mutton Dum Biryani", price: 360, description: "Fragrant long-grain aged basmati rice cooked with tender mutton chunks on slow dum." },
  { name: "Charcoal Smoked Tandoori Pomfret", price: 420, description: "Whole pomfret fish marinated in yellow mustard, carom seeds, and crushed pepper roasted in clay oven." },
  { name: "Murgh Malai Kasturi Kebab", price: 330, description: "Mouth-melting boneless chicken chunks scented with kasuri methi, mace, and royal cardamom." },
  { name: "Zafrani Shahi Paneer", price: 280, description: "Cottage cheese triangles cooked in a silken gravy of Kashmiri saffron, melon seeds, and sweet cream." },
  { name: "Dal Bukhara", price: 260, description: "Legendary black lentils and tomato reduction slow-cooked over burning embers for 24 hours." },
  { name: "Royal Awadhi Gosht Korma", price: 390, description: "Rich lamb delicacy prepared with caramelized onions, yogurt, almonds, and aromatic rose water." },
  { name: "Truffle Garlic Naan", price: 95, description: "Fluffy tandoor naan brushed with white truffle oil, roasted garlic slivers, and fresh chives." },
  { name: "Special Chicken Dum Biryani", price: 310, description: "Our signature layered biryani with secret royal potli masala and juicy marinated chicken." },
  { name: "Dahi Ke Kebab", price: 240, description: "Crisp exterior hung-curd patties flavored with green cardamom, roasted cumin, and fresh mint." },
  { name: "Bhatti Ka Murgh (Half)", price: 320, description: "Rustic Punjabi highway-style charred chicken infused with crushed black pepper and malt vinegar." },
  { name: "Paneer Lababdar Special", price: 270, description: "Grated and diced paneer tossed in an exquisite onion-tomato gravy with sweet bell peppers." },
  { name: "Subz Parda Biryani", price: 240, description: "Garden vegetables and aromatic rice sealed with edible puff pastry crust to lock inside all aroma." },
  { name: "Kesar Pista Matka Kulfi", price: 120, description: "Traditional slow-churned condensed milk ice cream flavored with saffron threads and roasted pistachios." },
  { name: "Shahi Tukda with Rabdi", price: 130, description: "Crisp ghee-fried bread triangles drenched in saffron sugar syrup and smothered in thick lacchedar rabdi." }
];

const DEFAULT_15_CATEGORIES = [
  {
    name: "SOUPS & SHORBA",
    items: [
      { name: "Tomato Dhaniya Shorba", price: 140, description: "Slow-simmered plum tomato soup infused with roasted cumin and fresh coriander." },
      { name: "Hot & Sour Chicken Soup", price: 160, description: "Classic spicy and tangy broth with tender chicken shreds, bamboo shoots, and mushrooms." },
      { name: "Sweet Corn Veg Soup", price: 130, description: "Mild, creamy broth loaded with fresh American sweet corn and diced vegetables." },
      { name: "Sweet Corn Chicken Soup", price: 170, description: "Velvety egg-drop broth packed with tender chicken shreds and sweet corn kernels." },
      { name: "Manchow Veg Soup", price: 140, description: "Indo-Chinese spicy vegetable broth loaded with garlic and garnished with crispy noodles." },
      { name: "Manchow Chicken Soup", price: 175, description: "Fiery dark broth with minced chicken, spring onions, and generous fried crunchy noodles." },
      { name: "Lemon Coriander Veg Soup", price: 135, description: "Refreshing clear broth bursting with zesty fresh lime juice, crushed ginger, and coriander." },
      { name: "Lemon Coriander Chicken Soup", price: 165, description: "Light and soothing chicken broth infused with lemongrass, fresh lime, and coriander leaves." },
      { name: "Murgh Yakhni Shorba", price: 190, description: "Kashmiri-style aromatic bone broth simmered with whole spices, ginger, and saffron." },
      { name: "Mutton Paya Shorba", price: 220, description: "Nourishing slow-cooked lamb trotters broth infused with garlic, cloves, and black pepper." },
      { name: "Cream of Mushroom Soup", price: 150, description: "Smooth velvety pureed button mushroom soup finished with fresh cream and cracked pepper." },
      { name: "Cream of Tomato Soup", price: 130, description: "Rich and buttery ripe tomato soup served with crispy golden bread croutons." },
      { name: "Hot & Sour Veg Soup", price: 135, description: "Piquant spicy broth flavored with white pepper, soy sauce, tofu, and shredded vegetables." },
      { name: "Clear Veg Noodle Soup", price: 125, description: "Wholesome clear broth with garden vegetables and delicate steamed noodles." },
      { name: "Talumein Chicken Soup", price: 180, description: "Hearty Chinese soup loaded with shredded chicken, fresh greens, and egg noodles." },
      { name: "Tom Yum Veg Soup", price: 160, description: "Spicy and sour Thai herb broth with kaffir lime, galangal, lemongrass, and mushrooms." }
    ]
  },
  {
    name: "STARTERS & APPETIZERS",
    items: [
      { name: "Crispy Paneer Tikka", price: 260, description: "Cubes of paneer marinated in spiced yogurt and mustard oil, grilled golden in tandoor." },
      { name: "Galauti Kebab", price: 340, description: "Melt-in-mouth smoked minced lamb kebabs infused with 16 royal aromatic spices." },
      { name: "Crispy Corn Salt & Pepper", price: 180, description: "Crunchy batter-fried corn kernels tossed with chopped green chillies and garlic." },
      { name: "Chicken 65", price: 250, description: "Fiery, deep-fried chicken cubes tossed with curry leaves, crushed pepper, and curd." },
      { name: "Hara Bhara Kebab", price: 210, description: "Pan-fried patties made with spinach, green peas, potatoes, and roasted gram flour." },
      { name: "Dahi Ke Sholey", price: 230, description: "Crisp bread parcels stuffed with spiced hung curd, bell peppers, and fresh herbs." },
      { name: "Veg Kurkure Spring Rolls", price: 170, description: "Golden fried crispy pastry rolls filled with shredded seasonal vegetables and sweet chilli dip." },
      { name: "Chicken Seekh Kebab", price: 280, description: "Minced spiced chicken skewered and roasted to juicy perfection in clay oven." },
      { name: "Mutton Kakori Kebab", price: 360, description: "Silky soft Awadhi style minced mutton kebabs scented with rose petal essence." },
      { name: "Fish Amritsari Tikka", price: 340, description: "River sole fish marinated in carom seeds and gram flour batter, deep fried crisp." },
      { name: "Chilli Baby Corn", price: 190, description: "Crunchy tender baby corn tossed in spicy garlic soy sauce with spring onions." },
      { name: "Honey Chilli Potato", price: 170, description: "Crisp potato fingers glazed with sweet honey, spicy chilli sauce, and roasted sesame." },
      { name: "Chicken Lollipop", price: 270, description: "Frenched chicken drumettes coated in spicy red batter and fried crisp, served with schezwan dip." },
      { name: "Tandoori Aloo Nazakat", price: 220, description: "Scooped potatoes stuffed with dry fruits, mashed paneer, and grilled in tandoor." },
      { name: "Kurkure Soya Chaap", price: 210, description: "Soya chaap sticks coated in crushed cornflakes batter and fried to golden crispiness." },
      { name: "Golden Fried Prawns", price: 390, description: "Jumbo prawns dipped in light batter and deep-fried till golden and crunchy." },
      { name: "Veg Seekh Kebab", price: 220, description: "Minced mixed vegetables, paneer, and aromatic herbs skewered and grilled over charcoal." }
    ]
  },
  {
    name: "TANDOORI SPECIALS",
    items: [
      { name: "Tandoori Chicken", price: 290, description: "Whole bone-in chicken steeped in Kashmiri chilli and curd marinade, roasted over clay oven charcoal." },
      { name: "Chicken Malai Tikka", price: 310, description: "Succulent boneless chicken tenders coated in rich cashew cream and cardamom." },
      { name: "Afghani Soya Chaap", price: 240, description: "Smoked soya chaap chunks marinated in mild white cream, herbs, and cheese." },
      { name: "Paneer Malai Tikka", price: 270, description: "Creamy grilled cottage cheese cubes flavoured with mace, white pepper, and coriander roots." },
      { name: "Achari Paneer Tikka", price: 260, description: "Paneer cubes marinated in pungent pickling spices and mustard oil, grilled smoky." },
      { name: "Tangdi Kebab", price: 320, description: "Juicy chicken drumsticks stuffed with minced spices and roasted in hot tandoor." },
      { name: "Murgh Angara Tikka", price: 300, description: "Spicy and smoky chicken skewers marinated in red degi mirch paste and garlic." },
      { name: "Pahadi Chicken Tikka", price: 295, description: "Chicken morsels marinated with fresh mint, coriander, green chillies, and mountain herbs." },
      { name: "Tandoori Soya Malai Chaap", price: 250, description: "Tender soya chaap roasted in clay oven with thick cashew paste and clotted cream." },
      { name: "Tandoori Bharwan Mushroom", price: 260, description: "Button mushroom caps stuffed with spiced paneer and bell peppers, tandoori grilled." },
      { name: "Fish Tikka Lahori", price: 360, description: "Boneless fish steaks marinated with Lahori spices, ajwain, and yogurt, char-grilled." },
      { name: "Mutton Boti Kebab", price: 390, description: "Boneless tender lamb chunks marinated in raw papaya paste and grilled over embers." },
      { name: "Tandoori Stuffed Paratha Roll", price: 180, description: "Clay oven roasted flaky paratha stuffed with spiced grilled filling and tangy chutney." },
      { name: "Kalmi Kebab", price: 310, description: "Chicken thigh pieces marinated in yogurt, roasted gram flour, and shahi garam masala." },
      { name: "Hariyali Paneer Tikka", price: 260, description: "Fresh cottage cheese marinated in crushed mint, spinach paste, and aromatic spices." },
      { name: "Tandoori Chicken Wings", price: 280, description: "Crisp tandoori-roasted chicken wings tossed with chaat masala and lemon juice." }
    ]
  },
  {
    name: "CHINESE & MOMOS",
    items: [
      { name: "Veg Steamed Momos", price: 130, description: "Thin-wrapper dumplings stuffed with seasoned finely minced garden vegetables." },
      { name: "Chicken Kurkure Momos", price: 190, description: "Extra-crispy cornflake crusted dumplings served with fiery red chutney." },
      { name: "Chilli Paneer Dry", price: 220, description: "Crisp cottage cheese cubes tossed with capsicum, onions, and spicy dark soya sauce." },
      { name: "Chilli Chicken Dry", price: 260, description: "Batter-coated tender chicken wok-tossed with shallots, garlic, and fresh green chillies." },
      { name: "Veg Fried Momos", price: 140, description: "Crispy golden fried vegetable dumplings served with spicy schezwan sauce." },
      { name: "Chicken Steamed Momos", price: 160, description: "Juicy minced chicken steamed inside thin flour wrappers, served piping hot." },
      { name: "Paneer Kurkure Momos", price: 180, description: "Crusty fried momos packed with cottage cheese and herbs, coated with crunchy breadcrumbs." },
      { name: "Tandoori Chicken Momos", price: 210, description: "Steamed chicken momos coated in red tandoori marinade and charred over charcoal." },
      { name: "Tandoori Veg Momos", price: 170, description: "Vegetable momos marinated in spiced curd and grilled in tandoor with mint chutney." },
      { name: "Veg Manchurian Dry", price: 190, description: "Minced vegetable rounds fried crisp and tossed in pungent garlic-coriander dark sauce." },
      { name: "Dragon Chicken", price: 270, description: "Crispy chicken strips tossed in sweet and spicy sauce with cashew nuts and dry chillies." },
      { name: "Crispy Chilli Garlic Potato", price: 160, description: "Potato wedges stir-fried with crushed roasted garlic, red chilli flakes, and spring onion." },
      { name: "Chilli Mushroom Dry", price: 210, description: "Crisp batter-fried fresh button mushrooms tossed with green chillies and capsicum." },
      { name: "Chicken Spring Rolls", price: 220, description: "Crisp pastry rolls loaded with spiced shredded chicken, cabbage, and carrots." },
      { name: "Schezwan Chilli Paneer", price: 230, description: "Paneer cubes wok-tossed in homemade fiery Sichuan pepper sauce." },
      { name: "Drums of Heaven", price: 280, description: "Tender chicken lollipops tossed in a luscious sweet and spicy garlic glaze." },
      { name: "Honey Sesame Chicken", price: 270, description: "Crispy chicken bites glazed in sweet honey sauce and garnished with toasted sesame seeds." }
    ]
  },
  {
    name: "CRISPY PLATTERS",
    items: [
      { name: "Royal Veg Kebab Platter", price: 420, description: "An assorted platter of Paneer Tikka, Veg Seekh Kebab, Stuffed Aloo, and Hara Bhara Kebab." },
      { name: "Non-Veg Tandoori Platter", price: 580, description: "Chef special assortment of Chicken Tikka, Tandoori Wings, Seekh Kebab, and Fish Tikka." },
      { name: "Tandoori Soya Chaap Platter", price: 360, description: "Duo of spicy Achari and mild Malai soya chaap served with mint chutney and onion salad." },
      { name: "Seafood Delight Platter", price: 650, description: "Platter of Fish Amritsari, Golden Fried Prawns, and Char-grilled Fish Tikka." },
      { name: "Paneer Tikka Trio Platter", price: 440, description: "Generous assortment of Malai Paneer Tikka, Achari Paneer, and Hariyali Paneer." },
      { name: "Murgh Tikka Degi Platter", price: 540, description: "Chicken Malai Tikka, Chicken Angara Tikka, and Pahadi Chicken served with rumali roti." },
      { name: "Veg Chinese Starters Platter", price: 390, description: "Trio of Chilli Paneer, Veg Spring Rolls, Crispy Corn, and Veg Manchurian." },
      { name: "Non-Veg Chinese Platter", price: 520, description: "Combo of Chilli Chicken, Chicken Spring Rolls, and Drums of Heaven with schezwan dip." },
      { name: "Momos Fiesta Platter", price: 350, description: "Assorted platter of Steamed, Fried, Kurkure, and Tandoori Momos with three dips." },
      { name: "Royal Assorted Naan Basket", price: 220, description: "Basket containing Butter Naan, Garlic Naan, Laccha Paratha, and Missi Roti." },
      { name: "Tandoori Chicken & Kebab Platter", price: 590, description: "Half Tandoori Chicken, Chicken Seekh Kebab, and Mutton Kakori Kebab." },
      { name: "Crispy Fried Snack Platter", price: 320, description: "Golden French fries, Cheese Corn Nuggets, and Veg Spring Rolls with dipping sauces." },
      { name: "Lucknowi Gosht Platter", price: 680, description: "Royal assortment of Galauti Kebabs, Mutton Seekh, and Boti Kebabs with sheermaal." },
      { name: "Barbeque Wings Platter", price: 450, description: "Dozen smoky chicken wings tossed in rich tangy barbeque glaze and sesame." },
      { name: "Cheese Corn Bites & Fries", price: 290, description: "Molten cheese balls and crispy salted potato fries with chipotle mayo." },
      { name: "Grand Royal Feast Platter", price: 790, description: "Supreme feast of tandoori delicacies, grilled prawns, seekh kebabs, and stuffed naan." }
    ]
  },
  {
    name: "BIRYANI & PULAO",
    items: [
      { name: "Hyderabadi Dum Chicken Biryani", price: 270, description: "Fragrant long-grain aged basmati rice cooked on slow dum with tender marinated chicken." },
      { name: "Lucknowi Mutton Biryani", price: 360, description: "Delicate Awadhi style dum biryani with soft mutton pieces perfumed with kewra and saffron." },
      { name: "Paneer Dum Biryani", price: 220, description: "Layered basmati rice with spiced fresh paneer, caramelized onions, mint, and saffron." },
      { name: "Kashmiri Pulao", price: 190, description: "Sweet and savoury aromatic rice garnished with golden raisins, cashews, and fresh pomegranate." },
      { name: "Kolkata Chicken Biryani", price: 280, description: "Calcutta style slow-dum biryani with tender chicken, boiled spiced egg, and soft aloo." },
      { name: "Kolkata Mutton Biryani", price: 370, description: "Aged basmati rice infused with meetha ittar, tender baby goat meat, and melt-in-mouth potato." },
      { name: "Chicken Tikka Biryani", price: 295, description: "Char-grilled tandoori chicken tikka pieces layered with spicy biryani rice and ghee." },
      { name: "Handi Mutton Biryani", price: 390, description: "Earthen pot cooked mutton biryani sealed with dough and slow-simmered on live coals." },
      { name: "Veg Dum Biryani", price: 190, description: "Wholesome assortment of garden veggies and basmati rice slow-cooked with whole spices." },
      { name: "Egg Dum Biryani", price: 210, description: "Boiled eggs fried golden and tossed with fragrant dum-cooked spiced basmati rice." },
      { name: "Prawns Dum Biryani", price: 380, description: "Coastal-spiced juicy prawns layered with fragrant rice and fresh mint leaves." },
      { name: "Mushroom Matar Biryani", price: 220, description: "Plump button mushrooms and green peas layered with spiced basmati rice." },
      { name: "Keema Dum Biryani", price: 340, description: "Rich spiced minced mutton layered with saffron-tinged fragrant basmati rice." },
      { name: "Jeera Rice", price: 130, description: "Fragrant long-grain steamed basmati rice tempered with golden roasted cumin seeds." },
      { name: "Peas Pulao", price: 150, description: "Aromatic basmati rice cooked with sweet green peas and whole aromatic spices." },
      { name: "Veg Navratan Pulao", price: 210, description: "Royal mild rice dish with mixed vegetables, pineapple, fried cashews, and paneer." },
      { name: "Ghee Steamed Basmati Rice", price: 110, description: "Fluffy aged long-grain basmati rice brushed with pure clarified butter." }
    ]
  },
  {
    name: "MAIN COURSE",
    items: [
      { name: "Paneer Butter Masala", price: 250, description: "Rich and luscious tomato and cashew butter gravy topped with fresh cream and butter." },
      { name: "Kadhai Paneer", price: 240, description: "Paneer cubes and bell peppers tossed with freshly pounded roasted coriander and red chillies." },
      { name: "Shahi Malai Kofta", price: 260, description: "Fried cottage cheese and dry-fruit dumplings steeped in a velvety golden cashew cream sauce." },
      { name: "Subz Dum Handi", price: 220, description: "Seasonal mixed garden veggies simmered with curd, browned onions, and whole spices in a handi." },
      { name: "Palak Paneer", price: 230, description: "Fresh cottage cheese cubes simmered in a smooth, garlicky spiced spinach puree." },
      { name: "Paneer Lababdar", price: 260, description: "Grated and diced paneer cooked in a rich onion-tomato masala with a hint of dried fenugreek." },
      { name: "Matar Paneer", price: 220, description: "Classic homestyle curry made with sweet green peas and soft paneer in spiced gravy." },
      { name: "Paneer Tikka Masala Gravy", price: 270, description: "Charcoal-grilled paneer tikka chunks immersed in a thick, spicy onion-tomato gravy." },
      { name: "Methi Malai Matar", price: 240, description: "Fragrant fresh fenugreek leaves and green peas simmered in a rich sweet-savory cream gravy." },
      { name: "Kaju Curry Masala", price: 290, description: "Roasted cashew nuts cooked in a royal rich roasted onion and tomato masala." },
      { name: "Soya Chaap Masala", price: 220, description: "Tender soya chaap chunks cooked in a hearty, robust north-Indian style spicy curry." },
      { name: "Soya Malai Chaap Gravy", price: 240, description: "Mild, creamy soya chaap curry prepared with cashew cream, green cardamom, and curd." },
      { name: "Mushroom Do Pyaza", price: 230, description: "Fresh button mushrooms cooked with generous amounts of caramelized and diced onions." },
      { name: "Kadhai Mushroom", price: 240, description: "Button mushrooms and bell peppers cooked with freshly ground kadhai spices." },
      { name: "Dum Aloo Kashmiri", price: 210, description: "Baby potatoes slow-cooked in a tangy, spicy Kashmiri red chilli and fennel yogurt gravy." },
      { name: "Chana Masala Rawalpindi", price: 190, description: "Dark rustic chickpeas boiled with tea leaves and tempered with pomegranate seeds and cumin." },
      { name: "Mix Vegetable Korma", price: 210, description: "Assorted vegetables simmered in a mild, aromatic coconut and cashew nut gravy." },
      { name: "Bhindi Do Pyaza", price: 180, description: "Crispy okra stir-fried with two varieties of onions, amchur powder, and spices." }
    ]
  },
  {
    name: "MAIN COURSE",
    items: [
      { name: "Butter Chicken", price: 320, description: "Char-grilled boneless tandoori chicken cooked in velvety tomato, butter, and dried fenugreek gravy." },
      { name: "Chicken Tikka Masala", price: 290, description: "Smoked tandoori chicken tikka chunks cooked in a thick spicy onion-tomato masala gravy." },
      { name: "Mutton Rogan Josh", price: 380, description: "Traditional Kashmiri delicacy cooked with tender goat meat, ratan jot, and aromatic fennel." },
      { name: "Handi Chicken", price: 280, description: "Country style chicken cooked in clay pot with whole spices and thick aromatic gravy." },
      { name: "Kadhai Chicken", price: 270, description: "Chicken cooked with bell peppers and roasted coriander seeds in a wok." },
      { name: "Chicken Korma Awadhi", price: 310, description: "Tender chicken simmered in a velvety sauce of caramelized onions, yogurt, and kewra." },
      { name: "Chicken Rara Punjabi", price: 330, description: "Chicken pieces cooked with spiced minced chicken keema in rich gravy." },
      { name: "Chicken Curry Home Style", price: 260, description: "Comforting homestyle chicken curry cooked with onions, tomatoes, and ginger-garlic paste." },
      { name: "Murgh Lababdar", price: 310, description: "Boneless chicken simmered in rich makhani gravy with chopped capsicum and coriander." },
      { name: "Chicken Saagwala", price: 290, description: "Tender chicken pieces cooked in a spiced, smooth mustard and spinach puree." },
      { name: "Bhuna Mutton Masala", price: 390, description: "Succulent mutton pieces slow-roasted with whole spices until dark and intensely flavorful." },
      { name: "Mutton Korma Shahi", price: 410, description: "Royal mild mutton curry infused with cashew paste, saffron threads, and cardamom." },
      { name: "Mutton Rara Gosht", price: 420, description: "Delightful combination of mutton chunks and minced mutton simmered in rich gravy." },
      { name: "Fish Curry Bengali Style", price: 320, description: "Tender fish steaks simmered in a light mustard oil, kalonji, and tomato gravy." },
      { name: "Fish Tikka Masala", price: 350, description: "Char-grilled fish tikka tossed in a spicy, tangy onion-tomato masala." },
      { name: "Prawns Masala Gravy", price: 390, description: "Juicy prawns cooked in spicy onion, tomato, and coconut masala gravy." },
      { name: "Egg Curry Masala", price: 180, description: "Fried boiled eggs cooked in spicy north-Indian onion-tomato gravy." },
      { name: "Keema Matar Gravy", price: 340, description: "Minced lamb cooked with sweet green peas, ginger, and aromatic whole spices." }
    ]
  },
  {
    name: "DAL & LENTILS",
    items: [
      { name: "Dal Makhani", price: 210, description: "Whole black lentils and kidney beans slow-cooked overnight over embers with butter and cream." },
      { name: "Dal Tadka Double Roti", price: 160, description: "Yellow lentils tempered with ghee, cumin seeds, garlic, and dry Kashmiri red chillies." },
      { name: "Dal Fry", price: 140, description: "Homestyle yellow toor dal tempered with tomatoes, onions, green chillies, and fresh coriander." },
      { name: "Dal Panchmel", price: 190, description: "Traditional combination of five lentils slow-cooked with pure ghee and hing." },
      { name: "Yellow Dal Palak", price: 170, description: "Nutritious toor dal cooked with tender shredded spinach and garlic tadka." },
      { name: "Dhaba Style Dal Tadka", price: 175, description: "Smoky chana and toor dal tempered with desi ghee and whole red chillies." },
      { name: "Dal Bukhara Special", price: 250, description: "Creamy slow-simmered whole urad dal cooked with fresh tomato puree and white butter." },
      { name: "Chana Dal Tadka", price: 150, description: "Split Bengal gram tempered with ginger, garlic, and roasted whole cumin seeds." },
      { name: "Moong Dal Mughlai", price: 165, description: "Mild and soothing yellow moong dal cooked with milk, saffron, and mild spices." },
      { name: "Gujarati Sweet & Sour Dal", price: 160, description: "Tangy toor dal cooked with jaggery, kokum, peanuts, and mustard seeds." },
      { name: "Sambar South Special", price: 120, description: "Aromatic lentil stew cooked with drumsticks, shallots, tamarind, and sambar masala." },
      { name: "Maa Ki Dal Homestyle", price: 180, description: "Rustic black gram cooked homestyle with ginger, garlic, and freshly churned butter." },
      { name: "Dal Maharani", price: 220, description: "Rich lentil dish prepared with whole black lentils, cream, and shahi spices." },
      { name: "Garlic Jeera Dal", price: 155, description: "Yellow dal double-tempered with burnt golden garlic and cumin in pure ghee." },
      { name: "Tomato Dal Tadka", price: 150, description: "Tangy lentil preparation tempered with juicy roasted tomatoes and curry leaves." },
      { name: "Urad Dal Fry", price: 165, description: "White urad lentils cooked till creamy and tempered with green chillies and ginger." }
    ]
  },
  {
    name: "TANDOORI ROTI & NAAN",
    items: [
      { name: "Butter Naan", price: 55, description: "Soft leavened flatbread brushed with molten butter straight out of the clay oven." },
      { name: "Garlic Naan", price: 70, description: "Tandoor baked naan topped with crushed roasted garlic cloves and fresh chopped coriander." },
      { name: "Tandoori Roti Butter", price: 30, description: "Traditional whole wheat flour flatbread roasted crisp on tandoor walls and buttered." },
      { name: "Laccha Paratha", price: 60, description: "Multi-layered flaky whole wheat bread baked golden with ghee." },
      { name: "Plain Naan", price: 45, description: "Classic tandoor-baked leavened flatbread with a light chewy texture." },
      { name: "Cheese Garlic Naan", price: 95, description: "Naan stuffed with melted mozzarella cheese and topped with garlic and butter." },
      { name: "Chilli Garlic Naan", price: 75, description: "Spicy naan topped with fiery green chillies and roasted garlic flakes." },
      { name: "Kashmiri Sweet Naan", price: 90, description: "Sweet naan stuffed with crushed dry fruits, nuts, coconut, and cherry glaze." },
      { name: "Pudina Paratha", price: 65, description: "Crisp layered whole wheat paratha coated with aromatic dried mint leaves." },
      { name: "Tandoori Roti Plain", price: 25, description: "Crispy oil-free whole wheat roti baked in clay tandoor oven." },
      { name: "Missi Roti", price: 45, description: "Gram flour and whole wheat flatbread seasoned with ajwain, onions, and dry fenugreek." },
      { name: "Onion Kulcha", price: 70, description: "Soft leavened bread stuffed with spiced chopped onions and chaat masala." },
      { name: "Paneer Kulcha", price: 85, description: "Fluffy tandoor-baked bread stuffed with spiced crumbled cottage cheese." },
      { name: "Aloo Stuffed Kulcha", price: 65, description: "Traditional Amritsari style kulcha stuffed with spiced mashed potatoes." },
      { name: "Roomali Roti", price: 35, description: "Handkerchief-thin soft flatbread baked on an inverted domed tawa." },
      { name: "Butter Roomali Roti", price: 45, description: "Paper-thin delicate roomali roti glazed with melted salted butter." }
    ]
  },
  {
    name: "NOODLES & FRIED RICE",
    items: [
      { name: "Veg Hakka Noodles", price: 170, description: "Wok-tossed noodles with shredded cabbage, capsicum, carrots, and spring onions." },
      { name: "Schezwan Chicken Noodles", price: 210, description: "Fiery spicy noodles tossed with chicken bits in authentic Sichuan peppercorn sauce." },
      { name: "Veg Fried Rice", price: 160, description: "Fluffy steamed rice stir-fried with diced fresh vegetables and light soya." },
      { name: "Chicken Fried Rice", price: 200, description: "Classic wok-tossed rice with tender chicken cubes, scrambled egg, and scallions." },
      { name: "Chilli Garlic Veg Noodles", price: 180, description: "Noodles stir-fried with pungent burnt garlic, red chillies, and shredded greens." },
      { name: "Chilli Garlic Chicken Noodles", price: 210, description: "Wok-tossed chicken noodles bursting with aromatic roasted garlic and crushed red chillies." },
      { name: "Schezwan Veg Noodles", price: 180, description: "Spicy wok noodles tossed with julienned vegetables in fiery schezwan paste." },
      { name: "Egg Hakka Noodles", price: 190, description: "Stir-fried noodles with generous scrambled eggs, onions, and crunchy cabbage." },
      { name: "Egg Fried Rice", price: 180, description: "Aromatic basmati rice tossed with fluffy scrambled eggs and spring onions." },
      { name: "Schezwan Chicken Fried Rice", price: 220, description: "Long-grain rice stir-fried with tender chicken, egg, and spicy schezwan sauce." },
      { name: "Schezwan Veg Fried Rice", price: 175, description: "Zesty spicy rice loaded with vegetables and flavored with Sichuan peppers." },
      { name: "Singapore Veg Noodles", price: 185, description: "Thin rice vermicelli noodles tossed with yellow curry powder and mixed vegetables." },
      { name: "Singapore Chicken Noodles", price: 225, description: "Curry-flavored spicy thin noodles stir-fried with shredded chicken and eggs." },
      { name: "Burnt Garlic Veg Fried Rice", price: 170, description: "Fragrant wok rice tossed with deeply golden burnt garlic cloves and spring onions." },
      { name: "Burnt Garlic Chicken Fried Rice", price: 210, description: "Chicken fried rice infused with golden crunchy roasted garlic and scallions." },
      { name: "Mixed Non-Veg Fried Rice", price: 260, description: "Deluxe wok rice packed with tender chicken, egg, and sea prawns." }
    ]
  },
  {
    name: "SOUTH INDIAN CLASSICS",
    items: [
      { name: "Masala Dosa", price: 120, description: "Crisp fermented rice-lentil crepe filled with traditional spiced potato masala, served with sambar." },
      { name: "Mysore Masala Dosa", price: 140, description: "Golden crisp dosa spread with spicy red garlic-chilli chutney and loaded with potato bhaji." },
      { name: "Ghee Roast Paper Dosa", price: 160, description: "Paper-thin extra crispy large dosa roasted with generous pure desi ghee." },
      { name: "Medu Vada (2pc)", price: 80, description: "Crispy exterior and fluffy interior lentil fritters served with coconut chutney and hot sambar." },
      { name: "Plain Dosa", price: 90, description: "Classic golden fermented crepe roasted crisp on tawa, served with two chutneys." },
      { name: "Onion Rava Masala Dosa", price: 150, description: "Crisp semolina crepe studded with chopped onions, green chillies, and potato filling." },
      { name: "Paneer Masala Dosa", price: 160, description: "Crispy dosa filled with spiced crumbled cottage cheese, onions, and curry leaves." },
      { name: "Cheese Burst Dosa", price: 175, description: "Crisp crepe loaded with molten mozzarella and cheddar cheese with sweet corn." },
      { name: "Gunpowder Podi Dosa", price: 130, description: "Spicy roasted lentil spice blend (idli podi) and ghee spread over crisp golden dosa." },
      { name: "Steamed Idli (2pc) with Sambar", price: 70, description: "Soft and fluffy steamed fermented rice cakes served with hot sambar and coconut dip." },
      { name: "Ghee Podi Idli", price: 110, description: "Bite-sized button idlis tossed with desi ghee and fiery gunpowder podi masala." },
      { name: "Onion Tomato Uttapam", price: 120, description: "Thick savory rice pancake topped with chopped onions, tomatoes, and coriander." },
      { name: "Mixed Vegetable Uttapam", price: 130, description: "Soft fermented thick pancake topped with grated carrots, capsicum, onions, and chillies." },
      { name: "Paneer Cheese Uttapam", price: 150, description: "Thick savory pancake loaded with grated paneer and melted cheese." },
      { name: "Sambar Vada (2pc)", price: 90, description: "Crispy lentil donuts dipped in piping hot, aromatic lentil and vegetable sambar." },
      { name: "Curd Rice with Tadka", price: 120, description: "Creamy comforting yogurt rice tempered with mustard seeds, curry leaves, and ginger." }
    ]
  },
  {
    name: "ROLLS & WRAPS",
    items: [
      { name: "Paneer Tikka Roll", price: 150, description: "Char-grilled paneer, sliced peppers, onions, and mint mayo wrapped in soft paratha." },
      { name: "Double Egg Chicken Roll", price: 190, description: "Flaky paratha lined with two eggs and stuffed with spicy shredded chicken and tangy onions." },
      { name: "Mutton Seekh Roll", price: 220, description: "Spicy roasted minced mutton seekh kebab wrapped with chaat masala and mint chutney." },
      { name: "Veg Kathi Roll", price: 120, description: "Mixed garden vegetables stir-fried with Indian spices rolled in a crisp wheat paratha." },
      { name: "Soya Chaap Tikka Roll", price: 140, description: "Grilled marinated soya chaap pieces wrapped with mint chutney and crunchy onion rings." },
      { name: "Achari Paneer Roll", price: 160, description: "Pickle-spiced cottage cheese wrapped in flaky paratha with shredded cabbage and mayo." },
      { name: "Malai Chaap Roll", price: 150, description: "Mild creamy soya chaap wrapped in rumali roti with cashew spread and herbs." },
      { name: "Single Egg Single Chicken Roll", price: 160, description: "Egg paratha stuffed with juicy boneless chicken cubes and tangy kasundi mustard." },
      { name: "Chicken Malai Tikka Roll", price: 200, description: "Tender cashew-marinated chicken tikka wrapped in paratha with garlic dip." },
      { name: "Chilli Chicken Kathi Roll", price: 180, description: "Indo-Chinese style chilli chicken wrapped in egg-lined crispy paratha." },
      { name: "Chicken Seekh Kebab Roll", price: 195, description: "Juicy tandoori chicken seekh kebabs rolled with mint sauce and pickled shallots." },
      { name: "Double Chicken Double Egg Roll", price: 230, description: "Loaded roll with double portion of spiced chicken and two eggs in flaky paratha." },
      { name: "Mutton Boti Kebab Roll", price: 250, description: "Charcoal-grilled tender boneless lamb chunks wrapped in hot buttered rumali roti." },
      { name: "Crispy Corn & Cheese Roll", price: 140, description: "Crunchy fried sweet corn and molten cheese rolled with chipotle spread." },
      { name: "Mushroom Tikka Roll", price: 150, description: "Tandoor grilled spiced button mushrooms rolled with coriander chutney and onions." },
      { name: "Schezwan Veg Roll", price: 130, description: "Spicy stir-fried vegetables and noodles seasoned with schezwan sauce wrapped in paratha." }
    ]
  },
  {
    name: "BEVERAGES & SHAKES",
    items: [
      { name: "Mango Lassi", price: 90, description: "Thick chilled yogurt beverage blended with sweet Alphonso mango pulp and cardamom." },
      { name: "Fresh Lime Soda", price: 60, description: "Refreshing bubbly soda seasoned with fresh squeezed lime, sugar syrup, and black rock salt." },
      { name: "Cold Coffee with Ice Cream", price: 120, description: "Thick hand-beaten cold coffee topped with a creamy scoop of vanilla ice cream." },
      { name: "Masala Chaas", price: 50, description: "Spiced buttermilk tempered with roasted cumin, rock salt, ginger, and fresh mint." },
      { name: "Sweet Lassi Special", price: 75, description: "Traditional thick Punjabi churned curd sweetened and topped with clotted malai." },
      { name: "Salted Mint Lassi", price: 75, description: "Chilled savory yogurt drink blended with crushed mint leaves and black salt." },
      { name: "Chocolate Thick Shake", price: 130, description: "Rich creamy chocolate milkshake blended with dark cocoa and chocolate syrup." },
      { name: "Oreo Crunch Milkshake", price: 140, description: "Thick milkshake blended with real Oreo cookies and topped with cookie crumble." },
      { name: "Strawberry Milkshake", price: 120, description: "Chilled milk blended with sweet strawberry puree and vanilla ice cream." },
      { name: "Vanilla Thick Shake", price: 110, description: "Classic smooth and creamy milkshake made with rich Madagascar vanilla ice cream." },
      { name: "Virgin Mojito Mint", price: 110, description: "Sparkling soda muddled with fresh mint leaves, lime wedges, and brown sugar." },
      { name: "Blue Lagoon Mocktail", price: 120, description: "Vibrant citrus mocktail with blue curacao syrup, lemon juice, and fizzy sprite." },
      { name: "Watermelon Mint Cooler", price: 110, description: "Freshly crushed sweet watermelon juice with lime juice and cooling mint leaves." },
      { name: "Masala Lemonade", price: 65, description: "Tangy Indian lemonade spiced with roasted cumin, black salt, and ginger extract." },
      { name: "Masala Chai", price: 40, description: "Piping hot milk tea brewed with crushed ginger, green cardamom, and cinnamon." },
      { name: "Filter Coffee", price: 50, description: "Authentic South-Indian chicory-blend frothed drip coffee served in traditional dabara." },
      { name: "Iced Lemon Tea", price: 80, description: "Chilled black tea infused with fresh lemon juice, mint, and crushed ice." }
    ]
  },
  {
    name: "DESSERTS & SWEETS",
    items: [
      { name: "Gulab Jamun (2pc)", price: 80, description: "Soft fried mawa dough balls dipped in warm saffron, rose water, and cardamom sugar syrup." },
      { name: "Kesar Rasmalai (2pc)", price: 110, description: "Spongy cottage cheese patties steeped in thickened saffron-flavoured pistachio milk." },
      { name: "Gajar Ka Halwa", price: 100, description: "Traditional winter delicacy made from slow-cooked grated red carrots, khoya, and dry fruits." },
      { name: "Warm Brownie with Ice Cream", price: 150, description: "Warm gooey dark chocolate walnut brownie served with vanilla ice cream and hot fudge." },
      { name: "Matka Kulfi Pista", price: 90, description: "Traditional rich condensed milk kulfi set in small clay pot with pistachios and saffron." },
      { name: "Rabdi Jalebi", price: 120, description: "Crisp hot golden jalebis soaked in syrup and served with rich creamy rabdi." },
      { name: "Shahi Tukda Awadhi", price: 110, description: "Royal fried bread drenched in fragrant sugar syrup and topped with condensed milk." },
      { name: "Moong Dal Halwa", price: 120, description: "Decadent dessert made with ground yellow moong dal slow-cooked in pure desi ghee." },
      { name: "Rasgulla (2pc)", price: 70, description: "Classic Bengali spongy chenna dumplings soaked in light, clear cardamom sugar syrup." },
      { name: "Angoori Gulab Jamun with Rabdi", price: 130, description: "Bite-sized mini gulab jamuns served submerged in chilled sweetened saffron rabdi." },
      { name: "Kesar Phirni", price: 95, description: "Creamy ground rice pudding slow-cooked in milk, scented with saffron and cardamom." },
      { name: "Vanilla Ice Cream Scoop", price: 60, description: "Velvety smooth premium double vanilla cream scoop topped with chocolate sauce." },
      { name: "Chocolate Fudge Sundae", price: 140, description: "Double chocolate scoops layered with crushed brownies, hot fudge, and roasted nuts." },
      { name: "Butterscotch Ice Cream Scoop", price: 70, description: "Creamy butterscotch ice cream loaded with crunchy caramel praline nuggets." },
      { name: "Rajbhog (2pc)", price: 90, description: "Jumbo saffron-flavored cottage cheese balls stuffed with almonds, pistachios, and mawa." },
      { name: "Sizzling Chocolate Brownie", price: 170, description: "Gooey chocolate brownie served on a sizzling hot iron skillet with ice cream and hot sauce." }
    ]
  }
];

module.exports = {
  DEFAULT_TODAY_SPECIAL_ITEMS,
  DEFAULT_15_CATEGORIES
};
