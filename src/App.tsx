import { useState, useEffect } from 'react';
import './App.css';

interface Item {
  id: number;
  name: string;
  category: string;
  rarity: string;
  collection: string;
  imageUrl: string;
  owned: boolean;
}

function App() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({});
  const itemsByCategory = getItemsByCategory(allItems);
  const percentOwned = allItems.filter(item => item.owned).length / allItems.length * 100;
  const percentOwnedCategories = getPercentOwnedCategories(itemsByCategory);
  const SERVER_URL = 'http://127.0.0.1:3101';

  useEffect(() => {
    fetch(`${SERVER_URL}/items`)
      .then(response => response.json())
      .then(data => setAllItems(data.sort((a: Item, b: Item) => a.owned === b.owned ? 0 : b.owned ? -1 : 1)));
  }, []);

  function getItemsByCategory(itemsArray: Item[]) {
    const categories = [...new Set(itemsArray.map(item => item.category))];
    const itemsByCategory = categories.map(category => {
      const categoryItems = itemsArray.filter(item => item.category === category);
      return { category, categoryItems };
    });
    return itemsByCategory;
  }

  function getPercentOwnedCategories(itemsByCategory: { category: string, categoryItems: Item[] }[]) {
    const percentOwnedCategories = itemsByCategory.map(({ category, categoryItems }) => {
      const percentOwned = categoryItems.filter(item => item.owned).length / categoryItems.length * 100;
      return { category, percentOwned };
    });
    return percentOwnedCategories;
  }

  function getPercentOwned(items: Item[]) {
    return items.filter(item => item.owned).length / items.length * 100;
  }

  function getIconUrl(value: string) {
    return `${SERVER_URL}/icons/${value}.png`;
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
      setAllItems(allItems.map(item => item.id === id ? { ...item, owned } : item));
    });
  };

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  return (
    <div className="bg-zinc-900 mx-auto p-4">
      <div className="z-1 fixed w-[96%] bg-zinc-700 p-2 rounded-xl pb-12 inset-x-2/100">
        <div className="text-white font-bold text-center mb-2">
          R6 Celebration Collection
        </div>
        <div className="z-1 fixed w-[90%] bg-gray-200 h-10 mb-4 inset-x-1/20">
          <div
            className="bg-green-600 h-10 text-black"
            style={{ width: `${percentOwned}%` }}
          >
            <span className="z-1 absolute h-10 inset-0 flex items-center justify-center text-black font-bold">
              {(percentOwned / 100 * allItems.length).toFixed()} of {allItems.length}
            </span>
          </div>
        </div>
      </div>
      <div className='mb-28' />
      <div key={'all'}>
        {itemsByCategory.map(items => (
          <div className='container mx-auto rounded-xl px-2 m-2 bg-zinc-700' key={items.category}>
            <div className='mb-2 pb-2 cursor-pointer' onClick={() => toggleCategoryCollapse(items.category)}>
              <div className="relative text-white font-bold mb-1">
                {items.category}
                <span className='absolute right-1 text-zinc-300'>
                  {collapsedCategories[items.category] ? '▼' : '▲'}
                </span>
              </div>
              <div className="relative w-full bg-gray-200 h-6">
                <div>
                  <span className="absolute h-6 inset-0 flex items-center justify-center text-black font-bold">
                    {(getPercentOwned(items.categoryItems) / 100 * items.categoryItems.length).toFixed(0)} of {items.categoryItems.length}
                  </span>
                  <div
                    className="bg-green-600 h-6 text-black"
                    style={{ width: `${getPercentOwned(items.categoryItems)}%` }}
                  >
                  </div>
                </div>
              </div>
            </div>
            {!collapsedCategories[items.category] && (
              <div key={items.category} className="grid grid-cols-4 gap-4">
                {items.categoryItems.map(item => (
                  <div
                    key={item.id}
                    className={`relative p-2 border-4 rounded-2xl bg-zinc-800 ${item.owned ? 'border-green-600' : 'border-red-600'}`}
                    onClick={() => handleItemClick(item.id, !item.owned)}
                  >
                    <img src={`${SERVER_URL}/icons/${item.imageUrl}`} alt={item.name} className="w-full h-32 object-contain" />
                    <img src={getIconUrl(item.rarity)} alt={item.rarity} className="absolute top-1 left-1 w-8 h-8 rounded-xl" />
                    <img src={getIconUrl(item.collection)} alt={item.collection} className="absolute top-1 right-1 w-6 h-7 rounded-xl" />
                    <div className="text-center mt-2">
                      <span>{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;