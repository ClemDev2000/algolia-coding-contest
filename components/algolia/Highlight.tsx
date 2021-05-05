import { connectHighlight } from 'react-instantsearch-dom';

const Highlight = ({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return (
    <span>
      {parsedHit.map((part, index) =>
        part.isHighlighted ? (
          <span className="text-red-400" key={index}>
            {part.value}
          </span>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
};

const CustomHighlight = connectHighlight(Highlight);

export default CustomHighlight;
