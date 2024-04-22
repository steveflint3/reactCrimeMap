/* eslint-disable @typescript-eslint/no-var-requires */
// // // // src/setupTests.ts
// // import '@testing-library/jest-dom';
// // import 'jest';
// // import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
// // import L from 'leaflet'; // Import Leaflet library

// // // Ensure that Leaflet's CSS and global variables are available
// // global.L = L;

// import '@testing-library/jest-dom';
// import 'jest';
// import React from 'react';
// // import { render } from '@testing-library/react';
// // import { MapContainer } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
// import L from 'leaflet'; // Import Leaflet library

// // Ensure that Leaflet's CSS and global variables are available
// global.L = L;

// // Mock react-leaflet
// jest.mock('react-leaflet', () => {
//   const ReactLeaflet = jest.requireActual('react-leaflet');
//   return {
//     ...ReactLeaflet,
//     __esModule: true,
//     MapContainer: ({ children, ...props }) => React.createElement('div', props, children), // Mock MapContainer
//     TileLayer: ({ children, ...props }) => React.createElement('div', props, children), // Mock TileLayer if used
//     GeoJSON: ({ children, ...props }) => React.createElement('div', props, children), // Mock GeoJSON if used
//     Tooltip: ({ children, ...props }) => React.createElement('div', props, children) // Mock Tooltip if used
//     // Add more mocks for other react-leaflet components if necessary
//   };
// });
