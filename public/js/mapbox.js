/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic29tMTIzNCIsImEiOiJjbHIwcnFsNXEwazgzMmpvZHhqZ3k5NjBtIn0.440G52muCB-94SJReb57DA';

  var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/som1234/clr0sfdk8019n01pj12gcakdw', // style URL
    scrollZoom: false,
    //   center: [-118.113491, 34.111745], //longlat
    //   zoom: 10,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Addpopup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
