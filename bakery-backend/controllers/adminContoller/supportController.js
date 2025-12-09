const Support = require('../../models/supportModel');

// Get all support tickets
exports.getSupportTickets = async (req, res) => {
  try {
    const { status, user } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (user) filter.user = user;

    // Admin can see all, users can only see their own
    if (req.user?.role !== 'admin' && !user) {
      filter.user = req.user._id;
    }

    const tickets = await Support.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single support ticket by ID
exports.getSupportTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Support ticket ID is required' });

    const ticket = await Support.findById(id).populate('user', 'name email phone');
    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });

    // Check access: admin or ticket owner
    if (req.user?.role !== 'admin' && ticket.user?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create support ticket
exports.createSupportTicket = async (req, res) => {
  try {
    const { subject, message, email } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const ticketData = {
      user: req.user?._id || null,
      subject,
      message,
      email: email || req.user?.email || null,
      status: 'open'
    };

    const ticket = new Support(ticketData);
    const savedTicket = await ticket.save();
    
    const populatedTicket = await Support.findById(savedTicket._id)
      .populate('user', 'name email phone');

    res.status(201).json(populatedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update support ticket (Admin can update status)
exports.updateSupportTicket = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ message: 'Support ticket ID is required' });

    const ticket = await Support.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });

    // Only admin can update status, users can only update their own tickets
    if (req.user?.role !== 'admin') {
      if (ticket.user?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Users can only update subject and message, not status
      delete updateData.status;
    }

    Object.assign(ticket, updateData);
    const updatedTicket = await ticket.save();

    const populatedTicket = await Support.findById(updatedTicket._id)
      .populate('user', 'name email phone');

    res.json(populatedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete support ticket
exports.deleteSupportTicket = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Support ticket ID is required' });

    const ticket = await Support.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Support ticket not found' });

    // Only admin can delete
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Support.findByIdAndDelete(id);
    res.json({ message: 'Support ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

