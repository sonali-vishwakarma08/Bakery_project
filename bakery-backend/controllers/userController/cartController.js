const Cart = require('../../models/cartModel');

// Add or update item in cart
exports.addToCart = async (req, res) => {
  try {
    const { user, product, quantity } = req.body;
    if (!user || !product || !quantity) {
      return res.status(400).json({ message: 'User, product, and quantity are required' });
    }

    let cart = await Cart.findOne({ user });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user,
        items: [{ product, quantity }]
      });
    } else {
      // Update existing cart
      const existingItem = cart.items.find(item => item.product.toString() === product);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cart for user
exports.getCart = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ message: 'User is required' });

    const cart = await Cart.findOne({ user }).populate('items.product', 'name price');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json({
      cart,
      totalQuantity: cart.getTotalQuantity()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove an item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { user, product } = req.body;
    if (!user || !product) return res.status(400).json({ message: 'User and product are required' });

    const cart = await Cart.findOne({ user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== product);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) return res.status(400).json({ message: 'User is required' });

    const cart = await Cart.findOneAndDelete({ user });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
