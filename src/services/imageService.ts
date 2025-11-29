// Image service for fetching beautiful images from Unsplash
const UNSPLASH_ACCESS_KEY = "VpcO2KyXiMrp42IyGhVkD9jFKCd_L4pDbgC_VCzcgoA";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export class ImageService {
  private static cache = new Map<string, UnsplashImage[]>();

  // Method to clear the cache when switching states
  static clearCache(): void {
    console.log('Clearing image cache due to state change');
    this.cache.clear();
  }

  static async getPlaceImages(placeName: string, count: number = 3): Promise<UnsplashImage[]> {
    const cacheKey = `place_${placeName}_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Enhanced search query for better results
      const searchQuery = this.getOptimizedSearchQuery(placeName);
      console.log(`🔍 Searching for images: "${searchQuery}"`);
      
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`❌ API request failed with status: ${response.status}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const images = data.results || [];
      console.log(`✅ Found ${images.length} images for "${placeName}"`);
      if (images.length > 0) {
        console.log(`📸 First image URL: ${images[0].urls.regular}`);
      }
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error(`❌ Error fetching images for "${placeName}":`, error);
      console.log(`🔄 Using fallback images for "${placeName}"`);
      return this.getFallbackImages(count);
    }
  }

  private static getOptimizedSearchQuery(placeName: string): string {
    // Special handling for Andhra Pradesh places
    const apPlaceMappings: Record<string, string> = {
      'Araku Valley': 'Araku Valley Andhra Pradesh coffee plantation hills',
      'Borra Caves': 'Borra Caves Andhra Pradesh limestone caves stalactites',
      'Belum Caves': 'Belum Caves Andhra Pradesh underground caves',
      'Tirupati': 'Tirupati Temple Andhra Pradesh Venkateswara temple',
      'Visakhapatnam': 'Visakhapatnam Andhra Pradesh beach city',
      'Gandikota': 'Gandikota Andhra Pradesh grand canyon fort',
      'Undavalli Caves': 'Undavalli Caves Andhra Pradesh rock cut caves',
      'Kanaka Durga Temple': 'Kanaka Durga Temple Vijayawada Andhra Pradesh',
      'Prakasam Barrage': 'Prakasam Barrage Vijayawada Andhra Pradesh',
      'Srisailam': 'Srisailam Temple Andhra Pradesh Jyotirlinga',
      'Papikondalu': 'Papikondalu Andhra Pradesh Godavari gorge',
      'Horseley Hills': 'Horseley Hills Andhra Pradesh hill station',
      'Lambasingi': 'Lambasingi Andhra Pradesh Kashmir of Andhra',
      'Talakona Waterfalls': 'Talakona Waterfalls Andhra Pradesh',
      'Ethipothala Waterfalls': 'Ethipothala Waterfalls Andhra Pradesh',
      'Kondapalli Fort': 'Kondapalli Fort Andhra Pradesh',
      'Draksharamam Temple': 'Draksharamam Temple Andhra Pradesh',
      'Sir Arthur Cotton Museum': 'Sir Arthur Cotton Museum Rajahmundry Andhra Pradesh',
      'Godavari Bridge': 'Godavari Bridge Rajahmundry Andhra Pradesh',
      'Mantralayam': 'Mantralayam Andhra Pradesh Raghavendra Swamy temple pilgrimage',
      'Kolleru Lake': 'Kolleru Lake Andhra Pradesh bird sanctuary',
      'Pulicat Lake': 'Pulicat Lake Andhra Pradesh flamingos',
      'Konda Reddy Fort': 'Konda Reddy Fort Kurnool Andhra Pradesh',
      'Gooty Fort': 'Gooty Fort Andhra Pradesh hill fort',
      'Maredumilli': 'Maredumilli Andhra Pradesh eco tourism bamboo chicken',
      'Rampa Waterfalls': 'Rampa Waterfalls Andhra Pradesh East Godavari',
      'Thotlakonda': 'Thotlakonda Buddhist site Andhra Pradesh',
      'Bavikonda': 'Bavikonda Buddhist site Andhra Pradesh',
      'Kambalakonda Wildlife Sanctuary': 'Kambalakonda Wildlife Sanctuary Visakhapatnam'
    };

    // Special handling for Telangana places
    const tgPlaceMappings: Record<string, string> = {
      'Charminar': 'Charminar Hyderabad Telangana historical monument landmark',
      'Golconda Fort': 'Golconda Fort Hyderabad Telangana Qutb Shahi dynasty',
      'Ramoji Film City': 'Ramoji Film City Hyderabad Telangana film studio theme park',
      'Birla Mandir': 'Birla Mandir Hyderabad Telangana white marble temple',
      'Hussain Sagar Lake & Buddha Statue': 'Hussain Sagar Lake Buddha Statue Hyderabad Telangana',
      'Warangal Fort': 'Warangal Fort Telangana Kakatiya dynasty historical',
      'Ramappa Temple': 'Ramappa Temple Telangana UNESCO World Heritage floating bricks',
      'Thousand Pillar Temple': 'Thousand Pillar Temple Hanamkonda Telangana Chalukya architecture',
      'Kuntala Waterfall': 'Kuntala Waterfall Telangana highest waterfall natural',
      'Bogatha Waterfall': 'Bogatha Waterfall Telangana Niagara of Telangana eco tourism',
      'Nagarjuna Sagar Dam & Ethipothala Waterfalls': 'Nagarjuna Sagar Dam Telangana masonry dam reservoir',
      'Ananthagiri Hills': 'Ananthagiri Hills Telangana hill station trekking forest',
      'Yadadri (Yadagirigutta) Lakshmi Narasimha Temple': 'Yadagirigutta Temple Telangana Lakshmi Narasimha pilgrimage',
      'Medak Cathedral': 'Medak Cathedral Telangana largest church Asia neo-Gothic',
      'Bhongir Fort': 'Bhongir Fort Telangana Chalukyan historical fort trekking',
      'Basar Saraswati Temple': 'Basar Saraswati Temple Telangana Godavari riverbank pilgrimage',
      'Pocharam Wildlife Sanctuary': 'Pocharam Wildlife Sanctuary Telangana blackbuck wildlife eco tourism',
      'Nehru Zoological Park': 'Nehru Zoological Park Hyderabad Telangana largest zoo India',
      'Sri Rama Chandra Temple': 'Bhadrachalam Temple Telangana Lord Rama Godavari river',
      'Pakhal Lake & Wildlife Sanctuary': 'Pakhal Lake Telangana Kakatiya dynasty wildlife sanctuary'
    };

    // Special handling for Karnataka places
    const kaPlaceMappings: Record<string, string> = {
      'Hampi': 'Hampi Karnataka UNESCO World Heritage Vijayanagara ruins',
      'Mysore Palace (Amba Vilas Palace)': 'Mysore Palace Karnataka royal palace illumination',
      'Lalbagh Botanical Garden': 'Lalbagh Botanical Garden Bangalore Karnataka glasshouse',
      'Cubbon Park': 'Cubbon Park Bangalore Karnataka urban green space',
      'Bangalore Palace': 'Bangalore Palace Bangalore Karnataka Tudor architecture',
      'Bannerghatta National Park': 'Bannerghatta National Park Bangalore Karnataka wildlife safari',
      'Coorg (Madikeri)': 'Coorg Karnataka hill station coffee plantations',
      'Jog Falls': 'Jog Falls Karnataka highest segmented waterfall',
      'Gokarna': 'Gokarna Karnataka beach pilgrimage temple',
      'Udupi': 'Udupi Karnataka Krishna temple cuisine',
      'Mangalore': 'Mangalore Karnataka beach city seafood',
      'Badami, Aihole & Pattadakal': 'Badami Aihole Pattadakal Karnataka Chalukya temples UNESCO',
      'Belur & Halebidu': 'Belur Halebidu Karnataka Hoysala temples stone carving',
      'Shravanabelagola': 'Shravanabelagola Karnataka Gommateshwara statue Jain pilgrimage',
      'Bandipur National Park': 'Bandipur National Park Karnataka tiger reserve wildlife',
      'Nagarhole National Park / Kabini': 'Nagarhole Kabini Karnataka wildlife sanctuary river',
      'Dandeli & Kali River': 'Dandeli Kali River Karnataka adventure sports wildlife',
      'Kudremukh': 'Kudremukh Karnataka hill station trekking national park',
      'Chikmagalur (Mullayanagiri, Baba Budangiri, Hebbe Falls)': 'Chikmagalur Karnataka hill station coffee estates',
      'Agumbe': 'Agumbe Karnataka rainforest sunset point biodiversity',
      'Murudeshwar': 'Murudeshwar Karnataka Shiva statue beach temple',
      'Karwar & Devbagh': 'Karwar Devbagh Karnataka beach islands eco tourism',
      'Srirangapatna': 'Srirangapatna Karnataka Tipu Sultan palace temple',
      'B R Hills (Biligiriranga Hills)': 'BR Hills Karnataka wildlife sanctuary tiger reserve',
      'Honnemaradu': 'Honnemaradu Karnataka water sports eco tourism',
      'Chitradurga Fort': 'Chitradurga Fort Karnataka seven circles historical',
      'Sringeri Sharada Peetham': 'Sringeri Karnataka Adi Shankaracharya monastery temple',
      'Kali Tiger Reserve': 'Kali Tiger Reserve Karnataka wildlife sanctuary tiger'
    };

    // Special handling for Rajasthan places
    const rjPlaceMappings: Record<string, string> = {
      'Amber Fort, Jaipur (Rajasthan)': 'Amber Fort Jaipur Rajasthan UNESCO World Heritage',
      'Hawa Mahal, Jaipur (Rajasthan)': 'Hawa Mahal Jaipur Rajasthan pink city landmark',
      'City Palace, Jaipur (Rajasthan)': 'City Palace Jaipur Rajasthan royal residence museum',
      'Jantar Mantar, Jaipur (Rajasthan)': 'Jantar Mantar Jaipur Rajasthan astronomical observatory UNESCO',
      'City Palace, Udaipur (Rajasthan)': 'City Palace Udaipur Rajasthan lake palace complex',
      'Lake Pichola, Udaipur (Rajasthan)': 'Lake Pichola Udaipur Rajasthan boat rides palace',
      'Jaisalmer Fort (Sonar Quila), Jaisalmer (Rajasthan)': 'Jaisalmer Fort Rajasthan golden fort living fort',
      'Sam Sand Dunes, Jaisalmer (Rajasthan)': 'Sam Sand Dunes Jaisalmer Rajasthan desert camel safari',
      'Mehrangarh Fort, Jodhpur (Rajasthan)': 'Mehrangarh Fort Jodhpur Rajasthan blue city fort',
      'Umaid Bhawan Palace, Jodhpur (Rajasthan)': 'Umaid Bhawan Palace Jodhpur Rajasthan luxury hotel',
      'Pushkar Lake, Pushkar (Rajasthan)': 'Pushkar Lake Rajasthan sacred lake pilgrimage',
      'Brahma Temple, Pushkar (Rajasthan)': 'Brahma Temple Pushkar Rajasthan only Brahma temple',
      'Ajmer Sharif Dargah, Ajmer (Rajasthan)': 'Ajmer Sharif Dargah Rajasthan Sufi shrine pilgrimage',
      'Chittorgarh Fort, Chittorgarh (Rajasthan)': 'Chittorgarh Fort Rajasthan UNESCO World Heritage',
      'Ranthambore National Park, Sawai Madhopur (Rajasthan)': 'Ranthambore National Park Rajasthan tiger reserve',
      'Keoladeo National Park, Bharatpur (Rajasthan)': 'Keoladeo National Park Bharatpur Rajasthan bird sanctuary',
      'Sariska Tiger Reserve, Alwar (Rajasthan)': 'Sariska Tiger Reserve Rajasthan wildlife sanctuary',
      'Bhangarh Fort, Alwar (Rajasthan)': 'Bhangarh Fort Rajasthan haunted fort historical',
      'Mount Abu, Sirohi (Rajasthan)': 'Mount Abu Rajasthan hill station Dilwara temples',
      'Dilwara Temples, Mount Abu (Rajasthan)': 'Dilwara Temples Mount Abu Rajasthan Jain marble temples',
      'Junagarh Fort, Bikaner (Rajasthan)': 'Junagarh Fort Bikaner Rajasthan unconquered fort',
      'Camel Breeding Farm, Bikaner (Rajasthan)': 'Camel Breeding Farm Bikaner Rajasthan research center',
      'Karni Mata Temple (Rat Temple), Deshnoke (Rajasthan)': 'Karni Mata Temple Bikaner Rajasthan rat temple',
      'Shekhawati Region (Nawalgarh, Mandawa, Jhunjhunu) (Rajasthan)': 'Shekhawati Rajasthan painted havelis heritage',
      'Kumbhalgarh Fort, Rajsamand (Rajasthan)': 'Kumbhalgarh Fort Rajasthan UNESCO World Heritage',
      'Ranakpur Jain Temple, Pali (Rajasthan)': 'Ranakpur Jain Temple Rajasthan marble temple pillars',
      'Banswara (City of Hundred Islands) (Rajasthan)': 'Banswara Rajasthan hundred islands lake',
      'Gagron Fort, Jhalawar (Rajasthan)': 'Gagron Fort Rajasthan water fort UNESCO',
      'Alwar City Palace, Alwar (Rajasthan)': 'Alwar City Palace Rajasthan museum artifacts',
      'Fateh Sagar Lake, Udaipur (Rajasthan)': 'Fateh Sagar Lake Udaipur Rajasthan second largest lake',
      'Saheliyon Ki Bari, Udaipur (Rajasthan)': 'Saheliyon Ki Bari Udaipur Rajasthan queen garden',
      'Eklingji Temple, Udaipur (Rajasthan)': 'Eklingji Temple Udaipur Rajasthan Shiva temple',
      'Nathdwara Temple, Rajsamand (Rajasthan)': 'Nathdwara Temple Rajasthan Krishna temple',
      'Desert National Park, Jaisalmer (Rajasthan)': 'Desert National Park Jaisalmer Rajasthan Great Indian Bustard',
      'Kuldhara Village, Jaisalmer (Rajasthan)': 'Kuldhara Village Jaisalmer Rajasthan ghost village',
      'Mandore Gardens, Jodhpur (Rajasthan)': 'Mandore Gardens Jodhpur Rajasthan cenotaphs',
      'Osian Temples, Jodhpur (Rajasthan)': 'Osian Temples Jodhpur Rajasthan desert temples'
    };

    // Special handling for Goa places
    const gaPlaceMappings: Record<string, string> = {
      'Palolem Beach, South Goa': 'Palolem Beach Goa crescent shaped beach',
      'Baga Beach, North Goa': 'Baga Beach Goa nightlife water sports',
      'Calangute Beach': 'Calangute Beach Goa queen of beaches',
      'Anjuna Beach': 'Anjuna Beach Goa flea market nightlife',
      'Vagator Beach': 'Vagator Beach Goa Chapora Fort sunset',
      'Arambol Beach': 'Arambol Beach Goa hippie beach',
      'Colva Beach': 'Colva Beach Goa white sand beach',
      'Benaulim Beach': 'Benaulim Beach Goa peaceful beach',
      'Candolim Beach': 'Candolim Beach Goa Fort Aguada',
      'Sinquerim Beach': 'Sinquerim Beach Goa water sports',
      'Dudhsagar Falls': 'Dudhsagar Falls Goa four tiered waterfall',
      'Basilica of Bom Jesus': 'Basilica of Bom Jesus Goa UNESCO World Heritage',
      'Se Cathedral': 'Se Cathedral Goa largest church Asia',
      'Church of Our Lady of the Immaculate Conception': 'Church of Our Lady Goa Panjim white church',
      'Fort Aguada': 'Fort Aguada Goa Portuguese fort lighthouse',
      'Chapora Fort': 'Chapora Fort Goa Dil Chahta Hai movie',
      'Reis Magos Fort': 'Reis Magos Fort Goa Portuguese fort',
      'Dudhsagar Plantation': 'Dudhsagar Plantation Goa spice plantation',
      'Spice Plantation Tours': 'Spice Plantation Goa cardamom pepper tours',
      'Old Goa': 'Old Goa UNESCO World Heritage churches',
      'Panjim': 'Panjim Goa capital city Portuguese architecture',
      'Margao': 'Margao Goa commercial capital',
      'Mapusa': 'Mapusa Goa Friday market',
      'Ponda': 'Ponda Goa temples spice plantations',
      'Chandor': 'Chandor Goa Braganza House Portuguese mansion',
      'Loutolim': 'Loutolim Goa Big Foot museum',
      'Quepem': 'Quepem Goa rural Goa experience',
      'Canacona': 'Canacona Goa Palolem beach',
      'Pernem': 'Pernem Goa Arambol beach',
      'Sattari': 'Sattari Goa Dudhsagar falls'
    };

    // Special handling for Tamil Nadu places
    const tnPlaceMappings: Record<string, string> = {
      'Meenakshi Amman Temple': 'Meenakshi Amman Temple Madurai Tamil Nadu gopuram',
      'Brihadeeswarar Temple': 'Brihadeeswarar Temple Thanjavur Tamil Nadu UNESCO World Heritage',
      'Mahabalipuram': 'Mahabalipuram Tamil Nadu UNESCO World Heritage shore temple',
      'Kodaikanal': 'Kodaikanal Tamil Nadu hill station lake',
      'Ooty': 'Ooty Tamil Nadu hill station tea gardens',
      'Kanyakumari': 'Kanyakumari Tamil Nadu Vivekananda Rock Memorial',
      'Rameshwaram': 'Rameshwaram Tamil Nadu Ramanathaswamy Temple',
      'Madurai': 'Madurai Tamil Nadu Meenakshi Temple city',
      'Chennai': 'Chennai Tamil Nadu Marina Beach capital',
      'Coimbatore': 'Coimbatore Tamil Nadu textile city',
      'Tiruchirappalli': 'Tiruchirappalli Tamil Nadu Rock Fort Temple',
      'Salem': 'Salem Tamil Nadu steel city',
      'Tirunelveli': 'Tirunelveli Tamil Nadu Nellaiappar Temple',
      'Erode': 'Erode Tamil Nadu turmeric city',
      'Thanjavur': 'Thanjavur Tamil Nadu Brihadeeswarar Temple',
      'Kumbakonam': 'Kumbakonam Tamil Nadu temple city',
      'Chidambaram': 'Chidambaram Tamil Nadu Nataraja Temple',
      'Kanchipuram': 'Kanchipuram Tamil Nadu silk sarees temples',
      'Mamallapuram': 'Mamallapuram Tamil Nadu Mahabalipuram shore temple',
      'Yercaud': 'Yercaud Tamil Nadu hill station coffee',
      'Hogenakkal Falls': 'Hogenakkal Falls Tamil Nadu Kaveri river',
      'Courtallam': 'Courtallam Tamil Nadu waterfalls',
      'Kolli Hills': 'Kolli Hills Tamil Nadu hill station',
      'Valparai': 'Valparai Tamil Nadu tea plantations',
      'Ponmudi': 'Ponmudi Tamil Nadu hill station',
      'Auroville': 'Auroville Tamil Nadu experimental township',
      'Pondicherry': 'Pondicherry Tamil Nadu French colony',
      'Tiruvannamalai': 'Tiruvannamalai Tamil Nadu Arunachaleswarar Temple'
    };

    // Special handling for Kerala places
    const klPlaceMappings: Record<string, string> = {
      'Kochi': 'Kochi Kerala backwaters Chinese fishing nets',
      'Munnar': 'Munnar Kerala hill station tea plantations',
      'Alleppey': 'Alleppey Kerala backwaters houseboats',
      'Thekkady': 'Thekkady Kerala Periyar National Park wildlife',
      'Kovalam': 'Kovalam Kerala beach lighthouse',
      'Varkala': 'Varkala Kerala beach cliff',
      'Wayanad': 'Wayanad Kerala hill station coffee plantations',
      'Kumarakom': 'Kumarakom Kerala backwaters bird sanctuary',
      'Bekal': 'Bekal Kerala beach fort',
      'Kozhikode': 'Kozhikode Kerala spice trade history',
      'Thiruvananthapuram': 'Thiruvananthapuram Kerala capital city',
      'Kannur': 'Kannur Kerala theyyam art form',
      'Kasaragod': 'Kasaragod Kerala Bekal Fort',
      'Palakkad': 'Palakkad Kerala Silent Valley National Park',
      'Thrissur': 'Thrissur Kerala Pooram festival',
      'Kollam': 'Kollam Kerala backwaters Ashtamudi Lake',
      'Idukki': 'Idukki Kerala hill station dam',
      'Malappuram': 'Malappuram Kerala Nilambur teak plantations',
      'Pathanamthitta': 'Pathanamthitta Kerala Sabarimala pilgrimage',
      'Kottayam': 'Kottayam Kerala backwaters Kumarakom',
      'Alappuzha': 'Alappuzha Kerala backwaters houseboats',
      'Ernakulam': 'Ernakulam Kerala Kochi city'
    };

    // Special handling for Maharashtra places
    const mhPlaceMappings: Record<string, string> = {
      'Mumbai': 'Mumbai Maharashtra Gateway of India Marine Drive',
      'Pune': 'Pune Maharashtra Shaniwar Wada hill station',
      'Aurangabad': 'Aurangabad Maharashtra Ajanta Ellora caves',
      'Nagpur': 'Nagpur Maharashtra orange city',
      'Nashik': 'Nashik Maharashtra Kumbh Mela Trimbakeshwar',
      'Kolhapur': 'Kolhapur Maharashtra Mahalaxmi Temple',
      'Solapur': 'Solapur Maharashtra textile city',
      'Amravati': 'Amravati Maharashtra cotton city',
      'Nanded': 'Nanded Maharashtra Hazur Sahib Gurudwara',
      'Sangli': 'Sangli Maharashtra sugar city',
      'Malegaon': 'Malegaon Maharashtra powerloom city',
      'Akola': 'Akola Maharashtra cotton city',
      'Latur': 'Latur Maharashtra earthquake city',
      'Dhule': 'Dhule Maharashtra textile city',
      'Ahmednagar': 'Ahmednagar Maharashtra historical city',
      'Chandrapur': 'Chandrapur Maharashtra coal mines',
      'Parbhani': 'Parbhani Maharashtra agricultural city',
      'Ichalkaranji': 'Ichalkaranji Maharashtra textile city',
      'Jalgaon': 'Jalgaon Maharashtra banana city',
      'Bhusawal': 'Bhusawal Maharashtra railway junction',
      'Amalner': 'Amalner Maharashtra textile city'
    };

    // Special handling for Uttar Pradesh places
    const upPlaceMappings: Record<string, string> = {
      'Taj Mahal': 'Taj Mahal Agra Uttar Pradesh UNESCO World Heritage white marble mausoleum',
      'Agra Fort': 'Agra Fort Uttar Pradesh red sandstone Mughal fort UNESCO World Heritage',
      'Fatehpur Sikri': 'Fatehpur Sikri Uttar Pradesh Mughal capital UNESCO World Heritage Buland Darwaza',
      'Itmad-ud-Daulah (Baby Taj)': 'Itmad-ud-Daulah Baby Taj Agra Uttar Pradesh pietra dura mausoleum',
      'Kashi Varanasi — Ghats & Ganga Aarti': 'Varanasi Ghats Ganga Aarti Uttar Pradesh spiritual city oldest living city',
      'Kashi Vishwanath Temple': 'Kashi Vishwanath Temple Varanasi Uttar Pradesh Shiva temple golden spire',
      'Sarnath': 'Sarnath Uttar Pradesh Buddhist pilgrimage Buddha first sermon Dhamek Stupa',
      'Ramnagar Fort': 'Ramnagar Fort Varanasi Uttar Pradesh Ganges riverbank museum vintage cars',
      'Bara Imambara (Asafi Imambara)': 'Bara Imambara Lucknow Uttar Pradesh Bhul Bhulaiya labyrinth Asafi Mosque',
      'Rumi Darwaza': 'Rumi Darwaza Lucknow Uttar Pradesh Awadhi architecture iconic gateway',
      'Chota Imambara': 'Chota Imambara Lucknow Uttar Pradesh ornate interiors chandeliers',
      'Mathura — Shri Krishna Janmabhoomi & Temples': 'Mathura Krishna Janmabhoomi Uttar Pradesh birthplace Lord Krishna temples',
      'Vrindavan — Banke Bihari Temple / ISKCON': 'Vrindavan Banke Bihari Temple ISKCON Uttar Pradesh Krishna devotional hub',
      'Ayodhya — Ram Janmabhoomi Complex': 'Ayodhya Ram Janmabhoomi Uttar Pradesh birthplace Lord Rama temple complex',
      'Prayagraj (Allahabad) — Triveni Sangam & Sangam Ghats': 'Prayagraj Triveni Sangam Uttar Pradesh confluence Ganga Yamuna Saraswati Kumbh Mela',
      'Kushinagar': 'Kushinagar Uttar Pradesh Buddhist pilgrimage Mahaparinirvana Buddha',
      'Dudhwa National Park': 'Dudhwa National Park Uttar Pradesh tiger reserve rhinoceros wildlife sanctuary',
      'Chitrakoot Dham': 'Chitrakoot Dham Uttar Pradesh Ramayana pilgrimage hills rivers temples',
      'Jhansi Fort & Rani Mahal': 'Jhansi Fort Rani Mahal Uttar Pradesh Rani Lakshmibai 1857 rebellion historical',
      'Bithoor (Kali & Brahmavart)': 'Bithoor Uttar Pradesh Ramayana pilgrimage Ganges river historical',
      'Vindhyachal — Vindhyavasini Temple & Scenic Spots': 'Vindhyachal Vindhyavasini Temple Uttar Pradesh hill pilgrimage Navratri',
      'Bara & Chota Sthambh / Historical sites in Bundelkhand': 'Orchha Bundelkhand Uttar Pradesh historical monuments palaces temples',
      'Lucknow — British Residency': 'British Residency Lucknow Uttar Pradesh 1857 rebellion historical ruins museum'
    };

    // Use specific mapping if available, otherwise use general search
    if (apPlaceMappings[placeName]) {
      return apPlaceMappings[placeName];
    }

    if (tgPlaceMappings[placeName]) {
      return tgPlaceMappings[placeName];
    }

    if (kaPlaceMappings[placeName]) {
      return kaPlaceMappings[placeName];
    }

    if (rjPlaceMappings[placeName]) {
      return rjPlaceMappings[placeName];
    }

    if (gaPlaceMappings[placeName]) {
      return gaPlaceMappings[placeName];
    }

    if (tnPlaceMappings[placeName]) {
      return tnPlaceMappings[placeName];
    }

    if (klPlaceMappings[placeName]) {
      return klPlaceMappings[placeName];
    }

    if (mhPlaceMappings[placeName]) {
      return mhPlaceMappings[placeName];
    }

    if (upPlaceMappings[placeName]) {
      return upPlaceMappings[placeName];
    }

    // Fallback to general search with location context
    return `${placeName} India tourism`;
  }

  static async getStateImages(stateName: string, count: number = 1): Promise<UnsplashImage[]> {
    const cacheKey = `state_${stateName}_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(stateName + ' india tourism landscape')}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error('Error fetching state images:', error);
      return this.getFallbackImages(count);
    }
  }

  static async getCategoryImages(category: string, count: number = 1): Promise<UnsplashImage[]> {
    const cacheKey = `category_${category}_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(category + ' india tourism')}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error('Error fetching category images:', error);
      return this.getFallbackImages(count);
    }
  }

  static async getBackgroundImages(count: number = 1): Promise<UnsplashImage[]> {
    const cacheKey = `background_${count}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=india tourism landscape beautiful&per_page=${count}&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      const images = data.results || [];
      
      this.cache.set(cacheKey, images);
      return images;
    } catch (error) {
      console.error('Error fetching background images:', error);
      return this.getFallbackImages(count);
    }
  }

  private static getFallbackImages(count: number): UnsplashImage[] {
    const fallbackImages: UnsplashImage[] = [];
    
    // Use multiple reliable fallback images
    const fallbackImageIds = [
      'photo-1506905925346-21bda4d32df4', // India landscape
      'photo-1578662996442-48f60103fc96', // India tourism
      'photo-1587474260584-136574881ed9', // India heritage
      'photo-1590736969955-71cc94901144', // India culture
      'photo-1587474260584-136574881ed9'  // India monuments
    ];
    
    for (let i = 0; i < count; i++) {
      const imageId = fallbackImageIds[i % fallbackImageIds.length];
      fallbackImages.push({
        id: `fallback_${i}`,
        urls: {
          small: `https://images.unsplash.com/${imageId}?w=400&h=300&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3`,
          regular: `https://images.unsplash.com/${imageId}?w=800&h=600&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3`,
          full: `https://images.unsplash.com/${imageId}?w=1200&h=800&fit=crop&crop=center&q=80&auto=format&ixlib=rb-4.0.3`
        },
        alt_description: 'Beautiful India landscape',
        user: { name: 'Unsplash' }
      });
    }
    
    return fallbackImages;
  }

  static getOptimizedImageUrl(image: UnsplashImage, size: 'small' | 'regular' | 'full' = 'regular'): string {
    return image.urls[size];
  }
}
