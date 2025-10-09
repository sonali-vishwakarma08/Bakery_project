import React from 'react';
import ProductCard from '../components/ProductCard';

export default function Inventory() {
  const products = [
    { name: 'Cake', stock: 20 },
    { name: 'Bread', stock: 50 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      {products.map((product, idx) => (
        <ProductCard key={idx} name={product.name} stock={product.stock} />
      ))}
    </div>
  );
}
