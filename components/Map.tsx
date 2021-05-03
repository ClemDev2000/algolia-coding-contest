import {
  GoogleMapsLoader,
  GeoSearch,
  Marker,
} from 'react-instantsearch-dom-maps';

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function Map() {
  return (
    <div className="min-h-screen col-span-2">
      <GoogleMapsLoader apiKey={googleApiKey}>
        {(google) => (
          <GeoSearch
            google={google}
            enableRefineOnMapMove={false}
            initialZoom={8}
          >
            {({ hits }) => (
              <div>
                {hits.map((hit) => (
                  <Marker key={hit.objectID} hit={hit} />
                ))}
              </div>
            )}
          </GeoSearch>
        )}
      </GoogleMapsLoader>
    </div>
  );
}
