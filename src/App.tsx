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

  const handleCheckboxChange = (id: number, owned: boolean) => {
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
    <div className="container mx-auto p-4">
      <div className="fixed w-[90%] bg-gray-200 h-10 mb-4">
        <div
          className="bg-green-600 h-10 text-black"
          style={{ width: `${percentOwned}%` }}
        >
          <span className="absolute h-10 inset-0 flex items-center justify-center text-black font-bold">
            {percentOwned.toFixed(2)}%
          </span>
        </div>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={item.owned}
              onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
              className="mr-2"
            />
            <span>{item.name} - {item.category}</span>
            <img src={`${SERVER_URL}/icons/${item.imageUrl}`} alt={item.name} className="w-10 h-10 ml-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;