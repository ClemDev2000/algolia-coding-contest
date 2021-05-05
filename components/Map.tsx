import {
  GoogleMapsLoader,
  GeoSearch,
  Marker,
} from 'react-instantsearch-dom-maps';

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function Map() {
  return (
    <div className="col-span-2 hidden md:block">
      <GoogleMapsLoader apiKey={googleApiKey}>
        {(google) => (
          <GeoSearch
            google={google}
            enableRefineOnMapMove={true}
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
