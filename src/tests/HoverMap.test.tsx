// TESTING IN PROGRESS, WILL BE IN NEXT RELEASE
// import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import HoverMap from '../components/HoverMap';
// import user from '@testing-library/user-event';
// enableFetchMocks()

// interface CustomMouseEvent extends MouseEvent {
//     click: (event?: MouseEvent) => void
// }

// const actualReactLeaflet = jest.requireActual('react-leaflet');

// // Mock the react-leaflet module but use the real implementation
// jest.mock('react-leaflet', () => {
//     return {
//         ...actualReactLeaflet, // Use the real implementation of react-leaflet
//     };
// });

// jest.mock('react-leaflet', () => {
//     const { Tooltip } = jest.requireActual('react-leaflet');

//     interface MockLayer {
//         feature: {
//             properties: {
//                 name: string
//             }
//         }
//         style: Record<string, unknown>
//         setStyle: jest.Mock<void, [Record<string, unknown>]>
//         on: jest.Mock<void, [MouseEvent]>
//     }

//     let eventCounter = 0;

//     const mockGeoJSON = React.forwardRef(({ onEachFeature }: { onEachFeature: (a: Record<string, unknown>, b: MockLayer) => void }, ref: React.LegacyRef<HTMLDivElement>): JSX.Element => {
//         const mockLayer: MockLayer = {
//             feature: {
//                 properties: { name: '' }
//                 // THIS WAS AUTOMATICALLY RETURNING NEVADA, NOW, IT RETURNS '' AT FIRST,
//                 // YOU NEED TO FIGURE OUT A WAY TO SET THE NAME ON CLICK IN YOUR TEST.  
//                 // USER.CLICK IN THE FIRST TEST SHOULD PASS WHEN THERE, AND FAIL WHEN COMMENTED
//             },
//             style: {},
//             setStyle: jest.fn((style) => {
//                 mockLayer.style = style;
//             }),
//             on: jest.fn((event: MouseEvent | CustomMouseEvent) => {
//                 const eventTarget = mockLayer as unknown as EventTarget;
//                 const mouseEvent: MouseEvent = {
//                     ...event,
//                     target: eventTarget,
//                 };

//                 if ('click' in event) {
//                     // Check if it is the first event
//                     if (eventCounter > 0) {
//                         console.log('inside the click iff', eventCounter)
//                         mockLayer.feature.properties.name = 'Nevada'

//                     }

//                     event.click(mouseEvent)

//                 }
//                 eventCounter++;

//             })

//         };

//         onEachFeature({}, mockLayer);
//         return (
//             <div ref={ref} onClick={(e) => {
//                 const mouseEvent = e as unknown as MouseEvent | CustomMouseEvent;
//                 const customMouseEvent: CustomMouseEvent = {
//                     ...mouseEvent,
//                     click: (event) => {
//                         // Perform the click action here if needed
//                         console.log('Click event triggered!');
//                     },
//                 };
//                 mockLayer.on(customMouseEvent)
//             }} data-testid="geoJson">
//                 <Tooltip data-testid="toolTip" sticky>
//                     <h1 data-testid="nameDisplay">{mockLayer.feature.properties.name}</h1>
//                 </Tooltip>
//             </div>
//         );
//     });

//     return {
//         ...jest.requireActual('react-leaflet'),
//         GeoJSON: mockGeoJSON,
//         Tooltip
//     };
// });

// // import L from 'leaflet'; // This should map to the custom Leaflet implementation in `node_modules/leaflet/src/Leaflet.js`
// // import { MapContainer } from 'react-leaflet'; // This should map to the custom React-Leaflet implementation in `node_modules/react-leaflet/lib/index.js`


// describe('HoverMap Component', () => {
//     // let fetchMock: jest.MockedFunction<typeof global.fetch>;
//     const setStateMock = jest.fn()

//     let useStateMock = jest.spyOn(React, 'useState');
//     console.log('what does usestatemock look like here?', useStateMock)
//     // let previousNameRefMock = jest.spyOn(React, 'useRef')
//     beforeEach(() => {
//         jest.clearAllMocks();
//         fetchMock.resetMocks();
//         jest.resetModules()
//         useStateMock = jest.spyOn(React, 'useState');
//     })

//     afterEach(() => {
//         useStateMock.mockRestore()
//     });



