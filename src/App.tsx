import { useState, useEffect, use } from 'react';
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
  const SERVER_URL = 'http://http://127.0.0.1:3100';

  useEffect(() => {
    fetch(`${SERVER_URL}/items`)
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

  const handleCheckboxChange = (id: number, owned: boolean) => {
    fetch(`${SERVER_URL}/items/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owned }),
    }).then(() => {
      setItems(items.map(item => item.id === id ? { ...item, owned } : item));
    });
  };

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checklist</h1>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;