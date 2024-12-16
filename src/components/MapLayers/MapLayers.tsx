import { useState } from 'react';
import { IconSolarPanel2, IconTrash } from '@tabler/icons-react';
import * as turf from '@turf/turf';
import {
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  GeoJSONFeature,
  LngLatBounds,
} from 'mapbox-gl';
import { Layer, Marker, NavigationControl, useMap } from 'react-map-gl';
import { ActionIcon, Button, Card, Stack, Switch, Title, Tooltip } from '@mantine/core';

type MapCoords = {
  coordinates: any;
  score: any;
};

enum FeatureType {
  Land,
  Buildings,
}

//#region Layers

const buildingsLayer: FillExtrusionLayerSpecification = {
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 5,
  paint: {
    'fill-extrusion-color': [
      'match',
      ['get', 'type'], //Match the 'type' property
      'commercial',
      '#33c7ff', //Commercial in blue
      'train_station',
      '#FFCFEF', //Train stations in pink
      'apartments',
      '#00ff00', //Apartments in green
      'residential',
      '#00ff00', //Residential in green
      'school',
      '#D3F1DF', //Schools in pale green
      'university',
      '#D3F1DF', //Universities in pale green
      'hospital',
      '#FF7F3E',
      'sports_centre',
      '#0A97B0', //Schools in pale green
      'industrial',
      '#f03b20', //Industrial in yellow
      'government',
      '#432E54',
      'public',
      '#432E54',
      'office',
      '#7E1891', //Offices in purple
      '#aaa', //Default colour for other types
    ],
    'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 5, 0, 5.05, ['get', 'height']],
    'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 5, 0, 5.05, ['get', 'min_height']],
    'fill-extrusion-opacity': 0.8,
  },
};

const landUseLayer: FillLayerSpecification = {
  id: 'land-use',
  source: 'composite',
  'source-layer': 'landuse', //Replace with the actual source-layer name for land use
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'class'], //Match the 'class' or similar property for land use
      'residential',
      '#a8ddb5', //Residential in green
      'commercial',
      '#43a2ca', //Commercial in blue
      'industrial',
      '#f03b20', //Industrial in red
      'agriculture',
      '#fee391', //Agriculture in yellow
      '#ddd', //Default colour for undefined classes
    ],
    'fill-opacity': 0.25, //Adjust opacity for better visibility
  },
};

//#endregion

