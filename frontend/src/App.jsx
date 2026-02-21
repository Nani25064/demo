import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState([]);
  const base_url = import.meta.env.VITE_BASE_URL || 'http://localhost:9080';

  useEffect(() => {
    fetch(`${base_url}/api/products`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  console.log('Products:', products);
  return (
    <>
      <div>Hello world</div>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))} 
      </ul>
    </>
  )
}

export default App
