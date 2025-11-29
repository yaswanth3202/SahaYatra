import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'merged_state_places.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (simple parser for this specific format)
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

console.log('CSV Headers:', headers);
console.log('Total lines:', lines.length);

// Sample first few rows
console.log('\nFirst 3 data rows:');
for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
  const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
  const row = {};
  headers.forEach((header, index) => {
    row[header] = values[index] || '';
  });
  console.log(`Row ${i}:`, row);
}

// Count places by state
const stateCount = {};
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = lines[i].split(',');
    const state = values[0]?.trim().replace(/"/g, '') || 'Unknown';
    stateCount[state] = (stateCount[state] || 0) + 1;
  }
}

console.log('\nPlaces by State:');
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
    const values = lines[i].split(',');
    const category = values[3]?.trim().replace(/"/g, '') || 'Unknown';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  }
}

console.log('\nPlaces by Category:');
Object.entries(categoryCount)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([category, count]) => {
    console.log(`${category}: ${count} places`);
  });

console.log('\nCSV analysis complete!');
console.log('To import this data into Convex, you can use the importPlaces.ts functions.');
