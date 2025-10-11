import { useState, useEffect } from "react";
import { 
  FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPercent, 
  FaRupeeSign, FaTruck, FaBell, FaCreditCard,
  FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaSave,
  FaUndo, FaToggleOn, FaToggleOff
} from "react-icons/fa";
import { getSettings, updateSettings, resetSettings } from "../api/settingsApi";
import { showSuccess, showError } from "../utils/toast";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("business");
  const [settings, setSettings] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    taxRate: 18,
    currency: "INR",
    currencySymbol: "₹",
    minOrderAmount: 100,
    deliveryCharge: 50,
    freeDeliveryAbove: 500,
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    lowStockAlerts: true,
    lowStockThreshold: 10,
    codEnabled: true,
    onlinePaymentEnabled: true,
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      whatsapp: "",
    },
    maintenanceMode: false,
    maintenanceMessage: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
      showError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(settings);
      showSuccess("Settings saved successfully!");
      fetchSettings();
    } catch (err) {
      showError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to reset all settings to default?")) {
      return;
    }
    
    try {
      setSaving(true);
      const data = await resetSettings();
      setSettings(data.settings);
      showSuccess("Settings reset to default!");
    } catch (err) {
      showError(err.message || "Failed to reset settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "business", label: "Business Info", icon: <FaStore /> },
    { id: "orders", label: "Orders & Delivery", icon: <FaTruck /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "payment", label: "Payment", icon: <FaCreditCard /> },
    { id: "social", label: "Social Media", icon: <FaInstagram /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your bakery configuration and preferences</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={saving}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FaUndo />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap flex items-center gap-2 border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Business Info Tab */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaStore className="inline mr-2" />
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => handleChange("businessEmail", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.businessPhone}
                    onChange={(e) => handleChange("businessPhone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Business Address
                  </label>
                  <input
                    type="text"
                    value={settings.businessAddress}
                    onChange={(e) => handleChange("businessAddress", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPercent className="inline mr-2" />
                    Tax Rate (GST %)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleChange("taxRate", parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRupeeSign className="inline mr-2" />
                    Currency
                  </label>
                  <input
                    type="text"
                    value={settings.currency}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}

          {/* Orders & Delivery Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order & Delivery Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => handleChange("minOrderAmount", parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryCharge}
                    onChange={(e) => handleChange("deliveryCharge", parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Delivery Above (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryAbove}
                    onChange={(e) => handleChange("freeDeliveryAbove", parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <button
                    onClick={() => handleChange("emailNotifications", !settings.emailNotifications)}
                    className="text-3xl"
                  >
                    {settings.emailNotifications ? (
                      <FaToggleOn className="text-pink-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <button
                    onClick={() => handleChange("smsNotifications", !settings.smsNotifications)}
                    className="text-3xl"
                  >
                    {settings.smsNotifications ? (
                      <FaToggleOn className="text-pink-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Order Notifications</p>
                    <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                  </div>
                  <button
                    onClick={() => handleChange("orderNotifications", !settings.orderNotifications)}
                    className="text-3xl"
                  >
                    {settings.orderNotifications ? (
                      <FaToggleOn className="text-pink-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Low Stock Alerts</p>
                    <p className="text-sm text-gray-500">Get alerts when products are running low</p>
                  </div>
                  <button
                    onClick={() => handleChange("lowStockAlerts", !settings.lowStockAlerts)}
                    className="text-3xl"
                  >
                    {settings.lowStockAlerts ? (
                      <FaToggleOn className="text-pink-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleChange("lowStockThreshold", parseInt(e.target.value) || 0)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Alert when stock falls below this number</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-500">Allow customers to pay on delivery</p>
                  </div>
                  <button
                    onClick={() => handleChange("codEnabled", !settings.codEnabled)}
                    className="text-3xl"
                  >
                    {settings.codEnabled ? (
                      <FaToggleOn className="text-pink-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Online Payment</p>
                    <p className="text-sm text-gray-500">Accept online payments via payment gateway</p>
                  </div>
                  <button
                    onClick={() => handleChange("onlinePaymentEnabled", !settings.onlinePaymentEnabled)}
                    className="text-3xl"
                  >
                    {settings.onlinePaymentEnabled ? (
                      <FaToggleOn className="text-pink-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaFacebook className="inline mr-2 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={settings.socialMedia?.facebook || ""}
                    onChange={(e) => handleChange("socialMedia.facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaInstagram className="inline mr-2 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={settings.socialMedia?.instagram || ""}
                    onChange={(e) => handleChange("socialMedia.instagram", e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTwitter className="inline mr-2 text-blue-400" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={settings.socialMedia?.twitter || ""}
                    onChange={(e) => handleChange("socialMedia.twitter", e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaWhatsapp className="inline mr-2 text-green-600" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={settings.socialMedia?.whatsapp || ""}
                    onChange={(e) => handleChange("socialMedia.whatsapp", e.target.value)}
                    placeholder="+91 1234567890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
