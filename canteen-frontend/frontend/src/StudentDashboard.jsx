import React, { useState } from 'react';

const StudentDashboard = ({ onLogout }) => {
  const [menu, setMenu] = useState([
    { id: 1, name: 'Veg Biryani', price: 80 },
    { id: 2, name: 'Paneer Butter Masala', price: 120 },
    { id: 3, name: 'Masala Dosa', price: 60 },
    { id: 4, name: 'Chole Bhature', price: 70 },
    { id: 5, name: 'Dal Makhani', price: 90 }
  ]);
  
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentView, setCurrentView] = useState('menu');
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, parseInt(quantity) || 0)
    }));
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: Date.now(),
      items: [...cart],
      status: 'Preparing',
      timestamp: new Date().toLocaleString(),
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCurrentView('orders');
    
    setTimeout(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === newOrder.id 
            ? { ...order, status: 'Collect Now' }
            : order
        )
      );
    }, 5000);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentView('menu')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'menu' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setCurrentView('cart')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all relative ${
                  currentView === 'cart' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentView('orders')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentView === 'orders' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-blue-700 hover:bg-blue-800'
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
        {currentView === 'menu' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Canteen Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-2xl font-bold text-purple-600 mb-4">₹{item.price}</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'cart' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>
            {cart.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-xl text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-b-0">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-purple-600">₹{item.price * item.quantity}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-6 border-t-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-800">Total:</span>
                    <span className="text-3xl font-bold text-purple-600">₹{getTotalPrice()}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'orders' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h2>
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
                      <span className={`px-4 py-2 rounded-lg font-bold text-lg ${
                        order.status === 'Collect Now' 
                          ? 'bg-green-100 text-green-700 animate-pulse' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
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

export default StudentDashboard;