import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Better CSV parser that handles quoted fields with commas
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

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'merged_state_places.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = parseCSVLine(lines[0]);

console.log('CSV Headers:', headers);
console.log('Total lines:', lines.length);

// Sample first few rows with proper parsing
console.log('\nFirst 3 data rows (properly parsed):');
for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
  const values = parseCSVLine(lines[i]);
  const row = {};
  headers.forEach((header, index) => {
    row[header] = values[index] || '';
  });
  console.log(`Row ${i}:`, {
    state: row.state,
    state_code: row.state_code,
    place_name: row.place_name,
    category: row.category,
    description: row.description?.substring(0, 100) + '...',
    timings: row.timings,
    entry_fee: row.entry_fee,
    best_time: row.best_time
  });
}

// Count places by state
const stateCount = {};
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = parseCSVLine(lines[i]);
    const state = values[0]?.trim() || 'Unknown';
    stateCount[state] = (stateCount[state] || 0) + 1;
  }
}

console.log('\nTop 10 States by Places:');
Object.entries(stateCount)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([state, count]) => {
    console.log(`${state}: ${count} places`);
  });

// Count places by category
const categoryCount = {};
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = parseCSVLine(lines[i]);
    const category = values[3]?.trim() || 'Unknown';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  }
}

console.log('\nTop 10 Categories:');
Object.entries(categoryCount)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([category, count]) => {
    console.log(`${category}: ${count} places`);
  });

// Generate sample data for the frontend
console.log('\nGenerating sample data for frontend...');
const samplePlaces = [];
for (let i = 1; i <= Math.min(10, lines.length - 1); i++) {
  if (lines[i].trim()) {
    const values = parseCSVLine(lines[i]);
    const place = {
      _id: `place_${i}`,
      state: values[0]?.trim() || '',
      stateCode: values[1]?.trim() || '',
      placeName: values[2]?.trim() || '',
      category: values[3]?.trim() || '',
      description: values[4]?.trim() || '',
      timings: values[5]?.trim() || '',
      entryFee: values[6]?.trim() || '',
      bestTime: values[7]?.trim() || '',
      nearestRailway: values[8]?.trim() || '',
      nearestBus: values[9]?.trim() || '',
      nearestAirport: values[10]?.trim() || '',
      metroStation: values[11]?.trim() || '',
      accessibility: values[12]?.trim() || '',
      guidedTours: values[13]?.trim() || '',
      parking: values[14]?.trim() || '',
      nearbyAmenities: values[15]?.trim() || '',
      officialWebsite: values[16]?.trim() || '',
      wikipedia: values[17]?.trim() || '',
      specialNotes: values[18]?.trim() || '',
    };
    samplePlaces.push(place);
  }
}

// Write sample data to a JSON file
const sampleDataPath = path.join(__dirname, '..', 'src', 'data', 'sample-places.json');
fs.mkdirSync(path.dirname(sampleDataPath), { recursive: true });
fs.writeFileSync(sampleDataPath, JSON.stringify(samplePlaces, null, 2));

console.log(`\nSample data written to: ${sampleDataPath}`);
console.log('CSV analysis complete!');
