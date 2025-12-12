import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { productAPI } from "../services/api";
import { createBakeryOrder } from "../services/paymentApi";

export default function CustomCake() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    quantity: 1,
    flavor: "",
    weight: "",
    customMessage: "",
    referenceImage: null,
    shape: "",
    deliveryDate: "",
    specialInstructions: "",
    deliveryAddress: {
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: ""
    }
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch customizable products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        // Filter products that are customizable
        const customizableProducts = response.data?.filter(product => product.is_customizable) || [];
        setProducts(customizableProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData({
      ...formData,
      productId: product._id,
      productName: product.name,
      flavor: product.flavors?.[0]?.value || "",
      weight: product.weight_options?.[0]?.value || ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      deliveryAddress: {
        ...formData.deliveryAddress,
        [name]: value
      }
    });
    
    // Clear error when user starts typing
    if (errors[`deliveryAddress.${name}`]) {
      setErrors({
        ...errors,
        [`deliveryAddress.${name}`]: ""
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setFormData({
        ...formData,
        referenceImage: file
      });
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Product selection validation
    if (!formData.productId) {
      newErrors.productId = "Please select a product";
    }
    
    // Quantity validation
    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }
    
    // Flavor validation
    if (!formData.flavor) {
      newErrors.flavor = "Please select a flavor";
    }
    
    // Weight validation
    if (!formData.weight) {
      newErrors.weight = "Please select a weight";
    }
    
    // Custom message validation (if allowed)
    if (selectedProduct?.is_custom_message_allowed && formData.customMessage.length > (selectedProduct?.custom_message_max_length || 40)) {
      newErrors.customMessage = `Message should be less than ${selectedProduct?.custom_message_max_length || 40} characters`;
    }
    
    // Reference image validation (optional for now)
    
    // Shape validation
    if (!formData.shape) {
      newErrors.shape = "Please select a shape";
    }
    
    // Delivery date validation
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "Please select a delivery date";
    } else {
      const selectedDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.deliveryDate = "Delivery date cannot be in the past";
      } else if (selectedDate < new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)) {
        newErrors.deliveryDate = "Delivery date should be at least 2 days from today";
      }
    }
    
    // Address validation
    if (!formData.deliveryAddress.name.trim()) {
      newErrors["deliveryAddress.name"] = "Name is required";
    }
    
    if (!formData.deliveryAddress.street.trim()) {
      newErrors["deliveryAddress.street"] = "Street address is required";
    }
    
    if (!formData.deliveryAddress.city.trim()) {
      newErrors["deliveryAddress.city"] = "City is required";
    }
    
    if (!formData.deliveryAddress.state.trim()) {
      newErrors["deliveryAddress.state"] = "State is required";
    }
    
    if (!formData.deliveryAddress.zip.trim()) {
      newErrors["deliveryAddress.zip"] = "ZIP code is required";
    }
    
    if (!formData.deliveryAddress.phone.trim()) {
      newErrors["deliveryAddress.phone"] = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.deliveryAddress.phone)) {
      newErrors["deliveryAddress.phone"] = "Phone number must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare order data
      const orderData = {
        items: [{
          product: formData.productId,
          quantity: formData.quantity,
          price: selectedProduct?.price || 0,
          flavor: formData.flavor,
          weight: formData.weight,
          custom_message: formData.customMessage
        }],
        delivery_address: {
          name: formData.deliveryAddress.name,
          street: formData.deliveryAddress.street,
          city: formData.deliveryAddress.city,
          state: formData.deliveryAddress.state,
          zip: formData.deliveryAddress.zip,
          phone: formData.deliveryAddress.phone
        },
        is_custom_cake: true,
        reference_image: previewImage ? previewImage.split(',')[1] : null, // Remove data URL prefix
        shape: formData.shape,
        delivery_date: formData.deliveryDate,
        special_instructions: formData.specialInstructions,
        payment_method: 'cod',
        payment_status: 'pending'
      };
      
      // Create order
      const orderResponse = await createBakeryOrder(orderData);
      
      if (orderResponse) {
        toast.success("Custom cake order placed successfully!");
        // Navigate to order confirmation or payment page
        navigate(`/order/${orderResponse._id}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-24 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Custom Cake Order</h1>
              <button
                onClick={() => navigate("/products")}
                className="text-pink-600 hover:text-pink-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Selection */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select a Cake Base</h2>
                
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No customizable products available at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div 
                        key={product._id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedProduct?._id === product._id 
                            ? "border-pink-500 bg-white shadow-md" 
                            : "border-gray-200 bg-white hover:shadow-sm"
                        }`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                            {product.images?.[0] ? (
                              <img 
                                src={`http://localhost:5000/uploads/products/${product.images[0]}`} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-pink-600 font-medium">₹{product.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.productId && (
                  <p className="text-red-500 text-sm mt-2">{errors.productId}</p>
                )}
              </div>

              {selectedProduct && (
                <>
                  {/* Customization Options */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Customize Your Cake</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors.quantity ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.quantity && (
                          <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                        )}
                      </div>
                      
                      {/* Flavor */}
                      {selectedProduct.flavors && selectedProduct.flavors.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Flavor *</label>
                          <select
                            name="flavor"
                            value={formData.flavor}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                              errors.flavor ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select a flavor</option>
                            {selectedProduct.flavors.map((flavor) => (
                              <option key={flavor.value} value={flavor.value}>
                                {flavor.label}
                              </option>
                            ))}
                          </select>
                          {errors.flavor && (
                            <p className="text-red-500 text-sm mt-1">{errors.flavor}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Weight */}
                      {selectedProduct.weight_options && selectedProduct.weight_options.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Weight *</label>
                          <select
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                              errors.weight ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="">Select a weight</option>
                            {selectedProduct.weight_options.map((weight) => (
                              <option key={weight.value} value={weight.value}>
                                {weight.label}
                              </option>
                            ))}
                          </select>
                          {errors.weight && (
                            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Custom Message */}
                      {selectedProduct.is_custom_message_allowed && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Custom Message ({selectedProduct.custom_message_max_length || 40} characters max)
                          </label>
                          <textarea
                            name="customMessage"
                            value={formData.customMessage}
                            onChange={handleInputChange}
                            maxLength={selectedProduct.custom_message_max_length || 40}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                              errors.customMessage ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Enter your custom message for the cake"
                          />
                          <div className="text-right text-sm text-gray-500 mt-1">
                            {formData.customMessage.length}/{selectedProduct.custom_message_max_length || 40}
                          </div>
                          {errors.customMessage && (
                            <p className="text-red-500 text-sm mt-1">{errors.customMessage}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Reference Image */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reference Image (Optional)</label>
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              {previewImage ? (
                                <img 
                                  src={previewImage} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-xs text-gray-500 mt-2">Upload Image</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">
                              Upload a reference image for your custom cake design. 
                              Supported formats: JPG, PNG, GIF. Max size: 5MB.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Shape */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shape *</label>
                        <select
                          name="shape"
                          value={formData.shape}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors.shape ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a shape</option>
                          <option value="round">Round</option>
                          <option value="square">Square</option>
                          <option value="heart">Heart</option>
                          <option value="rectangle">Rectangle</option>
                          <option value="oval">Oval</option>
                        </select>
                        {errors.shape && (
                          <p className="text-red-500 text-sm mt-1">{errors.shape}</p>
                        )}
                      </div>
                      
                      {/* Delivery Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date *</label>
                        <input
                          type="date"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleInputChange}
                          min={new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors.deliveryDate ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.deliveryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
                        )}
                      </div>
                      
                      {/* Special Instructions */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                        <textarea
                          name="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                          placeholder="Any special requests or instructions for your cake..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.deliveryAddress.name}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors["deliveryAddress.name"] ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors["deliveryAddress.name"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["deliveryAddress.name"]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.deliveryAddress.phone}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors["deliveryAddress.phone"] ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="10-digit phone number"
                        />
                        {errors["deliveryAddress.phone"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["deliveryAddress.phone"]}</p>
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.deliveryAddress.street}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors["deliveryAddress.street"] ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Street address"
                        />
                        {errors["deliveryAddress.street"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["deliveryAddress.street"]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.deliveryAddress.city}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors["deliveryAddress.city"] ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="City"
                        />
                        {errors["deliveryAddress.city"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["deliveryAddress.city"]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.deliveryAddress.state}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors["deliveryAddress.state"] ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="State"
                        />
                        {errors["deliveryAddress.state"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["deliveryAddress.state"]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.deliveryAddress.zip}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 ${
                            errors["deliveryAddress.zip"] ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="ZIP code"
                        />
                        {errors["deliveryAddress.zip"] && (
                          <p className="text-red-500 text-sm mt-1">{errors["deliveryAddress.zip"]}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium text-lg flex items-center disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Place Custom Cake Order"
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}