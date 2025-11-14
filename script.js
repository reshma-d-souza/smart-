const { useState, useEffect, useCallback, useRef, useMemo } = React;

// --- CONSTANTS ---
const MAP_WIDTH = 50;
const MAP_HEIGHT = 70;
const CELL_SIZE = 12;
const FLOORS = [0, 1, 2, 3];
const YOU_ARE_HERE_ID = 'you-are-here';

const Category = {
  Fashion: "Fashion / Apparel",
  Footwear: "Footwear",
  Electronics: "Electronics / Gadgets",
  Watches: "Watches / Jewellery",
  Beauty: "Beauty / Health",
  Home: "Home & Decor",
  Books: "Books / Stationery",
  Sports: "Sports / Travel",
  Food: "Food / Restaurants",
  Services: "Services",
  Amenity: "Amenity",
};

const STORES = [
  { id: 'levis', name: 'Levi’s', category: Category.Fashion, x: 2, y: 2, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 0 },
  { id: 'max', name: 'Max Fashion', category: Category.Fashion, x: 9, y: 2, width: 8, height: 4, door: { x: 4, y: 4 }, floor: 0 },
  { id: 'westside', name: 'Westside', category: Category.Fashion, x: 18, y: 2, width: 10, height: 5, door: { x: 5, y: 5 }, floor: 0 },
  { id: 'fabindia', name: 'FabIndia', category: Category.Fashion, x: 30, y: 2, width: 7, height: 4, door: { x: 3, y: 4 }, floor: 0 },
  { id: 'biba', name: 'Biba', category: Category.Fashion, x: 38, y: 2, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 0 },
  { id: 'bata', name: 'Bata', category: Category.Footwear, x: 2, y: 22, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 0 },
  { id: 'nike', name: 'Nike', category: Category.Footwear, x: 9, y: 22, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 0 },
  { id: 'puma', name: 'Puma', category: Category.Footwear, x: 16, y: 22, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 0 },
  { id: 'croma', name: 'Croma', category: Category.Electronics, x: 2, y: 35, width: 12, height: 6, door: { x: 6, y: 0 }, floor: 0 },
  { id: 'reliance', name: 'Reliance Digital', category: Category.Electronics, x: 15, y: 35, width: 12, height: 6, door: { x: 6, y: 0 }, floor: 0 },
  { id: 'kfc', name: 'KFC', category: Category.Food, x: 2, y: 60, width: 5, height: 4, door: { x: 2, y: 0 }, floor: 0 },
  { id: 'mcdonalds', name: 'McDonald’s', category: Category.Food, x: 8, y: 60, width: 5, height: 4, door: { x: 2, y: 0 }, floor: 0 },
  { id: 'dominos', name: 'Domino’s', category: Category.Food, x: 14, y: 60, width: 5, height: 4, door: { x: 2, y: 0 }, floor: 0 },
  { id: 'pizzahut', name: 'Pizza Hut', category: Category.Food, x: 20, y: 60, width: 5, height: 4, door: { x: 2, y: 0 }, floor: 0 },
  { id: 'entrance', name: 'Entrance/Exit', category: Category.Amenity, x: 22, y: 68, width: 6, height: 2, door: { x: 3, y: 0 }, floor: 0 },
  { id: 'washroom-m-0', name: 'Washroom (Men)', category: Category.Amenity, x: 44, y: 35, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 0 },
  { id: 'washroom-w-0', name: 'Washroom (Women)', category: Category.Amenity, x: 44, y: 39, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 0 },
  { id: 'escalator-up-0', name: 'Escalator (Up to 1F)', category: Category.Amenity, x: 2, y: 29, width: 3, height: 3, door: { x: 1, y: 3 }, floor: 0, linksTo: { x: 2, y: 29, floor: 1 } },
  { id: 'stairs-up-0', name: 'Stairs (Up to 1F)', category: Category.Amenity, x: 44, y: 50, width: 4, height: 4, door: { x: 0, y: 2 }, floor: 0, linksTo: { x: 44, y: 50, floor: 1 } },
  { id: 'office', name: 'Store Office', category: Category.Services, x: 44, y: 65, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 0 },
  { id: 'raymond', name: 'Raymond', category: Category.Fashion, x: 2, y: 15, width: 6, height: 4, door: { x: 3, y: 0 }, floor: 1 },
  { id: 'allen-solly', name: 'Allen Solly', category: Category.Fashion, x: 9, y: 15, width: 6, height: 4, door: { x: 3, y: 0 }, floor: 1 },
  { id: 'van-heusen', name: 'Van Heusen', category: Category.Fashion, x: 16, y: 15, width: 6, height: 4, door: { x: 3, y: 0 }, floor: 1 },
  { id: 'peter-england', name: 'Peter England', category: Category.Fashion, x: 23, y: 15, width: 6, height: 4, door: { x: 3, y: 0 }, floor: 1 },
  { id: 'global-desi', name: 'Global Desi', category: Category.Fashion, x: 30, y: 15, width: 6, height: 4, door: { x: 3, y: 0 }, floor: 1 },
  { id: 'w-for-women', name: 'W for Women', category: Category.Fashion, x: 37, y: 15, width: 6, height: 4, door: { x: 3, y: 0 }, floor: 1 },
  { id: 'arrow', name: 'Arrow', category: Category.Fashion, x: 44, y: 15, width: 4, height: 4, door: { x: 2, y: 0 }, floor: 1 },
  { id: 'metro', name: 'Metro Shoes', category: Category.Footwear, x: 23, y: 22, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 1 },
  { id: 'woodland', name: 'Woodland', category: Category.Footwear, x: 30, y: 22, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 1 },
  { id: 'skechers', name: 'Skechers', category: Category.Footwear, x: 37, y: 22, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 1 },
  { id: 'samsung', name: 'Samsung', category: Category.Electronics, x: 28, y: 35, width: 8, height: 6, door: { x: 4, y: 0 }, floor: 1 },
  { id: 'titan', name: 'Titan World', category: Category.Watches, x: 2, y: 44, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 1 },
  { id: 'tanishq', name: 'Tanishq', category: Category.Watches, x: 9, y: 44, width: 8, height: 4, door: { x: 4, y: 4 }, floor: 1 },
  { id: 'casio', name: 'Casio', category: Category.Watches, x: 18, y: 44, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 1 },
  { id: 'ideal', name: 'Ideal Ice Cream', category: Category.Food, x: 26, y: 60, width: 6, height: 4, door: { x: 3, y: 0 }, floor: 1 },
  { id: 'subway', name: 'Subway', category: Category.Food, x: 33, y: 60, width: 5, height: 4, door: { x: 2, y: 0 }, floor: 1 },
  { id: 'washroom-m-1', name: 'Washroom (Men)', category: Category.Amenity, x: 44, y: 35, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 1 },
  { id: 'washroom-w-1', name: 'Washroom (Women)', category: Category.Amenity, x: 44, y: 39, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 1 },
  { id: 'escalator-down-1', name: 'Escalator (Down to GF)', category: Category.Amenity, x: 2, y: 29, width: 3, height: 3, door: { x: 1, y: 0 }, floor: 1, linksTo: { x: 2, y: 29, floor: 0 } },
  { id: 'escalator-up-1', name: 'Escalator (Up to 2F)', category: Category.Amenity, x: 6, y: 29, width: 3, height: 3, door: { x: 1, y: 3 }, floor: 1, linksTo: { x: 6, y: 29, floor: 2 } },
  { id: 'stairs-down-1', name: 'Stairs (Down to GF)', category: Category.Amenity, x: 44, y: 50, width: 2, height: 4, door: { x: 0, y: 2 }, floor: 1, linksTo: { x: 44, y: 50, floor: 0 } },
  { id: 'stairs-up-1', name: 'Stairs (Up to 2F)', category: Category.Amenity, x: 46, y: 50, width: 2, height: 4, door: { x: 2, y: 2 }, floor: 1, linksTo: { x: 44, y: 50, floor: 2 } },
  { id: 'bodyshop', name: 'The Body Shop', category: Category.Beauty, x: 2, y: 2, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 2 },
  { id: 'lush', name: 'Lush', category: Category.Beauty, x: 9, y: 2, width: 6, height: 4, door: { x: 3, y: 4 }, floor: 2 },
  { id: 'nykaa', name: 'Nykaa', category: Category.Beauty, x: 16, y: 2, width: 8, height: 4, door: { x: 4, y: 4 }, floor: 2 },
  { id: 'loreal', name: 'L’Oréal Paris', category: Category.Beauty, x: 25, y: 2, width: 8, height: 4, door: { x: 4, y: 4 }, floor: 2 },
  { id: 'homecentre', name: 'Home Centre', category: Category.Home, x: 2, y: 35, width: 12, height: 6, door: { x: 6, y: 0 }, floor: 2 },
  { id: 'poshlighting', name: 'Posh Lighting', category: Category.Home, x: 15, y: 35, width: 10, height: 6, door: { x: 5, y: 0 }, floor: 2 },
  { id: 'iris', name: 'Iris', category: Category.Home, x: 26, y: 35, width: 8, height: 6, door: { x: 4, y: 0 }, floor: 2 },
  { id: 'crossword', name: 'Crossword', category: Category.Books, x: 30, y: 15, width: 10, height: 5, door: { x: 5, y: 0 }, floor: 2 },
  { id: 'sapna', name: 'Sapna Book House', category: Category.Books, x: 30, y: 22, width: 10, height: 5, door: { x: 5, y: 5 }, floor: 2 },
  { id: 'washroom-m-2', name: 'Washroom (Men)', category: Category.Amenity, x: 44, y: 35, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 2 },
  { id: 'washroom-w-2', name: 'Washroom (Women)', category: Category.Amenity, x: 44, y: 39, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 2 },
  { id: 'escalator-down-2', name: 'Escalator (Down to 1F)', category: Category.Amenity, x: 2, y: 29, width: 3, height: 3, door: { x: 1, y: 0 }, floor: 2, linksTo: { x: 2, y: 29, floor: 1 } },
  { id: 'escalator-up-2', name: 'Escalator (Up to 3F)', category: Category.Amenity, x: 6, y: 29, width: 3, height: 3, door: { x: 1, y: 3 }, floor: 2, linksTo: { x: 6, y: 29, floor: 3 } },
  { id: 'stairs-down-2', name: 'Stairs (Down to 1F)', category: Category.Amenity, x: 44, y: 50, width: 2, height: 4, door: { x: 0, y: 2 }, floor: 2, linksTo: { x: 44, y: 50, floor: 1 } },
  { id: 'stairs-up-2', name: 'Stairs (Up to 3F)', category: Category.Amenity, x: 46, y: 50, width: 2, height: 4, door: { x: 2, y: 2 }, floor: 2, linksTo: { x: 44, y: 50, floor: 3 } },
  { id: 'planetsports', name: 'Planet Sports', category: Category.Sports, x: 2, y: 2, width: 8, height: 4, door: { x: 4, y: 4 }, floor: 3 },
  { id: 'wildcraft', name: 'Wildcraft', category: Category.Sports, x: 11, y: 2, width: 8, height: 4, door: { x: 4, y: 4 }, floor: 3 },
  { id: 'samsonite', name: 'Samsonite', category: Category.Sports, x: 2, y: 10, width: 8, height: 4, door: { x: 4, y: 0 }, floor: 3 },
  { id: 'vip', name: 'VIP', category: Category.Sports, x: 11, y: 10, width: 8, height: 4, door: { x: 4, y: 0 }, floor: 3 },
  { id: 'dw', name: 'Daniel Wellington', category: Category.Watches, x: 22, y: 2, width: 7, height: 4, door: { x: 3, y: 4 }, floor: 3 },
  { id: 'parakat', name: 'Parakat Jewels', category: Category.Watches, x: 30, y: 2, width: 7, height: 4, door: { x: 3, y: 4 }, floor: 3 },
  { id: 'punjabdihaandi', name: 'Punjab Di Haandi', category: Category.Food, x: 2, y: 60, width: 8, height: 4, door: { x: 4, y: 0 }, floor: 3 },
  { id: 'pokketcafe', name: 'Pokket Café', category: Category.Food, x: 11, y: 60, width: 8, height: 4, door: { x: 4, y: 0 }, floor: 3 },
  { id: 'greenonion', name: 'Green Onion', category: Category.Food, x: 20, y: 60, width: 8, height: 4, door: { x: 4, y: 0 }, floor: 3 },
  { id: 'washroom-m-3', name: 'Washroom (Men)', category: Category.Amenity, x: 44, y: 35, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 3 },
  { id: 'washroom-w-3', name: 'Washroom (Women)', category: Category.Amenity, x: 44, y: 39, width: 4, height: 3, door: { x: 0, y: 1 }, floor: 3 },
  { id: 'escalator-down-3', name: 'Escalator (Down to 2F)', category: Category.Amenity, x: 2, y: 29, width: 3, height: 3, door: { x: 1, y: 0 }, floor: 3, linksTo: { x: 2, y: 29, floor: 2 } },
  { id: 'stairs-down-3', name: 'Stairs (Down to 2F)', category: Category.Amenity, x: 44, y: 50, width: 4, height: 4, door: { x: 0, y: 2 }, floor: 3, linksTo: { x: 44, y: 50, floor: 2 } },
];

