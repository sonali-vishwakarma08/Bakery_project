const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, quantity = 1, flavor, weight, custom_message } = req.body;

    if (!product) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Verify product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate price (consider discount)
    const finalPrice = productDoc.price - (productDoc.price * (productDoc.discount || 0) / 100);

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === product.toString()
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price_at_adding = finalPrice;
      if (flavor) cart.items[existingItemIndex].flavor = flavor;
      if (weight) cart.items[existingItemIndex].weight = weight;
      if (custom_message) cart.items[existingItemIndex].custom_message = custom_message;
    } else {
      // Add new item
      cart.items.push({
        product,
        quantity,
        price_at_adding: finalPrice,
        flavor: flavor || null,
        weight: weight || null,
        custom_message: custom_message || ''
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price discount images');

    res.json({
      message: 'Item added to cart',
      cart: populatedCart,
      totalAmount: populatedCart.totalAmount,
      totalQuantity: populatedCart.getTotalQuantity()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price discount images stock_quantity status');

    if (!cart) {
      return res.json({
        cart: { items: [], totalAmount: 0, totalQuantity: 0 },
        message: 'Cart is empty'
      });
    }

    res.json({
      cart,
      totalAmount: cart.totalAmount,
      totalQuantity: cart.getTotalQuantity()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== product.toString()
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price discount images');

    res.json({
      message: 'Item removed from cart',
      cart: populatedCart,
      totalAmount: populatedCart.totalAmount,
      totalQuantity: populatedCart.getTotalQuantity()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, quantity } = req.body;

    if (!product || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Product ID and valid quantity are required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === product.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price discount images');

    res.json({
      message: 'Cart item updated',
      cart: populatedCart,
      totalAmount: populatedCart.totalAmount,
      totalQuantity: populatedCart.getTotalQuantity()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

