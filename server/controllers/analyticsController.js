const User = require('../models/User');
const Business = require('../models/Business');
const Offer = require('../models/Offer');
const Enquiry = require('../models/Enquiry');
const Review = require('../models/Review');
const SavedOffer = require('../models/SavedOffer');

// @desc    Get platform-wide public statistics for homepage
// @route   GET /api/analytics/public-stats
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const businessCount = await Business.countDocuments({ status: 'approved' });
    const promotionCount = await Offer.countDocuments({ status: { $in: ['approved', 'active'] } });

    // Calculate real customer savings from active/approved offers & saved deals
    const offers = await Offer.find({ status: { $in: ['approved', 'active'] } });
    let totalSavingsAmount = 0;
    offers.forEach((o) => {
      const orig = Number(o.originalPrice) || 0;
      const disc = Number(o.discountedPrice) || 0;
      if (orig > disc) {
        const diff = orig - disc;
        const saves = Number(o.savesCount) || 0;
        totalSavingsAmount += diff * Math.max(1, saves);
      }
    });

    // Calculate real average rating from Review collection or Business ratings
    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    let averageRating = null;
    let totalReviews = 0;
    if (reviewStats.length > 0 && reviewStats[0].totalReviews > 0) {
      averageRating = Math.round(reviewStats[0].avgRating * 10) / 10;
      totalReviews = reviewStats[0].totalReviews;
    } else {
      const businessStats = await Business.aggregate([
        { $match: { status: 'approved', numReviews: { $gt: 0 }, rating: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            totalReviews: { $sum: '$numReviews' },
          },
        },
      ]);
      if (businessStats.length > 0 && businessStats[0].totalReviews > 0) {
        averageRating = Math.round(businessStats[0].avgRating * 10) / 10;
        totalReviews = businessStats[0].totalReviews;
      }
    }

    // Real category offer counts
    const categoryAgg = await Offer.aggregate([
      { $match: { status: { $in: ['approved', 'active'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const categoryCounts = {};
    categoryAgg.forEach((item) => {
      if (item._id) {
        categoryCounts[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      data: {
        businessCount,
        promotionCount,
        customerSavings: totalSavingsAmount,
        customerSavingsFormatted: totalSavingsAmount > 0 ? `₹${totalSavingsAmount.toLocaleString('en-IN')}` : '₹0',
        averageRating,
        totalReviews,
        categoryCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics for business owner
// @route   GET /api/analytics/business
// @access  Private (Business only)
const getBusinessAnalytics = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });

    if (!business) {
      return res.json({
        success: true,
        data: {
          hasBusiness: false,
          totalOffers: 0,
          activeOffers: 0,
          totalViews: 0,
          totalSaves: 0,
          totalEnquiries: 0,
          conversionRate: '0%',
        },
      });
    }

    const offers = await Offer.find({ business: business._id });
    const enquiries = await Enquiry.find({ business: business._id });

    const totalOffers = offers.length;
    const activeOffers = offers.filter((o) => o.status === 'approved' || o.status === 'active').length;
    const pendingOffers = offers.filter((o) => o.status === 'pending').length;
    const totalViews = offers.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
    const totalSaves = offers.reduce((acc, curr) => acc + (curr.savesCount || 0), 0);
    const totalEnquiries = enquiries.length;
    const conversionRate = totalViews > 0 ? ((totalEnquiries / totalViews) * 100).toFixed(1) + '%' : '0%';

    // Top performing offers
    const topOffers = [...offers].sort((a, b) => (b.viewsCount + b.savesCount) - (a.viewsCount + a.savesCount)).slice(0, 5);

    // Group enquiries by status
    const enquiryStatusBreakdown = {
      pending: enquiries.filter((e) => e.status === 'pending').length,
      in_progress: enquiries.filter((e) => e.status === 'in_progress').length,
      resolved: enquiries.filter((e) => e.status === 'resolved').length,
      closed: enquiries.filter((e) => e.status === 'closed').length,
    };

    res.json({
      success: true,
      data: {
        hasBusiness: true,
        businessName: business.name,
        totalOffers,
        activeOffers,
        pendingOffers,
        totalViews,
        totalSaves,
        totalEnquiries,
        conversionRate,
        topOffers,
        enquiryStatusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get platform-wide analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin only)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: 'customer' });
    const businessUserCount = await User.countDocuments({ role: 'business' });
    
    const totalBusinesses = await Business.countDocuments();
    const approvedBusinesses = await Business.countDocuments({ status: 'approved' });
    const pendingBusinesses = await Business.countDocuments({ status: 'pending' });
    
    const totalOffers = await Offer.countDocuments();
    const activeOffers = await Offer.countDocuments({ status: { $in: ['approved', 'active'] } });
    const pendingOffers = await Offer.countDocuments({ status: 'pending' });
    const totalEnquiries = await Enquiry.countDocuments();

    // Group businesses by category
    const categoriesAggregate = await Business.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Aggregate total views & saves
    const aggregateMetrics = await Offer.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$viewsCount' },
          totalSaves: { $sum: '$savesCount' },
        },
      },
    ]);

    const totalViews = aggregateMetrics[0]?.totalViews || 0;
    const totalSaves = aggregateMetrics[0]?.totalSaves || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        customerCount,
        businessUserCount,
        totalBusinesses,
        approvedBusinesses,
        pendingBusinesses,
        totalOffers,
        activeOffers,
        pendingOffers,
        totalEnquiries,
        totalViews,
        totalSaves,
        categoriesAggregate,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicStats,
  getBusinessAnalytics,
  getAdminAnalytics,
};