const TRANSLATIONS = {
  title: { en: 'Mall Navigator Pro', kn: 'ಮಾಲ್ ನ್ಯಾವಿಗೇಟರ್ ಪ್ರೊ' },
  shopkeeperMode: { en: 'Shopkeeper Mode', kn: 'ಅಂಗಡಿಯವನ ಮೋಡ್' },
  yourStore: { en: 'Your Store', kn: 'ನಿಮ್ಮ ಅಂಗಡಿ' },
  selectYourStore: { en: 'Select your store', kn: 'ನಿಮ್ಮ ಅಂಗಡಿ ಆಯ್ಕೆಮಾಡಿ' },
  customerMode: { en: 'Customer Mode', kn: 'ಗ್ರಾಹಕ ಮೋಡ್' },
  currentLocation: { en: 'Current Location', kn: 'ಪ್ರಸ್ತುತ ಸ್ಥಳ' },
  youAreHere: { en: 'You are here', kn: 'ನೀವು ಇಲ್ಲಿದ್ದೀರಿ' },
  destination: { en: 'Destination(s)', kn: 'ಗಮ್ಯಸ್ಥಾನ(ಗಳು)' },
  selectDestination: { en: 'Select destination(s)', kn: 'ಗಮ್ಯಸ್ಥಾನ(ಗಳನ್ನು) ಆಯ್ಕೆಮಾಡಿ' },
  searchStore: { en: 'Search for a store...', kn: 'ಅಂಗಡಿಗಾಗಿ ಹುಡುಕಿ...' },
  getDirections: { en: 'Get Directions', kn: 'ಮಾರ್ಗ ಪಡೆಯಿರಿ' },
  clearRoute: { en: 'Clear Route', kn: 'ಮಾರ್ಗ ತೆರವುಗೊಳಿಸಿ' },
  startNavigation: { en: 'Start Voice Navigation', kn: 'ಧ್ವನಿ ಸಂಚರಣೆ ಪ್ರಾರಂಭಿಸಿ' },
  stopNavigation: { en: 'Stop Voice Navigation', kn: 'ಧ್ವನಿ ಸಂಚರಣೆ ನಿಲ್ಲಿಸಿ' },
  routeCleared: { en: 'Route cleared.', kn: 'ಮಾರ್ಗ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ.' },
  calculatingRoute: { en: 'Calculating route...', kn: 'ಮಾರ್ಗವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...' },
  routeNotFound: { en: 'Route not found.', kn: 'ಮಾರ್ಗ ಕಂಡುಬಂದಿಲ್ಲ.' },
  selectStartAndDest: { en: 'Please select a starting point and at least one destination.', kn: 'ದಯವಿಟ್ಟು ಆರಂಭಿಕ ಸ್ಥಳ ಮತ್ತು ಕನಿಷ್ಠ ಒಂದು ಗಮ್ಯಸ್ಥಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.' },
  groundFloor: { en: 'Ground Floor', kn: 'ನೆಲ ಮಹಡಿ' },
  firstFloor: { en: 'First Floor', kn: 'ಮೊದಲ ಮಹಡಿ' },
  secondFloor: { en: 'Second Floor', kn: 'ಎರಡನೇ ಮಹಡಿ' },
  thirdFloor: { en: 'Third Floor', kn: 'ಮೂರನೇ ಮಹಡಿ' },
  walkForward: { en: 'Walk forward', kn: 'ಮುಂದೆ ನಡೆಯಿರಿ' },
  turnLeft: { en: 'Turn left', kn: 'ಎಡಕ್ಕೆ ತಿರುಗಿ' },
  turnRight: { en: 'Turn right', kn: 'ಬಲಕ್ಕೆ ತಿರುಗಿ' },
  steps: { en: 'steps', kn: 'ಹೆಜ್ಜೆಗಳು' },
  destinationOnLeft: { en: 'Your destination, {destination}, is on your left.', kn: 'ನಿಮ್ಮ ಗಮ್ಯಸ್ಥಾನ, {destination}, ನಿಮ್ಮ ಎಡಭಾಗದಲ್ಲಿದೆ.' },
  destinationOnRight: { en: 'Your destination, {destination}, is on your right.', kn: 'ನಿಮ್ಮ ಗಮ್ಯಸ್ಥಾನ, {destination}, ನಿಮ್ಮ ಬಲಭಾಗದಲ್ಲಿದೆ.' },
  youHaveArrived: { en: 'You have arrived at {destination}.', kn: 'ನೀವು {destination} ಗೆ ತಲುಪಿದ್ದೀರಿ.' },
  nextDestination: { en: 'Continuing to next destination, {destination}.', kn: 'ಮುಂದಿನ ಗಮ್ಯಸ್ಥಾನ, {destination}, ಕ್ಕೆ ಮುಂದುವರಿಯಲಾಗುತ್ತಿದೆ.' },
  navigationComplete: { en: 'You have reached your final destination. Navigation complete.', kn: 'ನೀವು ನಿಮ್ಮ ಅಂತಿಮ ಗಮ್ಯಸ್ಥಾನವನ್ನು ತಲುಪಿದ್ದೀರಿ. ಸಂಚರಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ.' },
  takeEscalatorUp: { en: 'Take the escalator up to the {floorName}', kn: '{floorName}ಗೆ ಎಸ್ಕಲೇಟರ್ ಮೂಲಕ ಹೋಗಿ' },
  takeEscalatorDown: { en: 'Take the escalator down to the {floorName}', kn: '{floorName}ಗೆ ಎಸ್ಕಲೇಟರ್ ಮೂಲಕ ಕೆಳಗೆ ಹೋಗಿ' },
  takeStairsTo: { en: 'Take the stairs to the {floorName}', kn: 'ಮೆಟ್ಟಿಲುಗಳ ಮೂಲಕ {floorName}ಗೆ ಹೋಗಿ' },
};

