import { useEffect, useRef } from 'react';

const SearchBox = ({ map, onPlaceSelect }) => {
  const searchBoxRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (map && !searchBoxRef.current) {
      console.log('🔍 Initializing search box for map:', !!map);
      console.log('🗺️ Map instance available:', map);
      // Create a container div for the search box
      const searchContainer = document.createElement('div');
      searchContainer.className = 'google-maps-search-box';


      // Create the input element
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = '🔍 Search for a location...';
      input.className = 'google-maps-search-input';

      // Add input to container
      searchContainer.appendChild(input);
      containerRef.current = searchContainer;

      // Store event handlers for cleanup
      const focusHandler = () => {
        searchContainer.style.borderColor = '#1a73e8';
        searchContainer.style.boxShadow = '0 4px 16px rgba(66, 133, 244, 0.3)';
      };

      const blurHandler = () => {
        searchContainer.style.borderColor = '#4285f4';
        searchContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      };

      // Add focus effects
      input.addEventListener('focus', focusHandler);
      input.addEventListener('blur', blurHandler);

      // Initialize Places SearchBox
      if (window.google.maps.places && window.google.maps.places.SearchBox) {
        searchBoxRef.current = new window.google.maps.places.SearchBox(input);
      } else {
        console.error('❌ Google Maps Places API not available');
        input.placeholder = 'Places API not available - check API key';
        return;
      }

      // Add to map controls at TOP_LEFT position (before other controls)
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].insertAt(0, searchContainer);
      console.log('✅ Search box added to map controls');
      console.log('🔍 Search box controls:', map.controls[window.google.maps.ControlPosition.TOP_LEFT].getArray().length);

      // Listen for place selection
      searchBoxRef.current.addListener('places_changed', () => {
        const places = searchBoxRef.current.getPlaces();

        if (places.length === 0) {
          return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            return;
          }

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        map.fitBounds(bounds);

        if (onPlaceSelect) {
          onPlaceSelect(places[0]);
        }
      });
    }

    return () => {
      if (searchBoxRef.current) {
        // Clean up
        window.google.maps.event.clearInstanceListeners(searchBoxRef.current);
        searchBoxRef.current = null;
      }


      // Remove from map controls
      if (containerRef.current && map && map.controls) {
        const controls = map.controls[window.google.maps.ControlPosition.TOP_LEFT];
        if (controls && controls.getArray) {
          const array = controls.getArray();
          const index = array.indexOf(containerRef.current);
          if (index > -1) {
            controls.removeAt(index);
          }
        }
      }

      // Clean up stored references
      containerRef.current = null;
    };
  }, [map, onPlaceSelect]);

  // This component doesn't render anything visible in the sidebar anymore
  // The search box is added directly to Google Maps controls
  return null;
};

export default SearchBox;
