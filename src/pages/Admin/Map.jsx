import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navbar from '../../components/Navbar';
import { db } from '../../config/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

const AdminMap = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'tickets'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTickets(docs);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (map.current) return; // Initialize once

        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) return;

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11', // Dark map for better heatmap visibility
            center: [72.8997, 19.0730], // Somaiya Campus
            zoom: 15
        });

        map.current.on('load', () => {
            // Initialize sources if needed, but we do it in the next effect when data changes
        });
    }, []);

    // Update map source when tickets change
    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded() || tickets.length === 0) return;

        const geoJsonData = {
            type: 'FeatureCollection',
            features: tickets
                .filter(t => t.location && t.location.lng && t.location.lat)
                .map(t => ({
                    type: 'Feature',
                    properties: {
                        id: t.id,
                        urgency: t.urgency || 1,
                        status: t.status
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [t.location.lng, t.location.lat]
                    }
                }))
        };

        if (map.current.getSource('tickets')) {
            map.current.getSource('tickets').setData(geoJsonData);
        } else {
            map.current.addSource('tickets', {
                type: 'geojson',
                data: geoJsonData
            });

            // Heatmap Layer
            map.current.addLayer({
                id: 'tickets-heat',
                type: 'heatmap',
                source: 'tickets',
                maxzoom: 17,
                paint: {
                    // Increase the heatmap weight based on frequency and property urgency
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'urgency'],
                        0, 0,
                        10, 1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 1,
                        17, 3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 2,
                        15, 20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 1,
                        17, 0
                    ],
                }
            });

            // Circle layer for individual points
            map.current.addLayer({
                id: 'tickets-point',
                type: 'circle',
                source: 'tickets',
                minzoom: 14,
                paint: {
                    'circle-radius': 6,
                    'circle-color': [
                        'match',
                        ['get', 'status'],
                        'open', '#ef4444',
                        'in_progress', '#f59e0b',
                        'resolved', '#10b981',
                    /* other */ '#ccc'
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        14, 0,
                        17, 1
                    ]
                }
            });

            map.current.on('click', 'tickets-point', (e) => {
                new mapboxgl.Popup()
                    .setLngLat(e.features[0].geometry.coordinates)
                    .setHTML(`<strong>Urgency: ${e.features[0].properties.urgency}</strong><p>Status: ${e.features[0].properties.status}</p>`)
                    .addTo(map.current);
            });

            map.current.on('mouseenter', 'tickets-point', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });
            map.current.on('mouseleave', 'tickets-point', () => {
                map.current.getCanvas().style.cursor = '';
            });
        }

    }, [tickets]);


    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, position: 'relative' }}>
                <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
                <div className="glass-card" style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Heatmap Legend</h3>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        Visualizing density and urgency of complaints.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMap;
