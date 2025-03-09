import { useState, useEffect } from 'react';
import './App.css';

interface Item {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  owned: boolean;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const percentOwned = items.filter(item => item.owned).length / items.length * 100;
  const percentOwnedCategories = getPercentOwnedCategories(items);
  const amountCategories = getAmountCategories(items);
  const SERVER_URL = 'http://127.0.0.1:3101';

  useEffect(() => {
    fetch(`${SERVER_URL}/items`)
      .then(response => response.json())
      .then(data => setItems(data.sort((a: Item, b: Item) => a.owned === b.owned ? 0 : b.owned ? -1 : 1)));
  }, []);
  /*.sort((a: Item, b: Item) => a.name.localeCompare(b.name)).sort((a: Item, b: Item) => a.category.localeCompare(b.category)))*/
  function getPercentOwnedCategories(itemsArray: Item[]) {
    const categories = [...new Set(itemsArray.map(item => item.category))];
    const percentOwnedCategories = categories.map(category => {
      const categoryItems = itemsArray.filter(item => item.category === category);
      const percentOwned = categoryItems.filter(item => item.owned).length / categoryItems.length * 100;
      return { category, percentOwned };
    }
    );
    return percentOwnedCategories;
  }

  function getAmountCategories(itemsArray: Item[]) {
    const categories = [...new Set(itemsArray.map(item => item.category))];
    const amountCategories = categories.map(category => {
      const categoryItems = itemsArray.filter(item => item.category === category);
      const amount = categoryItems.length;
      return { category, amount };
    });
    return amountCategories;
  }


  const handleItemClick = (id: number, owned: boolean) => {
    console.log(percentOwnedCategories);
    fetch(`${SERVER_URL}/item/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, owned }),
    }).then(() => {
      setItems(items.map(item => item.id === id ? { ...item, owned } : item));
    });
  };

  return (
    <div className="bg-zinc-900 mx-auto p-4">
      <div className="z-1 fixed w-[90%] bg-gray-200 h-10 mb-4 inset-x-1/20">
        <div
          className="bg-green-600 h-10 text-black"
          style={{ width: `${percentOwned}%` }}
        >
          <span className="z-1 absolute h-10 inset-0 flex items-center justify-center text-black font-bold">
            {(percentOwned / 100 * items.length).toFixed()} of {items.length}
          </span>
        </div>
      </div>
      <div className="pt-16">
        {percentOwnedCategories.map(({ category, percentOwned }) => (
          <div key={category} className="mb-4">
            <div className="text-white font-bold mb-1">{category}</div>
            <div className="relative w-full bg-gray-200 h-6">
              <div>
                <span className="absolute h-6 inset-0 flex items-center justify-center text-black font-bold">
                  {(percentOwned / 100 * (amountCategories.find(item => item.category === category)?.amount || 0)).toFixed(0)} of {amountCategories.find(item => item.category === category)?.amount || 0}
                </span>
                <div
                  className="bg-green-600 h-6 text-black"
                  style={{ width: `${percentOwned}%` }}
                >
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 pt-16">
        {items.map(item => (
          <div
            key={item.id}
            className={`p-2 border-4 rounded-2xl bg-zinc-800 ${item.owned ? 'border-green-600' : 'border-red-600'}`}
            onClick={() => handleItemClick(item.id, !item.owned)}
          >
            <img src={`${SERVER_URL}/icons/${item.imageUrl}`} alt={item.name} className="w-full h-32 object-contain" />
            <div className="text-center mt-2">
              <span>{item.name} - {item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;