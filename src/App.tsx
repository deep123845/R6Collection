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
  const SERVER_URL = 'http://127.0.0.1:3101';

  useEffect(() => {
    fetch(`${SERVER_URL}/items`)
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

  const handleItemClick = (id: number, owned: boolean) => {
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
      <div className="fixed w-[90%] bg-gray-200 h-10 mb-4 inset-x-1/20">
        <div
          className="bg-green-600 h-10 text-black"
          style={{ width: `${percentOwned}%` }}
        >
          <span className="absolute h-10 inset-0 flex items-center justify-center text-black font-bold">
            {percentOwned.toFixed(2)}%
          </span>
        </div>
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