//     test('mouseover event on GeoJSON layer triggers state update', async () => {
//         fetchMock.mockResponseOnce(JSON.stringify({ data: [{ key: 'newValue' }], keys: [], title: '' }))

//         const previousNameRefMock = { current: '' };  // Initial value for current
//         const mockGeoRef = {
//             current: {
//                 eachLayer: jest.fn()  // Mock the "eachLayer" method
//             }
//         };

//         // Set previousName.current to a non-empty string
//         jest.spyOn(React, 'useRef').mockReturnValueOnce(mockGeoRef).mockReturnValueOnce(previousNameRefMock)

//         // the following lines mocks the intial state in the component being rendered
//         useStateMock
//             .mockReturnValueOnce([{ data: [], key: [], title: '' }, setStateMock]) // crime
//             .mockReturnValueOnce(['', setStateMock]) // name
//             .mockReturnValueOnce([['', ''], setStateMock]) // stateAb
//             .mockReturnValueOnce(['1996', setStateMock]) // displayYear
//             .mockReturnValueOnce([false, setStateMock]) // noData
//             .mockReturnValueOnce([1024, setStateMock]) // noData
//             .mockReturnValueOnce([false, setStateMock]) // noData
//             .mockReturnValueOnce([null, setStateMock]) // noData
//             .mockReturnValueOnce([false, setStateMock]); // noData


//         render(<HoverMap />)

//         // Verify initial state setup
//         expect(useStateMock).toHaveBeenCalledWith({ data: [], keys: [], title: '' });
//         expect(useStateMock).toHaveBeenCalledWith('');
//         expect(useStateMock).toHaveBeenCalledWith(['', '']);
//         expect(useStateMock).toHaveBeenCalledWith('1996');
//         expect(useStateMock).toHaveBeenCalledWith(false);
//         expect(useStateMock).toHaveBeenCalledWith(1024);
//         expect(useStateMock).toHaveBeenCalledWith(false);
//         expect(useStateMock).toHaveBeenCalledWith(null);
//         expect(useStateMock).toHaveBeenCalledWith(false);

//         const geoJsonElement = screen.getByTestId('geoJson');

//         await user.click(geoJsonElement);

//         await waitFor(() => {
//             expect(fetchMock.mock.calls.length).toBe(1)
//             expect(setStateMock).toHaveBeenCalledTimes(8)
//             expect(setStateMock).toHaveBeenCalledWith('Nevada');
//             expect(setStateMock).toHaveBeenCalledWith(['Nevada', 'NV'])
//             expect(setStateMock).toHaveBeenCalledWith({
//                 data: [{ key: 'newValue' }], keys: [], title: ''
//             });
//         })
//     })

//     // test('mouseOver event on GeoJSON layer triggers failed fetch call', async () => {
//     //     fetchMock.mockResponseOnce('', { status: 404 })

//     //     useStateMock
//     //         .mockReturnValueOnce([{ data: [], key: [], title: '' }, setStateMock])
//     //         .mockReturnValueOnce(['', setStateMock])
//     //         .mockReturnValueOnce([['Alabama', 'AL'], setStateMock])
//     //         .mockReturnValueOnce(['1996', setStateMock])
//     //         .mockReturnValueOnce([false, setStateMock])
//     //         .mockReturnValueOnce([1024, setStateMock]) // noData
//     //         .mockReturnValueOnce([false, setStateMock]) // noData
//     //         .mockReturnValueOnce([null, setStateMock]) // noData
//     //         .mockReturnValueOnce([false, setStateMock]); // noData

//     //     render(<HoverMap />);

//     //     const geoJsonElement = screen.getByTestId('geoJson');

//     //     await user.click(geoJsonElement);

//     //     await waitFor(() => {
//     //         expect(fetchMock).toHaveBeenCalled()
//     //         expect(fetchMock.mock.calls.length).toBe(1);
//     //         // CHeck if crime is set without data after fetchMock call
//     //         expect(setStateMock).toHaveBeenCalledWith({
//     //             data: [], keys: [], title: ''
//     //         });
//     //     })
//     // })

//     // test('mouseout event on GeoJSON layer triggers state update', async () => {
//     //     mouseOut = true

//     //     useStateMock
//     //         .mockReturnValueOnce([{ data: [], key: [], title: '' }, setStateMock])
//     //         .mockReturnValueOnce(['', setStateMock])
//     //         .mockReturnValueOnce([['Alabama', 'AL'], setStateMock])
//     //         .mockReturnValueOnce(['1996', setStateMock])
//     //         .mockReturnValueOnce([false, setStateMock]);

