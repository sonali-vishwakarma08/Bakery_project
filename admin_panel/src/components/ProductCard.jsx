import React from 'react';

export default function ProductCard({ name, stock }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-bold">{name}</h3>
      <p>Stock: {stock}</p>
    </div>
  );
}