// --- PATHFINDING SERVICE ---
const findPath = (() => {
  const { grids, connectors } = (() => {
    const grids = {};
    const connectors = new Map();
    FLOORS.forEach(floor => {
      grids[floor] = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill(true));
    });
    STORES.forEach(store => {
      const grid = grids[store.floor];
      if (!grid) return;
      for (let y = store.y; y < store.y + store.height; y++) {
        for (let x = store.x; x < store.x + store.width; x++) {
          if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
            grid[y][x] = false;
          }
        }
      }
      const doorX = store.x + store.door.x;
      const doorY = store.y + store.door.y;
      if (doorX >= 0 && doorX < MAP_WIDTH && doorY >= 0 && doorY < MAP_HEIGHT) {
        grid[doorY][doorX] = true;
      }
      if (store.linksTo) {
        const startPoint = { x: store.x + store.door.x, y: store.y + store.door.y, floor: store.floor };
        connectors.set(`${startPoint.x},${startPoint.y},${startPoint.floor}`, store.linksTo);
      }
    });
    return { grids, connectors };
  })();

  const isPointValid = (p) => grids[p.floor]?.[p.y]?.[p.x] ?? false;

  return (start, end) => {
    if (!isPointValid(start) || !isPointValid(end)) return null;
    const queue = [start];
    const cameFrom = new Map();
    const startKey = `${start.x},${start.y},${start.floor}`;
    const visited = new Set([startKey]);
    cameFrom.set(startKey, null);
    const directions = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.x === end.x && current.y === end.y && current.floor === end.floor) {
        const path = [];
        let temp = current;
        while (temp) {
          path.unshift(temp);
          temp = cameFrom.get(`${temp.x},${temp.y},${temp.floor}`);
        }
        return path;
      }
      for (const dir of directions) {
        const next = { x: current.x + dir.x, y: current.y + dir.y, floor: current.floor };
        const nextKey = `${next.x},${next.y},${next.floor}`;
        if (isPointValid(next) && !visited.has(nextKey)) {
          visited.add(nextKey);
          cameFrom.set(nextKey, current);
          queue.push(next);
        }
      }
      const currentKey = `${current.x},${current.y},${current.floor}`;
      if (connectors.has(currentKey)) {
        const next = connectors.get(currentKey);
        const nextKey = `${next.x},${next.y},${next.floor}`;
        if (!visited.has(nextKey)) {
          visited.add(nextKey);
          cameFrom.set(nextKey, current);
          queue.push(next);
        }
      }
    }
    return null;
  };
})();