//     //     render(<HoverMap />);

//     //     const geoJsonElement = screen.getByTestId('geoJson');

//     //     await user.unhover(geoJsonElement)

//     //     await waitFor(() => {
//     //         expect(setStateMock).toHaveBeenCalledTimes(6)
//     //         expect(setStateMock).toHaveBeenCalledWith({ data: [], keys: [], title: '' })
//     //         expect(setStateMock).toHaveBeenCalledWith(false)
//     //         expect(setStateMock).toHaveBeenCalledWith('')
//     //         expect(setStateMock).toHaveBeenCalledWith(['', ''])
//     //     })
//     //     useStateMock.mockRestore()
//     // });

//     // test('it calls setDisplayYear when input is typed in', async () => {
//     //     mouseOut = false

//     //     useStateMock
//     //         .mockReturnValueOnce([{ data: [], key: [], title: '' }, setStateMock])
//     //         .mockReturnValueOnce(['', setStateMock])
//     //         .mockReturnValueOnce([['Alabama', 'AL'], setStateMock])
//     //         .mockReturnValueOnce(['1996', setStateMock])
//     //         .mockReturnValueOnce([false, setStateMock])

//     //     render(<HoverMap />)

//     //     const [yearInput] = screen.getAllByRole('spinbutton')
//     //     await user.click(yearInput)
//     //     await user.keyboard('[backspace][backspace][backspace][backspace]')
//     //     await user.keyboard('1934')
//     //     await waitFor(() => {
//     //         expect(setStateMock).toHaveBeenCalledWith('199');
//     //         expect(setStateMock).toHaveBeenCalledWith('19');
//     //         expect(setStateMock).toHaveBeenCalledWith('1');
//     //         expect(setStateMock).toHaveBeenCalledWith('')
//     //         expect(setStateMock).toHaveBeenCalledWith('1')
//     //         expect(setStateMock).toHaveBeenCalledWith('19')
//     //         expect(setStateMock).toHaveBeenCalledWith('193')
//     //         expect(setStateMock).toHaveBeenCalledWith('1934')
//     //     })
//     // })
//     // test('mouseover event on GeoJSON layer triggers state update, with successful but empty fetch data return ', async () => {
//     //     emptyNameReturn = true
//     //     fetchMock.mockResponseOnce(JSON.stringify({ data: [], keys: [], title: '' }))

//     //     useStateMock
//     //         .mockReturnValueOnce([{ data: [], key: [], title: '' }, setStateMock])
//     //         .mockReturnValueOnce(['', setStateMock])
//     //         .mockReturnValueOnce([['', ''], setStateMock])
//     //         .mockReturnValueOnce(['', setStateMock])
//     //         .mockReturnValueOnce([true, setStateMock])

//     //     render(<HoverMap />)

//     //     const geoJsonElement = screen.getByTestId('geoJson');

//     //     await user.hover(geoJsonElement);

//     //     await waitFor(() => {
//     //         expect(fetchMock.mock.calls.length).toBe(1)
//     //         expect(setStateMock).toHaveBeenCalledTimes(5)
//     //         expect(setStateMock).toHaveBeenCalledWith('');
//     //         expect(setStateMock).toHaveBeenCalledWith({
//     //             data: [], keys: [], title: ''
//     //         })
//     //         expect(setStateMock).toHaveBeenCalledWith(['', ''])
//     //         expect(setStateMock).toHaveBeenCalledWith(true)
//     //     })
//     // })
//     // test('defaultValue of yearInput is set to empty string', () => {
//     //     emptyNameReturn = true
//     //     fetchMock.mockResponseOnce(JSON.stringify({ data: [], keys: [], title: '' }))

//     //     useStateMock
//     //         .mockReturnValueOnce([{ data: [], key: [], title: '' }, setStateMock])
//     //         .mockReturnValueOnce(['', setStateMock])
//     //         .mockReturnValueOnce([['', ''], setStateMock])
//     //         .mockReturnValueOnce([undefined, setStateMock])
//     //         .mockReturnValueOnce([true, setStateMock])

//     //     render(<HoverMap />)
//     //     const [yearInput] = screen.getAllByRole('spinbutton')

//     //     expect(yearInput).toHaveTextContent('')
//     // });
// });
