import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standardized column headers
const STANDARD_HEADERS = [
  'place_name',
  'category',
  'description',
  'timings',
  'entry_fee',
  'best_time',
  'nearest_railway',
  'nearest_bus',
  'nearest_airport',
  'metro_station',
  'accessibility',
  'guided_tours',
  'parking',
  'nearby_amenities',
  'official_website',
  'wikipedia',
  'special_notes'
];

// Category standardization mapping
const CATEGORY_MAPPING = {
  'Beach / Tourist Attraction': 'Beach',
  'Historical Fort / Tourist Attraction': 'Historical Fort',
  'Historical Monument / Fort': 'Historical Fort',
  'Historical Monument / Palace': 'Historical Palace',
  'Historical Monument / Observatory': 'Historical Observatory',
  'Hill Station / Tea Gardens / National Park gateway': 'Hill Station',
  'Backwaters / Houseboats / Beach': 'Backwaters',
  'Bird Sanctuary / Backwater destination': 'Bird Sanctuary',
  'Beach / Ayurveda destination': 'Beach',
  'Heritage / Colonial Fort area / Cultural zone': 'Heritage Site',
  'Wildlife Sanctuary / Eco-tourism / Lake': 'Wildlife Sanctuary',
  'Archaeological site / Hill area / Trekking spot': 'Archaeological Site',
  'Waterfalls / Scenic nature spot': 'Waterfall',
  'Historical Fort / Beach': 'Historical Fort',
  'Lake / Natural Attraction': 'Lake',
  'Desert / Natural Attraction': 'Desert',
  'UNESCO World Heritage Site / Church': 'UNESCO Heritage Site',
  'Church / Religious Site': 'Religious Site'
};

