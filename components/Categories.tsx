export function Categories({ category, setCategory }) {
  return (
    <div>
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700"
      >
        Category
      </label>
      <select
        id="category"
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
      >
        <option value="Electronics">Electronics</option>
        <option value="Computers">Computers</option>
        <option value="Automotive">Automotive</option>
        <option value="Beauty and personal care">
          Beauty and personal care
        </option>
        <option value="Women's Fashion">Women's Fashion</option>
        <option value="Men's Fashion">Men's Fashion</option>
        <option value="Girls' Fashion">Girls' Fashion</option>
        <option value="Boys' Fashion">Boys' Fashion</option>
        <option value="Health and Household">Health and Household</option>
        <option value="Home and Kitchen">Home and Kitchen</option>
        <option value="Luggage">Luggage</option>
        <option value="Movies & Television">Movies & Television</option>
        <option value="Software">Software</option>
        <option value="Sports and Outdoors">Sports and Outdoors</option>
        <option value="Toys and Games">Toys and Games</option>
        <option value="Video Games">Video Games</option>
      </select>
    </div>
  );
}
