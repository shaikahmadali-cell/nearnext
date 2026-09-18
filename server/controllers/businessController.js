const Business = require('../models/Business');
const Offer = require('../models/Offer');

// @desc    Get all businesses with search, filter, pagination
// @route   GET /api/businesses
// @access  Public
const getBusinesses = async (req, res, next) => {
  try {
    const { search, category, city, verified, sort } = req.query;
    const query = { status: 'approved' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    if (verified === 'true') {
      query.isVerified = true;
    }

    let queryObj = Business.find(query);

    if (sort === 'rating') {
      queryObj = queryObj.sort('-rating');
    } else if (sort === 'newest') {
      queryObj = queryObj.sort('-createdAt');
    } else {
      queryObj = queryObj.sort('-rating');
    }

    const businesses = await queryObj.populate('owner', 'name email phone');

    res.json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single business by ID
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id).populate('owner', 'name email phone');

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const activeOffers = await Offer.find({
      business: business._id,
      status: 'active',
      endDate: { $gte: new Date() },
    });

    res.json({
      success: true,
      data: {
        ...business.toObject(),
        offers: activeOffers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged-in business profile
// @route   GET /api/businesses/my/profile
// @access  Private (Business only)
const getMyBusiness = async (req, res, next) => {
  try {
    let business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No business profile registered for this account yet.',
      });
    }

    res.json({
      success: true,
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update business profile
// @route   POST /api/businesses
// @access  Private (Business only)
const createOrUpdateBusiness = async (req, res, next) => {
  try {
    let business = await Business.findOne({ owner: req.user.id });

    const businessData = {
      ...req.body,
      owner: req.user.id,
    };

    if (business) {
      business = await Business.findByIdAndUpdate(business._id, businessData, {
        new: true,
        runValidators: true,
      });
      return res.json({
        success: true,
        message: 'Business profile updated successfully',
        data: business,
      });
    }

    business = await Business.create(businessData);
    res.status(201).json({
      success: true,
      message: 'Business profile created successfully',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all businesses (including pending/rejected)
// @route   GET /api/businesses/admin/all
// @access  Private (Admin only)
const adminGetAllBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find().populate('owner', 'name email phone').sort('-createdAt');
    res.json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update business status (approve/reject/verify)
// @route   PUT /api/businesses/:id/status
// @access  Private (Admin only)
const updateBusinessStatus = async (req, res, next) => {
  try {
    const { status, isVerified } = req.body;
    const updateFields = {};

    if (status) updateFields.status = status;
    if (typeof isVerified === 'boolean') updateFields.isVerified = isVerified;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    res.json({
      success: true,
      message: 'Business status updated',
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete business
// @route   DELETE /api/businesses/:id
// @access  Private (Admin only)
const deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    await Offer.deleteMany({ business: business._id });
    await business.deleteOne();

    res.json({
      success: true,
      message: 'Business and its related offers were deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinesses,
  getBusinessById,
  getMyBusiness,
  createOrUpdateBusiness,
  adminGetAllBusinesses,
  updateBusinessStatus,
  deleteBusiness,
};