export default function MapLayers() {
  //#region Properties

  //#endregion

  //#region Hooks

  const { current: map } = useMap();
  const [visibleLayers, setVisibleLayers] = useState({
    buildings: true,
    landUse: true,
  });
  const [marker, setMarker] = useState<MapCoords | null>(null);

  //#endregion

  //#region Functions

  //Function to get the suitability score based on land use type
  const getLandUseScore = (landUseType: string) => {
    const landSuitabilityScore: Record<string, number> = {
      industrial: 1.5,
      commercial: 0.9,
      residential: 0.01,
      default: 0.01,
    };

    return landSuitabilityScore[landUseType] || landSuitabilityScore.residential; //Default to residential score
  };

  //Function to determine building suitability score based on its type
  const getBuildingSuitabilityScore = (buildingType: string): number => {
    const buildingSuitability: Record<string, number> = {
      commercial: 1.0,
      industrial: 0.9,
      residential: 0.3,
      office: 0.7,
      government: 0.5,
      school: 0.6,
      hospital: 0.8,
      train_station: 0.85,
      apartments: 0.4,
      default: 0.2,
    };

    //Return the suitability score for the building type or default if type is unknown
    return buildingSuitability[buildingType] || buildingSuitability.default;
  };

  const getOptimalLocation = (
    mapBounds: LngLatBounds | null,
    usageFeatures: GeoJSONFeature[],
    featuresToCalculateWith: FeatureType
  ): MapCoords | null => {
    if (!mapBounds) {
      return null;
    }

    const north = mapBounds.getNorth();
    const east = mapBounds.getEast();
    const south = mapBounds.getSouth();
    const west = mapBounds.getWest();

    //Create a bounding box polygon based on the map bounds
    const bboxPolygon = turf.bboxPolygon([west, south, east, north]);

    //Filter features within the bounds of the map view
    const featuresWithinBounds = usageFeatures.filter((feature) => {
      if (feature.geometry.type === 'Polygon') {
        //Create the polygon from the feature's coordinates
        const polygon = turf.polygon(feature.geometry.coordinates);

        //Check if the polygon intersects the bounding box
        return turf.booleanIntersects(polygon, bboxPolygon);
      }

      return false; //If it's not a polygon, skip it
    });

    //Array to hold suitable features' centroids and scores
    let totalScore = 0;
    let weightedX = 0;
    let weightedY = 0;

    featuresWithinBounds.forEach((zone: any) => {
      const score =
        featuresToCalculateWith === FeatureType.Land
          ? getLandUseScore(zone.properties.class)
          : getBuildingSuitabilityScore(zone.properties.type);

      console.log(zone);

      //If score is above a certain threshold, mark it as suitable
      if (score > 0.5) {
        //Calculate the centroid of the polygon
        const polygon = turf.polygon(zone.geometry.coordinates);
        const centroid = turf.centroid(polygon);

        //Calculate weighted centroid using score as weight
        weightedX += centroid.geometry.coordinates[0] * score;
        weightedY += centroid.geometry.coordinates[1] * score;
        totalScore += score;
      }
    });

    //If no suitable markers found, return null or a default value
    if (totalScore === 0) {
      return null;
    }

    //Calculate the weighted centroid by dividing the sum of the weighted coordinates by the total score
    const optimalCoordinates = [weightedX / totalScore, weightedY / totalScore];

    //Return the optimal marker location with its coordinates and score
    const markerLocation: MapCoords = {
      coordinates: optimalCoordinates,
      score: totalScore,
    };

    return markerLocation;
  };

  //Toggle layer visibility function
  const toggleLayer = (layer: 'buildings' | 'landUse') => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  //Capture current map bounds when the button is clicked
  const handleCalculateOptimalLocations = (featuresToCalculateWith: FeatureType) => {
    if (map) {
      const bounds = map.getBounds();
      const landUseData = map.querySourceFeatures('composite', {
        sourceLayer: 'landuse',
      });
      const buildingUseData = map.querySourceFeatures('composite', {
        sourceLayer: 'building', //The source layer for buildings, you can switch this out for landuse if you'd like
      });

      const optimalLocation = getOptimalLocation(
        bounds,
        featuresToCalculateWith === FeatureType.Land ? landUseData : buildingUseData,
        featuresToCalculateWith
      );
      console.log('optimal locations', optimalLocation);

      optimalLocation && setMarker(optimalLocation);
    }
  };

  //#endregion

  return (
    <>
      <NavigationControl />
      {/* Conditional Rendering of Layers */}
      {visibleLayers.landUse && <Layer {...landUseLayer} />}
      {visibleLayers.buildings && <Layer {...buildingsLayer} />}

      {/* Place Markers based on calculated optimal locations */}
      {marker && (
        <Marker longitude={marker.coordinates[0]} latitude={marker.coordinates[1]} anchor="bottom">
          <ActionIcon color="yellow" size={50} radius="xl">
            <IconSolarPanel2 />
          </ActionIcon>
        </Marker>
      )}

      {/* Mantine Layer Toggle Controls */}
      <Card
        shadow="sm"
        p="md"
        radius="md"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: 'white',
        }}
      >
        <Title order={4}>Toggle Layers</Title>
        <Stack gap="sm" mt="sm">
          <Switch
            checked={visibleLayers.landUse}
            onChange={() => toggleLayer('landUse')}
            label="Land Use"
          />
          <Switch
            checked={visibleLayers.buildings}
            onChange={() => toggleLayer('buildings')}
            label="3D Buildings"
          />
          <Button
            onClick={() => handleCalculateOptimalLocations(FeatureType.Land)}
            fullWidth
            variant="light"
          >
            Find Optimal Power Plant Location using Land
          </Button>
          <Button
            onClick={() => handleCalculateOptimalLocations(FeatureType.Buildings)}
            fullWidth
            variant="light"
          >
            Find Optimal Power Plant Location using Buildings
          </Button>
          <Tooltip label="Clear marker">
            <Button onClick={() => setMarker(null)} fullWidth variant="light" color="red">
              <IconTrash />
            </Button>
          </Tooltip>
        </Stack>
      </Card>
    </>
  );
}
