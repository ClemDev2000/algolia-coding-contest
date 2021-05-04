export default function ErrorMessage({ message }) {
  return message ? (
    <div className="text-sm text-red-500 font-medium py-1">{message}</div>
  ) : null;
}
