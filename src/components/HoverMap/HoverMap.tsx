import React, { useState, useRef, useEffect, useCallback } from 'react'
import { latLngBounds, Map, GeoJSON as leafletGeoJson } from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { statesData } from '../../stateData/geoJson'
import { states } from '../../stateData/stateAbb'
import 'leaflet/dist/leaflet.css'
import styles from './HoverMap.module.scss'
import LoadSpinner from '../LoadSpinner/index'
import { LayerEvent } from 'leaflet'

const unitedStatesBounds = latLngBounds(
  [24.396308, -125.0], // Southwest corner
  [49.384358, -66.93457] // Northeast corner
);

const HoverMap = (): React.JSX.Element => {
  const [crime, setCrime] = useState<Schemas.Crime>({ data: [], keys: [], title: '' })
  const [name, setName] = useState('')
  const [stateAb, setStateAb] = useState<string[]>(['', ''])
  const [displayYear, setDisplayYear] = useState('1996')
  const [noData, setNoData] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [zoomed, setZoomed] = useState(false);
  const [map, setMap] = useState<Map | null>(null);
  const [loading, setLoading] = useState(false);

  const windowWidthRef = useRef(window.innerWidth);
  const year = useRef('1996')
  const timeout = useRef<NodeJS.Timeout>()
  const geoRef = useRef<leafletGeoJson | null>(null)
  const previousName = useRef<string>('');

  const debounce = useCallback(<T extends () => ReturnType<T>>(
    fn: T,
    ms: number
  ): ((...args: string[]) => void) =>
    () => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        fn()
      }, ms)
    }, [])


  const resizeMap = (map: Map): void => {
    if (map) {
      map.invalidateSize();

      map.setZoom(map.getZoom())

      // Check if the window width has changed
      if (windowWidth !== windowWidthRef.current && zoomed === false) {
        map.fitBounds(unitedStatesBounds)
        windowWidthRef.current = windowWidth;
        setZoomed(false)
      }
      setMap(map)
    }
  };

  const setYearRef = (newYear: string): void => {
    year.current = newYear

    setDisplayYear(newYear)
  }

  const getCrime = useCallback(async (): Promise<void> => {

    try {
      const response = await fetch(
        `https://api.usa.gov/crime/fbi/cde/arrest/state/${stateAb[1]
        }/all?from=${year.current}&to=${year.current
        }&API_KEY=${process.env.FETCH_URL}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Schemas.Crime = await response.json()
      if (data.data.length === 0) {
        setNoData(true)
      } else {
        setNoData(false)
        setCrime(data)
      }
    } catch (error) {
      setNoData(true)
      setCrime({ data: [], keys: [], title: '' })
    } finally {
      setLoading(false)
    }
  }, [stateAb])

  const formattedData = (): React.JSX.Element | React.JSX.Element[] => {
    if (noData || !crime || !Array.isArray(crime.data) || crime.data.length === 0 && !loading) {
      return <div className={styles.info}>No Data for {name}</div>;
    }
    return <div className={styles.info}><h1>{name}</h1>{Object.entries(crime.data[0])
      .map(([k, v]) => `${k}:${v} `)
      .map((x, i) => <div key={i}>{x}</div>)}</div>
  };

  const handleMouseClick = (e: LayerEvent): void => {
    if (geoRef.current) {
      geoRef.current.eachLayer((layer) => {
        if (geoRef.current) {
          geoRef.current.resetStyle(layer);
        }
      });
    }
    const layer = e.target;
    layer.setStyle({ fillColor: 'red' });

    if (previousName.current !== name || previousName.current === '') {
      setName(layer.feature.properties.name);
      setStateAb(states.find((x) => x[0] === layer.feature.properties.name) ?? ['', '']);
    } else {
      setCrime({ data: [], keys: [], title: '' });

    }

    previousName.current = name;
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
      setZoomed(true); // Mark zoom action
    }
  };

  const handleZoomOut = () => {
    if (map && map.getZoom() > 1) {
      map.setZoom(map.getZoom() - 1);
      setZoomed(true); // Mark zoom action
    }
  };

  useEffect(() => {
    const fetchData = (): void => {
      debounce(getCrime, 500)();
    }
    if (stateAb[0] !== '') {
      setLoading(true)
      fetchData();

    } else {
      setCrime({ data: [], keys: [], title: '' })
    }
  }, [getCrime, stateAb, debounce]);

  useEffect(() => {
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const AdjustableView = (): null => {
    const map = useMap();

    useEffect(() => {
      resizeMap(map);
    }, [map]);

    return null
  };

  useEffect(() => {
    if (displayYear.length === 4 && name) {
      debounce(getCrime, 500)()
    }
  }, [displayYear])

  return (
    <div className={styles.container}>
      <h1 className={styles.hoverMe}>Click to View Crime By State</h1>
      <div className={styles.labelYearContainer}>
        <label>Year:</label>
        <h4 data-testid='displayYear' className={styles.displayYear}>{displayYear}</h4>
      </div>
      <div className={styles.yearInputContainer}>
        <h5>Year Below</h5>
        <input
          min='1900'
          max='2016'
          type='number'
          placeholder='Years'
          onChange={(e) => { setYearRef(e.target.value) }}
          data-testid='yearInput'
          name='yearInput'
          defaultValue={displayYear ?? ''}
          disabled={name ? false : true}
          title={name ? '' : 'Select A State to View By Year'}
          className={styles.yearInput}
        />
      </div>

      <div className={styles.mapInfoDisplayContainer}>
        <div className={styles.mapContainer}>
          <div className={styles.zoomButtonContainer}>
            <button className={styles.zoomButton} onClick={() => handleZoomIn()}>Zoom In</button>
            <button className={styles.zoomButton} onClick={() => handleZoomOut()}>Zoom Out</button>
          </div>
          <MapContainer
            className={styles.mapStyle}
            center={[37.8, -96]}
            bounds={unitedStatesBounds}
            zoom={map?.getBoundsZoom(unitedStatesBounds)}
            zoomControl={false}
            scrollWheelZoom={false}
            data-testid='map-container'
          >
            <AdjustableView />
            <TileLayer
              maxZoom={19}
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              className={styles.tileLayerStyle}
            />

            <GeoJSON
              data={statesData}
              data-testid='geoJson'
              onEachFeature={(_, layer) => {

                layer.on({
                  click: handleMouseClick,
                })
              }}

              ref={geoRef}
            />
          </MapContainer>

        </div>
        <div className={styles.infoDisplayContainer} >
          {loading ? <div><LoadSpinner /></div> : <div className={styles.infoDisplay}>{formattedData()}</div>}
        </div>
      </div>
    </div >
  )
}

export default HoverMap;
