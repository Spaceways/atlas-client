import React, { useState, useEffect } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl';
import { InlineLoading, Tile, TooltipIcon } from 'carbon-components-react';
import { Feature, Polygon } from 'geojson';
import LivabilityModal from './LivabilityModal';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';

function Home() {
  const [govermentAreas, setGovernmentAreas] = useState({});

  const [viewport, setViewport] = useState({
    latitude: -37.8136,
    longitude: 144.9631,
    zoom: 8,
  });

  useEffect(() => {
    if (isEmpty(govermentAreas)) {
      axios
        .get(`/geodata/LGA.json`)
        .then(function (response) {
          setGovernmentAreas(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {});
    }
  }, [govermentAreas]);

  console.log("Areas", govermentAreas);

  /** Store active marker in state on click */
  const [activeLGA, setActiveLGA] = useState<Feature<Polygon, { ABB_NAME: string }> | undefined>();

  return (
    <React.Fragment>
      {!isEmpty(govermentAreas) && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '20px',
            zIndex: 1000,
            width: '300px',
          }}
        >
          <Tile light>
            <strong>Welcome to Spaceways</strong>
            <br />
            <br />
            This is our vision of how to measure liveability for the DELWP; we've generated randomised data for the purposes of this prototype. Click on an LGA to see more information.
            <div style={{textAlign: 'right'}}>
            <TooltipIcon
              align='center'
              direction='top'
              tooltipText="This prototype was created on the traditional lands of the Wurundjeri people of the Kulin Nation. We pay our respects to Elders past, present and emerging."
            >
              <img src="flag.svg" style={ { width: 60, height: 30, marginTop: 20, marginLeft: -4} } alt="Australian Aboriginal Flag" />
            </TooltipIcon>
            </div>
          </Tile>
        </div>
      )}

      {isEmpty(govermentAreas) && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>
            <InlineLoading description="Loading..." />
          </div>
        </div>
      )}
      {/* 
        Use the Modal component from Carbon, passing the activeLGA state as the open prop. 
        onRequestClose we set activeLGA to undefined which will reset the state.
      */}
      <LivabilityModal council={activeLGA?.properties.ABB_NAME} open={Boolean(activeLGA)} onRequestClose={ setActiveLGA } />
      {!isEmpty(govermentAreas) && (
        <MapGL
          {...viewport}
          width="100%"
          height="100%"
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
          /** On click, we can grab the features under the mouse (part of the PointerEvent) */
          onClick={({ features }) => {
            /** Set the LGA state to the first feature found that has the source id'd below (<Source />) */
            setActiveLGA(features.find((f: any) => f.source === 'melbourne-lgas'));
          }}
        >
          <Source type="geojson" data={govermentAreas as any} id="melbourne-lgas">
            <Layer
              type="fill"
              paint={{
                'fill-color': 'transparent',
                'fill-outline-color': '#9e72e3',
                'fill-opacity': 0.5,
              }}
            />
            <Layer
              type="symbol"
              paint={{ 'text-color': '#000' }}
              layout={{
                'text-field': ['to-string', ['get', 'ABB_NAME']],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
                /** You want to add your marker image URL (or mapbox sprite name) here */
                'icon-image': '',
              }}
            />
          </Source>
        </MapGL>
      )}
    </React.Fragment>
  );
}

export default Home;