// --- REACT COMPONENTS ---

const StoreMap = ({ stores, path, startPoint, destinations, onMapClick, selectedStoreId }) => {
  const destinationIds = new Set(destinations.map(d => d.id));
  const getCellColor = (store) => {
    if (selectedStoreId === store.id) return 'bg-blue-400 dark:bg-blue-600';
    if (destinationIds.has(store.id)) return 'bg-yellow-400 dark:bg-yellow-600';
    switch (store.category) {
      case Category.Fashion: return 'bg-pink-200 dark:bg-pink-800';
      case Category.Footwear: return 'bg-indigo-200 dark:bg-indigo-800';
      case Category.Electronics: return 'bg-sky-200 dark:bg-sky-800';
      case Category.Food: return 'bg-orange-200 dark:bg-orange-800';
      case Category.Amenity: return 'bg-teal-200 dark:bg-teal-800';
      default: return 'bg-slate-200 dark:bg-slate-700';
    }
  };

  const handleMapClick = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
      onMapClick({ x, y });
  };
    
  return (
    <div 
      className="relative bg-gray-50 dark:bg-gray-800/50 overflow-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 select-none" 
      style={{ width: MAP_WIDTH * CELL_SIZE, height: MAP_HEIGHT * CELL_SIZE }}
      onClick={handleMapClick}
    >
      {stores.map(store => (
        <div
          key={store.id}
          className={`absolute flex items-center justify-center border border-gray-400 dark:border-gray-600 transition-colors duration-300 ${getCellColor(store)}`}
          style={{
            left: store.x * CELL_SIZE,
            top: store.y * CELL_SIZE,
            width: store.width * CELL_SIZE,
            height: store.height * CELL_SIZE,
          }}
        >
          <span className="text-xs text-center p-1 font-semibold text-gray-700 dark:text-gray-200">
            {store.name}
          </span>
        </div>
      ))}

      {path && path.map((point, index) => {
        const isConnector = (index > 0 && path[index - 1].floor !== point.floor) || (index < path.length - 1 && path[index + 1].floor !== point.floor);
        return (
          <div
            key={index}
            className={`absolute rounded-full ${isConnector ? 'bg-purple-500 animate-bounce' : 'bg-blue-500/80 animate-pulse'}`}
            style={{
              left: (point.x * CELL_SIZE) + (CELL_SIZE / 4),
              top: (point.y * CELL_SIZE) + (CELL_SIZE / 4),
              width: CELL_SIZE / 2,
              height: CELL_SIZE / 2,
              animationDelay: `${index * 0.02}s`,
            }}
            title={isConnector ? "Go to another floor" : ""}
          />
        );
      })}
      
      {startPoint && (
         <div
            className="absolute flex items-center justify-center"
            style={{
                left: startPoint.x * CELL_SIZE,
                top: startPoint.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                transform: 'translateY(-50%)',
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500 drop-shadow-lg">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
        </div>
      )}
    </div>
  );
};

const ControlPanel = ({
  language, setLanguage, isShopkeeperMode, setIsShopkeeperMode,
  shopkeeperStoreId, setShopkeeperStoreId, startPointId, setStartPointId,
  destinations, setDestinations, onGetDirections, onClearRoute,
  isNavigating, onToggleVoiceNavigation
}) => {
  const t = (key) => TRANSLATIONS[key][language];
  const [searchTerm, setSearchTerm] = useState('');
  const storesByFloor = useMemo(() => 
    STORES.reduce((acc, store) => {
      const floor = store.floor;
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(store);
      return acc;
    }, {})
  , []);
  const filteredStores = useMemo(() => STORES.filter(store => store.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
  const handleDestinationChange = (store) => {
    setDestinations(destinations.some(d => d.id === store.id) ? destinations.filter(d => d.id !== store.id) : [...destinations, store]);
  };
  const destinationIds = new Set(destinations.map(d => d.id));
  const floorName = (floor) => {
    if (floor === 0) return t('groundFloor');
    if (floor === 1) return t('firstFloor');
    if (floor === 2) return t('secondFloor');
    if (floor === 3) return t('thirdFloor');
    return '';
  };

  return (
    <div className="w-full md:w-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('title')}</h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-sm rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>EN</button>
          <button onClick={() => setLanguage('kn')} className={`px-2 py-1 text-sm rounded ${language === 'kn' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>ಕ</button>
        </div>
      </div>
      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button onClick={() => setIsShopkeeperMode(false)} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${!isShopkeeperMode ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>{t('customerMode')}</button>
        <button onClick={() => setIsShopkeeperMode(true)} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${isShopkeeperMode ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>{t('shopkeeperMode')}</button>
      </div>
      {isShopkeeperMode ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('yourStore')}</label>
          <select value={shopkeeperStoreId || ''} onChange={(e) => setShopkeeperStoreId(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <option value="">{t('selectYourStore')}</option>
            {Object.entries(storesByFloor).map(([floor, stores]) => (
              <optgroup key={floor} label={floorName(Number(floor))}>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('currentLocation')}</label>
          <select value={startPointId || ''} onChange={(e) => setStartPointId(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <option value={YOU_ARE_HERE_ID}>{t('youAreHere')} (Click on Map)</option>
            {Object.entries(storesByFloor).map(([floor, stores]) => (
              <optgroup key={floor} label={floorName(Number(floor))}>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('destination')}</label>
        <div className="relative"><input type="text" placeholder={t('searchStore')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" /></div>
        <div className="max-h-48 overflow-y-auto mt-2 space-y-1 pr-2">
          {filteredStores.map(store => (
            <div key={store.id} className="flex items-center">
              <input type="checkbox" id={`dest-${store.id}`} checked={destinationIds.has(store.id)} onChange={() => handleDestinationChange(store)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <label htmlFor={`dest-${store.id}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">{store.name} ({floorName(store.floor)})</label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onGetDirections} className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">{t('getDirections')}</button>
        <button onClick={onClearRoute} className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors">{t('clearRoute')}</button>
      </div>
      <button onClick={onToggleVoiceNavigation} className={`w-full p-2 rounded-md transition-colors ${isNavigating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`} disabled={destinations.length === 0}>
        {isNavigating ? t('stopNavigation') : t('startNavigation')}
      </button>
    </div>
  );
};

const App = () => {
  const [language, setLanguage] = useState('en');
  const [isShopkeeperMode, setIsShopkeeperMode] = useState(false);
  const [shopkeeperStoreId, setShopkeeperStoreId] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [startPointId, setStartPointId] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [path, setPath] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const utteranceRef = useRef(null);

  const t = useCallback((key, replacements) => {
    let text = TRANSLATIONS[key]?.[language] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  }, [language]);
  
  const floorName = useCallback((floor) => {
    if (floor === 0) return t('groundFloor');
    if (floor === 1) return t('firstFloor');
    if (floor === 2) return t('secondFloor');
    if (floor === 3) return t('thirdFloor');
    return '';
  }, [t]);

  useEffect(() => {
    const getStoreDoorPoint = (storeId) => {
      const store = STORES.find(s => s.id === storeId);
      return store ? { x: store.x + store.door.x, y: store.y + store.door.y, floor: store.floor } : null;
    };
    if (isShopkeeperMode) {
      setStartPoint(shopkeeperStoreId ? getStoreDoorPoint(shopkeeperStoreId) : null);
      setStartPointId(shopkeeperStoreId);
    } else {
      if (startPointId && startPointId !== YOU_ARE_HERE_ID) {
        setStartPoint(getStoreDoorPoint(startPointId));
      } else if (!startPointId) {
        setStartPoint(null);
      }
    }
  }, [isShopkeeperMode, shopkeeperStoreId, startPointId]);

  useEffect(() => {
    if (startPoint) setCurrentFloor(startPoint.floor);
  }, [startPoint]);

  const handleMapClick = (point) => {
    if (!isShopkeeperMode) {
      setStartPoint({ ...point, floor: currentFloor });
      setStartPointId(YOU_ARE_HERE_ID);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleGetDirections = useCallback(() => {
    if (!startPoint || destinations.length === 0) {
      showMessage(t('selectStartAndDest'));
      return;
    }
    let fullPath = [];
    let currentStart = startPoint;
    let pathFound = true;
    const sortedDests = [...destinations].sort((a,b) => a.floor - b.floor);
    for (const dest of sortedDests) {
      const destPoint = { x: dest.x + dest.door.x, y: dest.y + dest.door.y, floor: dest.floor };
      const segment = findPath(currentStart, destPoint);
      if (segment) {
        fullPath = fullPath.length === 0 ? segment : fullPath.concat(segment.slice(1));
        currentStart = destPoint;
      } else {
        pathFound = false;
        break;
      }
    }
    if (pathFound) setPath(fullPath);
    else {
      setPath(null);
      showMessage(t('routeNotFound'));
    }
  }, [startPoint, destinations, t]);

  const stopVoiceNavigation = () => {
    window.speechSynthesis.cancel();
    setIsNavigating(false);
  };

  const handleClearRoute = useCallback(() => {
    setPath(null);
    setDestinations([]);
    if (!isShopkeeperMode) {
      setStartPoint(null);
      setStartPointId(null);
    }
    stopVoiceNavigation();
    showMessage(t('routeCleared'));
  }, [isShopkeeperMode, t]);
  
  const generateDirections = useCallback(() => {
    if (!path || path.length < 2) return [];
    const directions = [];
    let currentPos = 0;
    const destPoints = new Map(destinations.map(d => [`${d.x+d.door.x},${d.y+d.door.y},${d.floor}`, d.name]));
    while (currentPos < path.length - 1) {
      const currentPoint = path[currentPos];
      const nextPoint = path[currentPos + 1];
      if (currentPoint.floor !== nextPoint.floor) {
        const connector = STORES.find(s => s.x <= currentPoint.x && s.x + s.width > currentPoint.x && s.y <= currentPoint.y && s.y + s.height > currentPoint.y && s.floor === currentPoint.floor && s.linksTo);
        const toFloorName = floorName(nextPoint.floor);
        if (connector) {
          if (connector.name.toLowerCase().includes('escalator')) {
            directions.push(t(nextPoint.floor > currentPoint.floor ? 'takeEscalatorUp' : 'takeEscalatorDown', {floorName: toFloorName}));
          } else if (connector.name.toLowerCase().includes('stairs')) {
            directions.push(t('takeStairsTo', {floorName: toFloorName}));
          }
        }
        currentPos++;
        continue;
      }
      let dx = nextPoint.x - currentPoint.x, dy = nextPoint.y - currentPoint.y;
      let steps = 0;
      while (currentPos + steps + 1 < path.length && path[currentPos + steps + 1].floor === currentPoint.floor && path[currentPos + steps + 1].x - path[currentPos + steps].x === dx && path[currentPos + steps + 1].y - path[currentPos + steps].y === dy) {
        steps++;
      }
      if (steps > 0) {
        if (dx === 1) directions.push(`${t('turnRight')}, ${t('walkForward')} ${steps} ${t('steps')}`);
        else if (dx === -1) directions.push(`${t('turnLeft')}, ${t('walkForward')} ${steps} ${t('steps')}`);
        else if (dy === 1) directions.push(`${t('walkForward')} ${steps} ${t('steps')}`);
        else if (dy === -1) directions.push(`${t('walkForward')} ${steps} ${t('steps')}`);
      }
      currentPos += steps;
      const destKey = `${path[currentPos].x},${path[currentPos].y},${path[currentPos].floor}`;
      if (destPoints.has(destKey)) {
        directions.push(t('youHaveArrived', {destination: destPoints.get(destKey)}));
        destPoints.delete(destKey);
      }
    }
    if (destinations.length > 0) directions.push(t('navigationComplete'));
    return directions;
  }, [path, destinations, t, floorName]);

  const speak = (text, onEnd) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    utterance.onend = onEnd;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceNavigation = useCallback(() => {
    if (!path) return;
    setIsNavigating(true);
    const directions = generateDirections();
    let currentStep = 0;
    const speakNext = () => {
      if (currentStep < directions.length) {
        speak(directions[currentStep], () => {
          currentStep++;
          speakNext();
        });
      } else setIsNavigating(false);
    };
    speakNext();
  }, [path, generateDirections, language]);

  const handleToggleVoiceNavigation = () => {
    if (isNavigating) stopVoiceNavigation();
    else startVoiceNavigation();
  };

  const visibleStores = useMemo(() => STORES.filter(s => s.floor === currentFloor), [currentFloor]);
  const visiblePath = useMemo(() => path ? path.filter(p => p.floor === currentFloor) : null, [path, currentFloor]);
  const visibleStartPoint = useMemo(() => startPoint && startPoint.floor === currentFloor ? startPoint : null, [startPoint, currentFloor]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center p-4 gap-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ControlPanel 
        language={language} setLanguage={setLanguage}
        isShopkeeperMode={isShopkeeperMode} setIsShopkeeperMode={setIsShopkeeperMode}
        shopkeeperStoreId={shopkeeperStoreId} setShopkeeperStoreId={setShopkeeperStoreId}
        startPointId={startPointId} setStartPointId={setStartPointId}
        destinations={destinations} setDestinations={setDestinations}
        onGetDirections={handleGetDirections}
        onClearRoute={handleClearRoute}
        isNavigating={isNavigating}
        onToggleVoiceNavigation={handleToggleVoiceNavigation}
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
          {FLOORS.map(floor => (
              <button key={floor} onClick={() => setCurrentFloor(floor)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentFloor === floor ? 'bg-blue-500 text-white shadow-inner' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {floorName(floor)}
              </button>
          ))}
        </div>
        <div className="flex-grow flex items-center justify-center">
            <StoreMap
              stores={visibleStores}
              path={visiblePath}
              startPoint={visibleStartPoint}
              destinations={destinations}
              onMapClick={handleMapClick}
              selectedStoreId={selectedStoreId}
            />
        </div>
      </div>
      {message && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full shadow-lg text-sm z-50">
          {message}
        </div>
      )}
    </div>
  );
};

// --- RENDER APP ---
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
