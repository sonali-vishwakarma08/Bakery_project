const Settings = require('../models/settingsModel');

// Get settings (create default if not exists)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    
    res.status(200).json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const updateData = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create new settings if none exist
      settings = new Settings(updateData);
    } else {
      // Update existing settings
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          settings[key] = updateData[key];
        }
      });
    }
    
    await settings.save();
    
    res.status(200).json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reset settings to default
exports.resetSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (settings) {
      await settings.deleteOne();
    }
    
    // Create new default settings
    settings = new Settings();
    await settings.save();
    
    res.status(200).json({
      message: 'Settings reset to default successfully',
      settings,
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ message: error.message });
  }
};
