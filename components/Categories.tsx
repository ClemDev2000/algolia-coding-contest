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
        <option disabled selected value="">
          {' '}
          -- Choose a category --{' '}
        </option>
        <option value="Beauty and personal care">
          Beauty and personal care
        </option>
        <option value="Clothing">Clothing</option>
        <option value="Home and Kitchen">Home and Kitchen</option>
        <option value="Software, Computers, Electronics">
          Software, Computers, Electronics
        </option>
        <option value="Sports and Outdoors">Sports and Outdoors</option>
        <option value="Games, Movies, Toys">Games, Movies, Toys</option>
      </select>
    </div>
  );
}

function OptionsSubCategories({ type }) {
  if (type === 'Beauty and personal care')
    return (
      <>
        <option disabled selected value="">
          {' '}
          -- Choose a sub-category --{' '}
        </option>
        <option value="Makeup">Makeup</option>
        <option value="Skin Care">Skin Care</option>
        <option value="Hair Care">Hair Care</option>
        <option value="Personal Care">Personal Care</option>
      </>
    );
  if (type === 'Clothing')
    return (
      <>
        <option disabled selected value="">
          {' '}
          -- Choose a sub-category --{' '}
        </option>
        <option value="Shoes">Shoes</option>
        <option value="Shirts">Shirts</option>
        <option value="Dresses">Dresses</option>
        <option value="Pants">Pants</option>
      </>
    );
  if (type === 'Home and Kitchen')
    return (
      <>
        <option disabled selected value="">
          {' '}
          -- Choose a sub-category --{' '}
        </option>
        <option value="Furniture">Furniture</option>
        <option value="Bedding">Bedding</option>
        <option value="Bath">Bath</option>
        <option value="Kitchen & Dining">Kitchen & Dining</option>
      </>
    );
  if (type === 'Software, Computers, Electronics')
    return (
      <>
        <option disabled selected value="">
          {' '}
          -- Choose a sub-category --{' '}
        </option>
        <option value="Data Storage">Data Storage</option>
        <option value="Printers">Printers</option>
        <option value="Scanners">Scanners</option>
        <option value="GPS & Navigation">GPS & Navigation</option>
        <option value="Camera & Photo">Camera & Photo</option>
        <option value="Operating Systems">Operating Systems</option>
      </>
    );
  if (type === 'Sports and Outdoors')
    return (
      <>
        <option disabled selected value="">
          {' '}
          -- Choose a sub-category --{' '}
        </option>
        <option value="Outdoor Recreation">Outdoor Recreation</option>
        <option value="Sports & Fitness">Sports & Fitness</option>
      </>
    );
  if (type === 'Games, Movies, Toys')
    return (
      <>
        <option disabled selected value="">
          {' '}
          -- Choose a sub-category --{' '}
        </option>
        <option value="Nintendo">Nintendo</option>
        <option value="PlayStation">PlayStation</option>
        <option value="Xbox">Xbox</option>
        <option value="Blu-ray">Blu-ray</option>
      </>
    );
}

export function SubCategories({ subcategory, setSubcategory, type }) {
  return (
    <div>
      <label
        htmlFor="sub-category"
        className="block text-sm font-medium text-gray-700"
      >
        Sub-category
      </label>
      <select
        id="sub-category"
        name="sub-category"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
      >
        <OptionsSubCategories type={type} />
      </select>
    </div>
  );
}