// Clean and standardize data
function cleanValue(value) {
  if (!value || value === 'Not documented' || value === 'nan' || value === '') {
    return null;
  }
  
  // Clean up common formatting issues
  return value
    .replace(/^"|"$/g, '') // Remove surrounding quotes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Parse CSV line with proper quote handling
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Map old headers to standard headers
function mapHeaders(oldHeaders) {
  const headerMapping = {
    'Name of Place': 'place_name',
    'Place': 'place_name',
    'Type': 'category',
    'Official Website': 'official_website',
    'Official Website (if available)': 'official_website',
    'Wikipedia': 'wikipedia',
    'Wikipedia (if available)': 'wikipedia',
    'Nearest Railway Station': 'nearest_railway',
    'Nearest Bus Stand': 'nearest_bus',
    'Nearest Metro Station': 'metro_station',
    'Nearest Airport': 'nearest_airport',
    'Timings': 'timings',
    'Entry Fee': 'entry_fee',
    'Best Time to Visit': 'best_time',
    'Accessibility': 'accessibility',
    'Guided Tours': 'guided_tours',
    'Parking': 'parking',
    'Nearby Amenities': 'nearby_amenities',
    'Special Notes': 'special_notes'
  };
  
  return oldHeaders.map(header => headerMapping[header] || header.toLowerCase().replace(/\s+/g, '_'));
}

// Process a single CSV file
function processCSVFile(filePath, stateName, stateCode) {
  console.log(`\nProcessing ${stateName} (${stateCode})...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.log(`  ⚠️  No data found in ${filePath}`);
      return [];
    }
    
    const oldHeaders = parseCSVLine(lines[0]);
    const mappedHeaders = mapHeaders(oldHeaders);
    
    console.log(`  📊 Found ${lines.length - 1} places`);
    console.log(`  📋 Headers: ${oldHeaders.join(', ')}`);
    
    const places = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const place = {
        _id: `${stateCode.toLowerCase()}_${i}`,
        state: stateName,
        stateCode: stateCode,
        place_name: '',
        category: '',
        description: null,
        timings: null,
        entry_fee: null,
        best_time: null,
        nearest_railway: null,
        nearest_bus: null,
        nearest_airport: null,
        metro_station: null,
        accessibility: null,
        guided_tours: null,
        parking: null,
        nearby_amenities: null,
        official_website: null,
        wikipedia: null,
        special_notes: null
      };
      
      // Map values to standard structure
      mappedHeaders.forEach((mappedHeader, index) => {
        if (mappedHeader && place.hasOwnProperty(mappedHeader)) {
          const cleanedValue = cleanValue(values[index]);
          if (cleanedValue) {
            place[mappedHeader] = cleanedValue;
          }
        }
      });
      
      // Standardize category
      if (place.category && CATEGORY_MAPPING[place.category]) {
        place.category = CATEGORY_MAPPING[place.category];
      }
      
      // Only add if we have essential data
      if (place.place_name && place.category) {
        places.push(place);
      }
    }
    
    console.log(`  ✅ Processed ${places.length} valid places`);
    return places;
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return [];
  }
}

// Main processing function
async function processAllCSVFiles() {
  const csvDir = path.join(__dirname, '..', 'all states csv');
  const outputDir = path.join(__dirname, '..', 'src', 'data', 'cleaned');
  
  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });
  
  // State mapping
  const stateMapping = {
    'goa_data.csv': { name: 'Goa', code: 'GA' },
    'kerala_tourist_places.csv': { name: 'Kerala', code: 'KL' },
    'rajasthan_tourism_guide.csv': { name: 'Rajasthan', code: 'RJ' },
    'andaman_nicobar_tourism_guide.csv': { name: 'Andaman and Nicobar Islands', code: 'AN' },
    'andhra_pradesh_tourist_places.csv': { name: 'Andhra Pradesh', code: 'AP' },
    'Arunachal Pradesh_tourist.csv': { name: 'Arunachal Pradesh', code: 'AR' },
    'Assam_tourist.csv': { name: 'Assam', code: 'AS' },
    'bihar_tourism_guide.csv.xlsx': { name: 'Bihar', code: 'BR' },
    'Chandigarh_tourist.csv': { name: 'Chandigarh', code: 'CH' },
    'Chhattisgarh_tourist.csv': { name: 'Chhattisgarh', code: 'CT' },
    'Dadra & nagar haveli .csv': { name: 'Dadra and Nagar Haveli', code: 'DN' },
    'delhi_tourist_places.csv': { name: 'Delhi', code: 'DL' },
    'gujarat_tourism_guide_2025_full.csv': { name: 'Gujarat', code: 'GJ' },
    'haryana_tourist_places (1).csv': { name: 'Haryana', code: 'HR' },
    'himachal_tourism_guide.csv': { name: 'Himachal Pradesh', code: 'HP' },
    'jammu & kashmir.csv': { name: 'Jammu and Kashmir', code: 'JK' },
    'jharkhand_tourism_guide.csv': { name: 'Jharkhand', code: 'JH' },
    'karnataka_tourist_places.csv': { name: 'Karnataka', code: 'KA' },
    'ladakh_tourism_guide.csv': { name: 'Ladakh', code: 'LA' },
    'lakshadweep_places.csv': { name: 'Lakshadweep', code: 'LD' },
    'madhya_pradesh_tourist_places_complete.csv': { name: 'Madhya Pradesh', code: 'MP' },
    'maharashtra_tourist_places_complete.csv': { name: 'Maharashtra', code: 'MH' },
    'Manipur_tourist.csv': { name: 'Manipur', code: 'MN' },
    'Meghalaya_tourist.csv': { name: 'Meghalaya', code: 'ML' },
    'Mizoram_tourist.csv': { name: 'Mizoram', code: 'MZ' },
    'nagaland_tourism_guide.csv': { name: 'Nagaland', code: 'NL' },
    'odisha_tourist_attractions.csv': { name: 'Odisha', code: 'OR' },
    'pondicherry_tourism_guide.csv': { name: 'Puducherry', code: 'PY' },
    'Punjab_tourist_places.csv': { name: 'Punjab', code: 'PB' },
    'sikkim_tourist.csv': { name: 'Sikkim', code: 'SK' },
    'tamil_nadu_tourist_places.csv': { name: 'Tamil Nadu', code: 'TN' },
    'telangana_tourist_places.csv': { name: 'Telangana', code: 'TG' },
    'tripura_tourism_guide.csv': { name: 'Tripura', code: 'TR' },
    'uttar_pradesh_tourism_guide_2025.csv': { name: 'Uttar Pradesh', code: 'UP' },
    'uttarakhand_tourism_guide.csv': { name: 'Uttarakhand', code: 'UT' },
    'west_bengal_data.csv': { name: 'West Bengal', code: 'WB' }
  };
  
  const allPlaces = [];
  const stateStats = {};
  
  console.log('🚀 Starting CSV processing...\n');
  
  // Process each CSV file
  for (const [filename, stateInfo] of Object.entries(stateMapping)) {
    const filePath = path.join(csvDir, filename);
    
    if (fs.existsSync(filePath)) {
      const places = processCSVFile(filePath, stateInfo.name, stateInfo.code);
      allPlaces.push(...places);
      stateStats[stateInfo.name] = places.length;
      
      // Save individual state file
      const stateOutputPath = path.join(outputDir, `${stateInfo.code.toLowerCase()}_${stateInfo.name.toLowerCase().replace(/\s+/g, '_')}.json`);
      fs.writeFileSync(stateOutputPath, JSON.stringify(places, null, 2));
    } else {
      console.log(`  ⚠️  File not found: ${filename}`);
    }
  }
  
  // Save combined data
  const combinedOutputPath = path.join(outputDir, 'all_places_cleaned.json');
  fs.writeFileSync(combinedOutputPath, JSON.stringify(allPlaces, null, 2));
  
  // Generate summary
  console.log('\n📊 Processing Summary:');
  console.log('='.repeat(50));
  console.log(`Total Places Processed: ${allPlaces.length}`);
  console.log(`States Processed: ${Object.keys(stateStats).length}`);
  console.log('\nPlaces by State:');
  Object.entries(stateStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([state, count]) => {
      console.log(`  ${state}: ${count} places`);
    });
  
  // Category analysis
  const categoryStats = {};
  allPlaces.forEach(place => {
    categoryStats[place.category] = (categoryStats[place.category] || 0) + 1;
  });
  
  console.log('\nTop Categories:');
  Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} places`);
    });
  
  console.log(`\n✅ All data saved to: ${outputDir}`);
  console.log(`📁 Combined file: ${combinedOutputPath}`);
  
  return allPlaces;
}

// Run the processing
processAllCSVFiles().catch(console.error);
