import React, { useState } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [menu, setMenu] = useState([
    { id: 1, name: 'Veg Biryani', price: 80 },
    { id: 2, name: 'Paneer Butter Masala', price: 120 },
    { id: 3, name: 'Masala Dosa', price: 60 },
    { id: 4, name: 'Chole Bhature', price: 70 },
    { id: 5, name: 'Dal Makhani', price: 90 }
  ]);
  
  const [orders, setOrders] = useState([
    {
      id: 1001,
      items: [
        { name: 'Veg Biryani', quantity: 2, price: 80 },
        { name: 'Masala Dosa', quantity: 1, price: 60 }
      ],
      status: 'Pending',
      timestamp: new Date().toLocaleString(),
      total: 220
    }
  ]);
  
  const [currentView, setCurrentView] = useState('items');
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [editingItem, setEditingItem] = useState(null);

  const addMenuItem = () => {
    if (newItem.name && newItem.price) {
      setMenu([...menu, {
        id: Date.now(),
        name: newItem.name,
        price: parseFloat(newItem.price)
      }]);
      setNewItem({ name: '', price: '' });
    }
  };

  const removeMenuItem = (id) => {
    setMenu(menu.filter(item => item.id !== id));
  };

  const updateItemPrice = (id, newPrice) => {
    setMenu(menu.map(item => 
      item.id === id ? { ...item, price: parseFloat(newPrice) } : item
    ));
    setEditingItem(null);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentView('items')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'items' 
                    ? 'bg-white text-purple-600' 
                    : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                Items
              </button>
              <button
                onClick={() => setCurrentView('orders')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'orders' 
                    ? 'bg-white text-purple-600' 
                    : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                Orders
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === 'items' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Menu Items</h2>
            
            {/* Add New Item */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Item</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={addMenuItem}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  {editingItem === item.id ? (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="number"
                        defaultValue={item.price}
                        onBlur={(e) => updateItemPrice(item.id, e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-purple-500 rounded-lg focus:outline-none"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-purple-600 mb-4">₹{item.price}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Edit Price
                    </button>
                    <button
                      onClick={() => removeMenuItem(item.id)}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-xl text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">{order.timestamp}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total:</span>
                        <span className="text-2xl font-bold text-purple-600">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;