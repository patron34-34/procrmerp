import React, { useEffect, useRef } from 'react';
import { Customer } from '../../types';
import L from 'leaflet';

interface CustomerMapViewProps {
    customers: Customer[];
}

const CustomerMapView: React.FC<CustomerMapViewProps> = ({ customers }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersLayer = useRef<L.LayerGroup | null>(null);
    
    // Custom icon creation
    const createIcon = (color: string) => {
        return L.divIcon({
            html: `<svg viewBox="0 0 24 24" fill="${color}" class="w-8 h-8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
            className: 'bg-transparent border-0',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    };

    const statusIcons = {
        aktif: createIcon('#22c55e'), // green
        potensiyel: createIcon('#3b82f6'), // blue
        kaybedilmiş: createIcon('#64748b'), // slate
    };

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([39.9255, 32.8663], 6); // Center on Turkey
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
            markersLayer.current = L.layerGroup().addTo(mapInstance.current);
        }
    }, []);

    useEffect(() => {
        if (markersLayer.current && mapInstance.current) {
            markersLayer.current.clearLayers();
            
            const validCustomers = customers.filter(c => c.billingAddress?.coordinates && c.billingAddress.coordinates.lat && c.billingAddress.coordinates.lng);

            validCustomers.forEach(customer => {
                const marker = L.marker([customer.billingAddress.coordinates!.lat, customer.billingAddress.coordinates!.lng], {
                   icon: statusIcons[customer.status] || statusIcons.kaybedilmiş
                }).bindPopup(
                    `<b>${customer.name}</b><br>${customer.company}<br><a href="#/customers/${customer.id}" class="text-primary-600">Detayları Gör</a>`
                );
                if(markersLayer.current){
                    markersLayer.current.addLayer(marker);
                }
            });
            
            if (validCustomers.length > 0) {
                const bounds = L.latLngBounds(validCustomers.map(c => [c.billingAddress.coordinates!.lat, c.billingAddress.coordinates!.lng]));
                mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [customers]);

    return (
        <div ref={mapRef} style={{ height: '600px', width: '100%' }} className="rounded-lg z-0" />
    );
};

export default CustomerMapView;