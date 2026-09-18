const Offer = require('../models/Offer');
const Business = require('../models/Business');
const SavedOffer = require('../models/SavedOffer');
const User = require('../models/User');

// @desc    Get all active offers with search, filters
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res, next) => {
  try {
    const { search, category, discountType, sort, featured } = req.query;
    const query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { promoCode: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (discountType && discountType !== 'All') {
      query.discountType = discountType;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let queryObj = Offer.find(query).populate('business', 'name city state logo rating address phone');

    if (sort === 'newest') {
      queryObj = queryObj.sort('-createdAt');
    } else if (sort === 'popular') {
      queryObj = queryObj.sort('-savesCount -viewsCount');
    } else if (sort === 'expiring') {
      queryObj = queryObj.sort('endDate');
    } else {
      queryObj = queryObj.sort('-createdAt');
    }

    const offers = await queryObj;

    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single offer details & increment views
// @route   GET /api/offers/:id
// @access  Public
const getOfferById = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('business');

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get business's own offers
// @route   GET /api/offers/my/all
// @access  Private (Business only)
const getMyOffers = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(400).json({
        success: false,
        message: 'You need to set up your business profile before managing offers.',
      });
    }

    const offers = await Offer.find({ business: business._id }).sort('-createdAt');

    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private (Business only)
const createOffer = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your business profile before creating promotions.',
      });
    }

    const offer = await Offer.create({
      ...req.body,
      business: business._id,
      category: req.body.category || business.category,
    });

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private (Business or Admin)
const updateOffer = async (req, res, next) => {
  try {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    if (req.user.role !== 'admin') {
      const business = await Business.findOne({ owner: req.user.id });
      if (!business || offer.business.toString() !== business._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to edit this offer',
        });
      }
    }

    offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private (Business or Admin)
const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    if (req.user.role !== 'admin') {
      const business = await Business.findOne({ owner: req.user.id });
      if (!business || offer.business.toString() !== business._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this offer',
        });
      }
    }

    await SavedOffer.deleteMany({ offer: offer._id });
    await offer.deleteOne();

    res.json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Bookmark or Unsave an offer
// @route   POST /api/offers/:id/save
// @access  Private
const toggleSaveOffer = async (req, res, next) => {
  try {
    const offerId = req.params.id;
    const userId = req.user.id;

    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    const existingSave = await SavedOffer.findOne({ user: userId, offer: offerId });

    if (existingSave) {
      await existingSave.deleteOne();
      await Offer.findByIdAndUpdate(offerId, { $inc: { savesCount: -1 } });
      await User.findByIdAndUpdate(userId, { $pull: { savedOffers: offerId } });

      return res.json({
        success: true,
        saved: false,
        message: 'Offer removed from your saved list',
      });
    }

    await SavedOffer.create({ user: userId, offer: offerId });
    await Offer.findByIdAndUpdate(offerId, { $inc: { savesCount: 1 } });
    await User.findByIdAndUpdate(userId, { $addToSet: { savedOffers: offerId } });

    res.json({
      success: true,
      saved: true,
      message: 'Offer saved to your bookmarks',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's saved offers
// @route   GET /api/offers/customer/saved
// @access  Private
const getSavedOffers = async (req, res, next) => {
  try {
    const saved = await SavedOffer.find({ user: req.user.id })
      .populate({
        path: 'offer',
        populate: { path: 'business', select: 'name city state logo rating' },
      })
      .sort('-createdAt');

    const offers = saved.map((s) => s.offer).filter(Boolean);

    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all offers across platform
// @route   GET /api/offers/admin/all
// @access  Private (Admin only)
const adminGetAllOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find()
      .populate('business', 'name city state category')
      .sort('-createdAt');

    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffers,
  getOfferById,
  getMyOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleSaveOffer,
  getSavedOffers,
  adminGetAllOffers,
};
