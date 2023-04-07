import Head from 'next/head';
import mapboxgl, {Marker} from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import 'mapbox-gl/dist/mapbox-gl.css';
import type {NextPage} from 'next';
import {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import {useAuth} from 'src/context/AuthContext';

const Map: NextPage = () => {
  var mapContainer = useRef<any>(null);
  var map = useRef<mapboxgl.Map | any>(null);

  //  if not auth push to login page
  const {currentUser} = useAuth();
  if (!currentUser) {
    window.location.href = '/auth/login';
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
    (map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [104.991, 12.5657], // center map on Chad longitude, latitude
      zoom: 1.8 || 6.5,
    })),
      [];
  });

  const geojson = {
    type: 'Feature',
    features: markers.map((marker) => ({
      geometry: {
        type: 'Point',
        coordinates: {
          lat: marker.latCoord,
          lng: marker.longCoord,
        },
      },
    })),
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
    map.current.on('load', () => {
      geojson.features.forEach((marker) => {
        // create a DOM element for the marker
        const markerIcon = document.createElement('div');
        markerIcon.className = 'location-marker';
        markerIcon.style.backgroundImage = 'url(/location-marker.png)';
        console.log('marker:::', marker);

        // markerIcon.style.width = marker.properties.iconSize[0] + 'px';
        // markerIcon.style.height = marker.properties.iconSize[1] + 'px';

        new mapboxgl.Marker(markerIcon)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map.current);
      });
    });
    [];
  });
  return (
    <>
      <Head>
        <title>Map</title>
        <meta name="description" content="Generated by create next app" />
        <meta
          name="viewport"
          content="initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <Box ref={mapContainer} minWidth={'100%'} minHeight={'100%'} />
    </>
  );
};

export default Map;

export const markers: Marker[] = [
  {
    city: 'Sydney',
    country: 'Australia',
    latCoord: -33.8688,
    longCoord: 151.2093,
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    latCoord: 52.3676,
    longCoord: 4.9041,
  },
  {
    city: 'Seoul',
    country: 'South Korea',
    latCoord: 37.5665,
    longCoord: 126.978,
  },
];
