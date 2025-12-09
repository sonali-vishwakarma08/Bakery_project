const Settings = require('../../models/settingsModel');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
    }
    
    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetSettings = async (req, res) => {
  try {
    await Settings.deleteMany({});
    const settings = await Settings.create({});
    
    res.json({ message: 'Settings reset to default', settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
