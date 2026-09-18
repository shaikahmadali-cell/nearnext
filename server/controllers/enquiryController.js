const Enquiry = require('../models/Enquiry');
const Business = require('../models/Business');

// @desc    Submit customer enquiry
// @route   POST /api/enquiries
// @access  Private (Customer or logged in user)
const createEnquiry = async (req, res, next) => {
  try {
    const { businessId, offerId, name, email, phone, subject, message } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const enquiry = await Enquiry.create({
      customer: req.user ? req.user.id : null,
      business: businessId,
      offer: offerId || null,
      name: name || (req.user ? req.user.name : 'Guest Customer'),
      email: email || (req.user ? req.user.email : ''),
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. The business will get back to you soon!',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enquiries for currently logged in customer
// @route   GET /api/enquiries/customer
// @access  Private
const getCustomerEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ customer: req.user.id })
      .populate('business', 'name email phone logo city')
      .populate('offer', 'title discountValue promoCode')
      .sort('-createdAt');

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enquiries for business owner
// @route   GET /api/enquiries/business
// @access  Private (Business only)
const getBusinessEnquiries = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(400).json({
        success: false,
        message: 'No business profile found for this user',
      });
    }

    const enquiries = await Enquiry.find({ business: business._id })
      .populate('customer', 'name email phone avatar')
      .populate('offer', 'title discountValue promoCode')
      .sort('-createdAt');

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to an enquiry
// @route   POST /api/enquiries/:id/reply
// @access  Private
const replyEnquiry = async (req, res, next) => {
  try {
    const { message } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiry.replies.push({
      sender: req.user.id,
      senderRole: req.user.role,
      message,
      createdAt: new Date(),
    });

    if (req.user.role === 'business' && enquiry.status === 'pending') {
      enquiry.status = 'in_progress';
    }

    await enquiry.save();

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id/status
// @access  Private (Business or Admin)
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({
      success: true,
      message: 'Status updated',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getCustomerEnquiries,
  getBusinessEnquiries,
  replyEnquiry,
  updateEnquiryStatus,
};
