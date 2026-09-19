const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Business = require('../models/Business');
const Offer = require('../models/Offer');
const Enquiry = require('../models/Enquiry');
const SavedOffer = require('../models/SavedOffer');
const Review = require('../models/Review');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_business_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Locora Seed...');

    // Clear existing collections
    await User.deleteMany();
    await Business.deleteMany();
    await Offer.deleteMany();
    await Enquiry.deleteMany();
    await SavedOffer.deleteMany();
    await Review.deleteMany();
    console.log('Cleared existing collections.');

    // 1. CREATE USERS
    // Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    // 3 Business Owners
    const vamsi = await User.create({
      name: 'Vamsi Krishna',
      email: 'vamsi.business@example.com',
      password: 'Password123',
      role: 'business',
      phone: '+91 98480 12345',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    });

    const anjali = await User.create({
      name: 'Anjali Reddy',
      email: 'anjali.business@example.com',
      password: 'Password123',
      role: 'business',
      phone: '+91 98490 54321',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    });

    const rohit = await User.create({
      name: 'Rohit Kumar',
      email: 'rohit.business@example.com',
      password: 'Password123',
      role: 'business',
      phone: '+91 98499 99887',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    });

    // 5 Customers
    const rahul = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      password: 'Password123',
      role: 'customer',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    });

    const arjun = await User.create({
      name: 'Arjun Reddy',
      email: 'arjun@example.com',
      password: 'Password123',
      role: 'customer',
      phone: '+91 92345 67890',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    });

    const priya = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'Password123',
      role: 'customer',
      phone: '+91 93456 78901',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    });

    const sneha = await User.create({
      name: 'Sneha Rao',
      email: 'sneha@example.com',
      password: 'Password123',
      role: 'customer',
      phone: '+91 94567 89012',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    });

    const kiran = await User.create({
      name: 'Kiran Varma',
      email: 'kiran@example.com',
      password: 'Password123',
      role: 'customer',
      phone: '+91 95678 90123',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    });

    console.log('Seeded 9 Users (1 Admin, 3 Business Owners, 5 Customers)');

    // 2. CREATE 10 DUMMY BUSINESSES
    const b1 = await Business.create({
      owner: vamsi._id,
      name: 'Fresh Bite Cafe',
      category: 'Food & Restaurants',
      description: 'Artisanal coffee, handcrafted wood-fired pizzas, gourmet burgers, and fresh mocktails in an inviting chill ambience.',
      address: 'MG Road, Opposite Trendset Mall',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      zipCode: '520010',
      phone: '+91 866 2489000',
      email: 'contact@freshbitecafe.in',
      website: 'https://freshbitecafe.in',
      logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
      rating: 4.5,
      numReviews: 48,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sun: 10:00 AM - 11:00 PM',
    });

    const b2 = await Business.create({
      owner: anjali._id,
      name: 'Urban Threads',
      category: 'Fashion',
      description: 'Contemporary designer wear, ethnic Indo-western collections, premium cotton shirts, and trendy bridal boutique.',
      address: 'Lakshmipuram Main Road, Brodipet',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      zipCode: '522002',
      phone: '+91 863 2234567',
      email: 'style@urbanthreads.in',
      website: 'https://urbanthreads.in',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80',
      rating: 4.3,
      numReviews: 36,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sat: 10:30 AM - 9:30 PM | Sun: 11:00 AM - 8:00 PM',
    });

    const b3 = await Business.create({
      owner: rohit._id,
      name: 'TechZone Mobiles',
      category: 'Electronics',
      description: 'Authorized multi-brand smartphones, Apple & Android accessories, smartwatch collections, laptop servicing & gadget repairs.',
      address: 'Besant Road, Governorpet',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      zipCode: '520002',
      phone: '+91 866 6678901',
      email: 'support@techzonemobiles.com',
      website: 'https://techzonemobiles.com',
      logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80',
      rating: 4.4,
      numReviews: 52,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sun: 9:30 AM - 10:00 PM',
    });

    const b4 = await Business.create({
      owner: anjali._id,
      name: 'Glow Beauty Studio',
      category: 'Beauty & Salon',
      description: 'Luxury bridal makeovers, keratin hair therapies, organic facials, nail art salon, and rejuvenating skincare treatments.',
      address: 'Arundelpet 4th Lane',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      zipCode: '522002',
      phone: '+91 863 2345678',
      email: 'bookings@glowbeautystudio.com',
      website: 'https://glowbeautystudio.com',
      logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
      rating: 4.6,
      numReviews: 64,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sun: 9:00 AM - 8:30 PM',
    });

    const b5 = await Business.create({
      owner: rohit._id,
      name: 'FitLife Gym',
      category: 'Fitness',
      description: 'State-of-the-art strength training equipment, certified personal trainers, crossfit conditioning, and steam sauna.',
      address: 'Ganga Cinema Road, Morrispet',
      city: 'Tenali',
      state: 'Andhra Pradesh',
      zipCode: '522201',
      phone: '+91 8644 225588',
      email: 'train@fitlifegym.in',
      website: 'https://fitlifegym.in',
      logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
      rating: 4.2,
      numReviews: 29,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 12:00 PM',
    });

    const b6 = await Business.create({
      owner: vamsi._id,
      name: 'Green Leaf Restaurant',
      category: 'Food & Restaurants',
      description: 'Authentic South Indian thalis, Hyderabadi dum biryani, Andhra non-veg delicacies, and family multi-cuisine dining.',
      address: 'Old Club Road, Kothapet',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      zipCode: '522001',
      phone: '+91 863 2221144',
      email: 'dine@greenleafrestaurant.in',
      website: 'https://greenleafrestaurant.in',
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
      rating: 4.5,
      numReviews: 82,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sun: 11:30 AM - 10:30 PM',
    });

    const b7 = await Business.create({
      owner: vamsi._id,
      name: 'Smart Home Services',
      category: 'Home Services',
      description: 'Verified home technicians: AC repair & servicing, electrical installations, plumbing fixes, painting, and deep home cleaning.',
      address: 'Benz Circle, Near DV Manor',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      zipCode: '520008',
      phone: '+91 866 2554433',
      email: 'care@smarthomeservices.in',
      website: 'https://smarthomeservices.in',
      logo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
      rating: 4.1,
      numReviews: 24,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    });

    const b8 = await Business.create({
      owner: anjali._id,
      name: 'Bright Minds Academy',
      category: 'Education',
      description: 'Premier coaching institute for competitive engineering & medical exams (IIT-JEE / NEET), coding bootcamps & foundation classes.',
      address: 'Station Road, Opposite Municipal Office',
      city: 'Tenali',
      state: 'Andhra Pradesh',
      zipCode: '522201',
      phone: '+91 8644 233211',
      email: 'admissions@brightmindsacademy.org',
      website: 'https://brightmindsacademy.org',
      logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
      rating: 4.7,
      numReviews: 41,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    });

    const b9 = await Business.create({
      owner: rohit._id,
      name: 'CarePlus Pharmacy',
      category: 'Healthcare',
      description: '24/7 retail pharmacy, genuine prescribed medications, wellness supplements, surgical supplies, and free doorstep delivery.',
      address: 'Collectorate Road, Nagarampalem',
      city: 'Guntur',
      state: 'Andhra Pradesh',
      zipCode: '522004',
      phone: '+91 863 2556677',
      email: 'orders@carepluspharmacy.in',
      website: 'https://carepluspharmacy.in',
      logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&auto=format&fit=crop&q=80',
      rating: 4.4,
      numReviews: 33,
      isVerified: true,
      status: 'approved',
      openingHours: 'Open 24 Hours (7 Days a week)',
    });

    const b10 = await Business.create({
      owner: vamsi._id,
      name: 'Style Hub',
      category: 'Fashion',
      description: 'Exclusive streetwear sneakers, graphic oversized tees, denim jackets, and fashion accessories for men and women.',
      address: 'Pinnamaneni Poly Clinic Road, Moghalrajpuram',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      zipCode: '520010',
      phone: '+91 866 2478811',
      email: 'support@stylehubvza.com',
      website: 'https://stylehubvza.com',
      logo: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
      rating: 4.3,
      numReviews: 38,
      isVerified: true,
      status: 'approved',
      openingHours: 'Mon - Sun: 10:00 AM - 10:00 PM',
    });

    console.log('Seeded 10 Dummy Businesses');

    // 3. CREATE 20+ REALISTIC DUMMY OFFERS
    const now = new Date();
    const expiry = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const offers = await Offer.create([
      // Fresh Bite Cafe Offers (2)
      {
        business: b1._id,
        title: 'Weekend Special – 20% OFF on All Pizzas & Pastas',
        description: 'Enjoy delicious wood-fired pizzas and creamy handmade pastas with an instant 20% discount on orders above ₹499.',
        category: 'Food & Restaurants',
        discountType: 'percentage',
        discountValue: '20% OFF',
        originalPrice: 650,
        discountedPrice: 520,
        promoCode: 'WEEKEND20',
        startDate: now,
        endDate: expiry(30),
        termsConditions: 'Valid on dine-in and takeaway every Friday, Saturday & Sunday.',
        bannerImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
        viewsCount: 420,
        savesCount: 88,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b1._id,
        title: 'Buy 1 Get 1 Free on Artisan Mocktails & Frappes',
        description: 'Cool down with our refreshing signature mocktails and iced frappes. Order any beverage and get the second one free!',
        category: 'Food & Restaurants',
        discountType: 'bogo',
        discountValue: 'Buy 1 Get 1 FREE',
        originalPrice: 380,
        discountedPrice: 190,
        promoCode: 'SIPFREE',
        startDate: now,
        endDate: expiry(25),
        termsConditions: 'Applicable between 2:00 PM and 6:00 PM on weekdays.',
        bannerImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
        viewsCount: 290,
        savesCount: 62,
        isFeatured: false,
        status: 'active',
      },

      // Urban Threads Offers (2)
      {
        business: b2._id,
        title: 'Flat 30% OFF on Summer & Ethnic Collection',
        description: 'Upgrade your wardrobe with premium breathable linens, designer kurtis, and modern ethnic fusion wear.',
        category: 'Fashion',
        discountType: 'percentage',
        discountValue: 'Flat 30% OFF',
        originalPrice: 2499,
        discountedPrice: 1749,
        promoCode: 'SUMMER30',
        startDate: now,
        endDate: expiry(45),
        termsConditions: 'Valid on purchases above ₹1,499. Cannot be clubbed with bridal wear.',
        bannerImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
        viewsCount: 540,
        savesCount: 112,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b2._id,
        title: 'Buy 2 Get 1 Free on Men Formal & Casual Shirts',
        description: 'Premium pure cotton shirts in slim and regular fits. Choose any 3 shirts and pay only for 2.',
        category: 'Fashion',
        discountType: 'bogo',
        discountValue: 'Buy 2 Get 1 FREE',
        originalPrice: 3597,
        discountedPrice: 2398,
        promoCode: 'SHIRTS3',
        startDate: now,
        endDate: expiry(20),
        termsConditions: 'Free shirt must be of equal or lesser value.',
        bannerImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
        viewsCount: 310,
        savesCount: 45,
        isFeatured: false,
        status: 'active',
      },

      // TechZone Mobiles Offers (2)
      {
        business: b3._id,
        title: '₹1,000 OFF on Selected Smartphone Accessories & Smartwatches',
        description: 'Get an instant flat ₹1,000 discount on original wireless earbuds, smartwatches, and fast charging docks.',
        category: 'Electronics',
        discountType: 'flat',
        discountValue: '₹1,000 OFF',
        originalPrice: 4999,
        discountedPrice: 3999,
        promoCode: 'TECH1000',
        startDate: now,
        endDate: expiry(35),
        termsConditions: 'Minimum purchase value ₹3,500.',
        bannerImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
        viewsCount: 680,
        savesCount: 145,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b3._id,
        title: 'Free Tempered Glass & Premium Case on Screen Replacements',
        description: 'Cracked screen? Get original OEM display replacement and receive free 9H tempered glass plus a shockproof cover.',
        category: 'Electronics',
        discountType: 'special',
        discountValue: 'FREE Combo Gift',
        originalPrice: 2500,
        discountedPrice: 1999,
        promoCode: 'FIXNPROTECT',
        startDate: now,
        endDate: expiry(40),
        termsConditions: 'Valid on Apple, Samsung, OnePlus, and Xiaomi models.',
        bannerImage: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80',
        viewsCount: 220,
        savesCount: 38,
        isFeatured: false,
        status: 'active',
      },

      // Glow Beauty Studio Offers (2)
      {
        business: b4._id,
        title: '25% OFF on Luxury Hair Spa & Keratin Smoothing',
        description: 'Restore shine and nourish your hair with deep conditioning Moroccan oil hair spa and professional styling.',
        category: 'Beauty & Salon',
        discountType: 'percentage',
        discountValue: '25% OFF',
        originalPrice: 2000,
        discountedPrice: 1500,
        promoCode: 'GLOWSPA25',
        startDate: now,
        endDate: expiry(30),
        termsConditions: 'Appointment booking recommended prior to visit.',
        bannerImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
        viewsCount: 490,
        savesCount: 95,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b4._id,
        title: 'Complete Bridal Glow Package at Flat ₹4,999',
        description: 'Comprehensive package including Gold Facial, Full Body Waxing, Manicure, Pedicure, and Threading.',
        category: 'Beauty & Salon',
        discountType: 'special',
        discountValue: 'Save ₹3,000',
        originalPrice: 7999,
        discountedPrice: 4999,
        promoCode: 'BRIDALGLOW',
        startDate: now,
        endDate: expiry(60),
        termsConditions: 'Must be booked at least 3 days in advance.',
        bannerImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
        viewsCount: 380,
        savesCount: 78,
        isFeatured: false,
        status: 'active',
      },

      // FitLife Gym Offers (2)
      {
        business: b5._id,
        title: '1 Month Gym Membership at Just ₹999 (New Members)',
        description: 'Full gym access, cardio machines, free weights, group HIIT workout sessions, and personalized diet chart.',
        category: 'Fitness',
        discountType: 'special',
        discountValue: 'Special ₹999/mo',
        originalPrice: 2500,
        discountedPrice: 999,
        promoCode: 'FITLIFE999',
        startDate: now,
        endDate: expiry(30),
        termsConditions: 'Valid for first-time enrollments only.',
        bannerImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
        viewsCount: 820,
        savesCount: 190,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b5._id,
        title: 'Annual Membership: Pay for 8 Months, Get 4 Months FREE',
        description: 'Commit to your fitness transformation for a full year and get 4 months completely free plus 5 personal training sessions.',
        category: 'Fitness',
        discountType: 'special',
        discountValue: '4 Months FREE',
        originalPrice: 18000,
        discountedPrice: 12000,
        promoCode: 'ANNUALFIT',
        startDate: now,
        endDate: expiry(50),
        termsConditions: 'Free locker and steam bath included.',
        bannerImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
        viewsCount: 410,
        savesCount: 85,
        isFeatured: false,
        status: 'active',
      },

      // Green Leaf Restaurant Offers (2)
      {
        business: b6._id,
        title: 'Buy 1 Get 1 Free on Selected Meals & Starters',
        description: 'Order any tandoori platter or paneer tikka starter and receive a second starter of your choice complimentary.',
        category: 'Food & Restaurants',
        discountType: 'bogo',
        discountValue: 'Buy 1 Get 1 FREE',
        originalPrice: 580,
        discountedPrice: 290,
        promoCode: 'GREENBOGO',
        startDate: now,
        endDate: expiry(28),
        termsConditions: 'Dine-in only between 7:00 PM and 10:00 PM.',
        bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
        viewsCount: 610,
        savesCount: 130,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b6._id,
        title: 'Unlimited Royal Andhra Thali at Flat ₹249 on Weekdays',
        description: 'Over 14 authentic Andhra dishes including gongura chutney, sambar, rasam, podi, curries, and sweet payasam.',
        category: 'Food & Restaurants',
        discountType: 'special',
        discountValue: '₹249 Unlimited',
        originalPrice: 380,
        discountedPrice: 249,
        promoCode: 'THALI249',
        startDate: now,
        endDate: expiry(35),
        termsConditions: 'Available Monday to Thursday lunchtime (12:00 PM - 3:30 PM).',
        bannerImage: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&auto=format&fit=crop&q=80',
        viewsCount: 520,
        savesCount: 98,
        isFeatured: false,
        status: 'active',
      },

      // Smart Home Services Offers (2)
      {
        business: b7._id,
        title: 'Complete AC Servicing & Jet Cleaning at Just ₹499',
        description: 'High-pressure water jet cleaning for indoor and outdoor units, gas pressure check, and filter sanitization.',
        category: 'Home Services',
        discountType: 'special',
        discountValue: 'Flat ₹499/unit',
        originalPrice: 999,
        discountedPrice: 499,
        promoCode: 'COOL499',
        startDate: now,
        endDate: expiry(40),
        termsConditions: 'Spare parts and gas top-up charged separately if required.',
        bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        viewsCount: 370,
        savesCount: 76,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b7._id,
        title: '20% OFF on Full Home Deep Cleaning & Sanitization',
        description: 'Professional mechanized scrubbing for kitchen degreasing, bathroom descaling, balcony washing, and sofa vacuuming.',
        category: 'Home Services',
        discountType: 'percentage',
        discountValue: '20% OFF',
        originalPrice: 4500,
        discountedPrice: 3600,
        promoCode: 'CLEAN20',
        startDate: now,
        endDate: expiry(30),
        termsConditions: 'Applicable for 2BHK and 3BHK residences.',
        bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
        viewsCount: 280,
        savesCount: 42,
        isFeatured: false,
        status: 'active',
      },

      // Bright Minds Academy Offers (2)
      {
        business: b8._id,
        title: '10% OFF on New Course Enrollment (IIT-JEE / NEET Foundation)',
        description: 'Comprehensive study material, weekly mock tests, doubt solving sessions, and mentorship by top faculties.',
        category: 'Education',
        discountType: 'percentage',
        discountValue: '10% OFF',
        originalPrice: 35000,
        discountedPrice: 31500,
        promoCode: 'BRIGHT10',
        startDate: now,
        endDate: expiry(60),
        termsConditions: 'Applicable on full upfront fee payment for the academic year.',
        bannerImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
        viewsCount: 460,
        savesCount: 89,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b8._id,
        title: 'Free 1-Week Coding Bootcamp Trial for Kids (Ages 10-16)',
        description: 'Learn fundamentals of Python, game development in Scratch, and basic robotics in an interactive hands-on workshop.',
        category: 'Education',
        discountType: 'special',
        discountValue: '100% FREE Trial',
        originalPrice: 2000,
        discountedPrice: 0,
        promoCode: 'CODEKIDS',
        startDate: now,
        endDate: expiry(45),
        termsConditions: 'Limited to first 25 registered students.',
        bannerImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
        viewsCount: 390,
        savesCount: 104,
        isFeatured: false,
        status: 'active',
      },

      // CarePlus Pharmacy Offers (2)
      {
        business: b9._id,
        title: 'Special Wellness Week: 15% OFF on Prescription Medicines',
        description: 'Save on your monthly recurring medicines, blood pressure monitors, glucometers, and multivitamin supplements.',
        category: 'Healthcare',
        discountType: 'percentage',
        discountValue: '15% OFF',
        originalPrice: 1500,
        discountedPrice: 1275,
        promoCode: 'CARE15',
        startDate: now,
        endDate: expiry(30),
        termsConditions: 'Valid doctor prescription required for scheduled drugs.',
        bannerImage: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop&q=80',
        viewsCount: 340,
        savesCount: 71,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b9._id,
        title: 'Free Basic Health Checkup Camp (BP, Sugar, BMI) on Sundays',
        description: 'Walk in every Sunday between 9 AM and 1 PM for complimentary health screenings and consultation with certified pharmacists.',
        category: 'Healthcare',
        discountType: 'special',
        discountValue: 'FREE Health Camp',
        originalPrice: 500,
        discountedPrice: 0,
        promoCode: 'SUNDAYCARE',
        startDate: now,
        endDate: expiry(45),
        termsConditions: 'Fasting sugar test recommended.',
        bannerImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
        viewsCount: 260,
        savesCount: 53,
        isFeatured: false,
        status: 'active',
      },

      // Style Hub Offers (2)
      {
        business: b10._id,
        title: 'Flat 40% OFF on Premium Sneakers & Streetwear',
        description: 'Huge discounts on high-top kicks, chunky sneakers, oversized vintage graphic hoodies, and cargo joggers.',
        category: 'Fashion',
        discountType: 'percentage',
        discountValue: '40% OFF',
        originalPrice: 3999,
        discountedPrice: 2399,
        promoCode: 'STREET40',
        startDate: now,
        endDate: expiry(30),
        termsConditions: 'Valid on select brands in store.',
        bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        viewsCount: 710,
        savesCount: 165,
        isFeatured: true,
        status: 'active',
      },
      {
        business: b10._id,
        title: 'Buy Any 2 Graphic Tees for Just ₹999',
        description: '100% combed cotton, 240 GSM heavy fabric graphic t-shirts with durable high-density screen prints.',
        category: 'Fashion',
        discountType: 'special',
        discountValue: '2 Tees @ ₹999',
        originalPrice: 1798,
        discountedPrice: 999,
        promoCode: '2TEES999',
        startDate: now,
        endDate: expiry(25),
        termsConditions: 'Choose any two t-shirts from the displayed rack.',
        bannerImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        viewsCount: 430,
        savesCount: 88,
        isFeatured: false,
        status: 'active',
      },
    ]);

    console.log(`Seeded ${offers.length} Dummy Offers across all businesses.`);

    // 4. CREATE SAVED OFFERS
    await SavedOffer.create({ user: rahul._id, offer: offers[0]._id });
    await SavedOffer.create({ user: rahul._id, offer: offers[4]._id });
    await SavedOffer.create({ user: rahul._id, offer: offers[8]._id });
    await SavedOffer.create({ user: arjun._id, offer: offers[2]._id });
    await SavedOffer.create({ user: priya._id, offer: offers[6]._id });

    rahul.savedOffers = [offers[0]._id, offers[4]._id, offers[8]._id];
    await rahul.save();

    // 5. CREATE 15 REALISTIC DUMMY ENQUIRIES
    const enquiriesData = [
      {
        customer: rahul._id,
        business: b1._id,
        offer: offers[0]._id,
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '+91 91234 56789',
        subject: 'Weekend Special – 20% OFF Availability',
        message: 'Is this offer available on Sunday for a family table reservation of 6 people?',
        status: 'replied',
        replies: [
          {
            sender: vamsi._id,
            senderRole: 'business',
            message: 'Hello Rahul! Yes, absolutely. The 20% discount is valid all day Sunday. We look forward to hosting your family.',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: arjun._id,
        business: b2._id,
        offer: offers[2]._id,
        name: 'Arjun Reddy',
        email: 'arjun@example.com',
        phone: '+91 92345 67890',
        subject: 'Inquiry on Men Kurta Sizes for Summer30 Promo',
        message: 'Do you have XL and XXL sizes available for the yellow and pastel blue linen kurtas under the 30% discount?',
        status: 'replied',
        replies: [
          {
            sender: anjali._id,
            senderRole: 'business',
            message: 'Hi Arjun, yes! We received fresh stock of pastel linen kurtas in all sizes today. You can visit anytime!',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: priya._id,
        business: b4._id,
        offer: offers[6]._id,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 93456 78901',
        subject: 'Hair Spa Booking for Saturday Afternoon',
        message: 'Can I book a slot at 3 PM this Saturday for the Keratin Hair Spa deal?',
        status: 'replied',
        replies: [
          {
            sender: anjali._id,
            senderRole: 'business',
            message: 'Hi Priya, 3 PM on Saturday is confirmed for you. See you soon!',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: sneha._id,
        business: b5._id,
        offer: offers[8]._id,
        name: 'Sneha Rao',
        email: 'sneha@example.com',
        phone: '+91 94567 89012',
        subject: 'Timing and Women-Only Batches at FitLife Gym',
        message: 'Are there morning dedicated slots for female members with female trainers included in the ₹999 offer?',
        status: 'replied',
        replies: [
          {
            sender: rohit._id,
            senderRole: 'business',
            message: 'Hello Sneha, yes we have dedicated women batches from 10:30 AM to 12:00 PM and certified female trainers available.',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: kiran._id,
        business: b3._id,
        offer: offers[4]._id,
        name: 'Kiran Varma',
        email: 'kiran@example.com',
        phone: '+91 95678 90123',
        subject: 'TechZone Mobiles: Smartwatch Warranty Query',
        message: 'Does the ₹1000 discount apply to the latest Samsung Galaxy Watch 6 and does it carry full official brand warranty?',
        status: 'pending',
        replies: [],
      },
      {
        customer: rahul._id,
        business: b6._id,
        offer: offers[10]._id,
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '+91 91234 56789',
        subject: 'Green Leaf: Large Party Catering on BOGO deal',
        message: 'We want to order starters for 20 people this Friday. Can we apply the Buy 1 Get 1 promo for bulk takeaway?',
        status: 'pending',
        replies: [],
      },
      {
        customer: arjun._id,
        business: b7._id,
        offer: offers[12]._id,
        name: 'Arjun Reddy',
        email: 'arjun@example.com',
        phone: '+91 92345 67890',
        subject: 'AC Jet Cleaning for 3 Split Units in Moghalrajpuram',
        message: 'Can technicians visit tomorrow at 10 AM for 3 Daikin AC split unit cleanings under the ₹499 deal?',
        status: 'replied',
        replies: [
          {
            sender: vamsi._id,
            senderRole: 'business',
            message: 'Hi Arjun! We have scheduled technician Mr. Suresh for tomorrow at 10 AM. He will call you 30 minutes before arrival.',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: priya._id,
        business: b8._id,
        offer: offers[14]._id,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 93456 78901',
        subject: 'Bright Minds: Class 10 Foundation Batch Timings',
        message: 'What are the evening batch timings for Class 10 CBSE Math & Science foundation classes?',
        status: 'replied',
        replies: [
          {
            sender: anjali._id,
            senderRole: 'business',
            message: 'Hello Priya, the evening batch runs from 5:30 PM to 7:45 PM on Monday, Wednesday, and Friday.',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: sneha._id,
        business: b9._id,
        offer: offers[16]._id,
        name: 'Sneha Rao',
        email: 'sneha@example.com',
        phone: '+91 94567 89012',
        subject: 'Doorstep Medicine Delivery in Brodipet Guntur',
        message: 'If I upload my prescription today by 5 PM, can the medicines be delivered tonight under the 15% discount?',
        status: 'replied',
        replies: [
          {
            sender: rohit._id,
            senderRole: 'business',
            message: 'Yes Sneha! We offer express 2-hour doorstep delivery anywhere within Guntur city limits.',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: kiran._id,
        business: b10._id,
        offer: offers[18]._id,
        name: 'Kiran Varma',
        email: 'kiran@example.com',
        phone: '+91 95678 90123',
        subject: 'Style Hub: Sneaker UK 9 Size Availability',
        message: 'Are the chunky white high-top sneakers available in UK size 9 under the 40% OFF promo?',
        status: 'pending',
        replies: [],
      },
      {
        customer: rahul._id,
        business: b3._id,
        offer: offers[5]._id,
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '+91 91234 56789',
        subject: 'iPhone 13 Screen Replacement Estimate Time',
        message: 'How long does the screen replacement take if I drop the phone off in the morning?',
        status: 'replied',
        replies: [
          {
            sender: rohit._id,
            senderRole: 'business',
            message: 'Hi Rahul, screen replacement takes approximately 45 to 60 minutes with full testing.',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: arjun._id,
        business: b5._id,
        offer: offers[9]._id,
        name: 'Arjun Reddy',
        email: 'arjun@example.com',
        phone: '+91 92345 67890',
        subject: 'Annual Membership Installment Options',
        message: 'Can the annual membership of ₹12,000 be paid in 2 easy monthly installments?',
        status: 'pending',
        replies: [],
      },
      {
        customer: priya._id,
        business: b1._id,
        offer: offers[1]._id,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 93456 78901',
        subject: 'Vegan Milk Options for Frappes',
        message: 'Do you offer almond or oat milk substitutes for the iced frappes on the Buy 1 Get 1 deal?',
        status: 'replied',
        replies: [
          {
            sender: vamsi._id,
            senderRole: 'business',
            message: 'Yes Priya! Both almond and oat milk options are available upon request.',
            createdAt: new Date(),
          },
        ],
      },
      {
        customer: sneha._id,
        business: b7._id,
        offer: offers[13]._id,
        name: 'Sneha Rao',
        email: 'sneha@example.com',
        phone: '+91 94567 89012',
        subject: 'Home Deep Cleaning Inspection Quote',
        message: 'Do you provide a pre-inspection visit before the deep cleaning service?',
        status: 'pending',
        replies: [],
      },
      {
        customer: kiran._id,
        business: b6._id,
        offer: offers[11]._id,
        name: 'Kiran Varma',
        email: 'kiran@example.com',
        phone: '+91 95678 90123',
        subject: 'Royal Andhra Thali: Jain / No Onion Options',
        message: 'Is a Jain / Satvik version of the unlimited Andhra thali available during weekday lunch?',
        status: 'replied',
        replies: [
          {
            sender: vamsi._id,
            senderRole: 'business',
            message: 'Yes Kiran, please inform our captain upon seating and we will serve fresh Jain preparations.',
            createdAt: new Date(),
          },
        ],
      },
    ];

    await Enquiry.create(enquiriesData);
    console.log(`Seeded ${enquiriesData.length} Dummy Enquiries with replies`);

    // 6. CREATE DUMMY REVIEWS
    await Review.create([
      {
        user: rahul._id,
        business: b1._id,
        rating: 5,
        comment: 'Fresh Bite Cafe has the best wood-fired pizza in Vijayawada! The crust is crisp, cheese is fresh, and the 20% discount made it a steal.',
      },
      {
        user: priya._id,
        business: b1._id,
        rating: 4,
        comment: 'Lovely ambience and prompt service. The mocktails are super refreshing on a warm afternoon.',
      },
      {
        user: arjun._id,
        business: b2._id,
        rating: 5,
        comment: 'Urban Threads has an incredible ethnic collection. Got beautiful linen shirts with the summer discount.',
      },
      {
        user: sneha._id,
        business: b4._id,
        rating: 5,
        comment: 'The hair spa transformed my frizzy hair into silky smooth locks. Very hygienic studio and friendly staff.',
      },
      {
        user: kiran._id,
        business: b3._id,
        rating: 4,
        comment: 'Quick and reliable service. Bought original earphones at flat ₹1000 off. Highly recommended!',
      },
      {
        user: rahul._id,
        business: b6._id,
        rating: 5,
        comment: 'The Andhra Thali was authentic perfection! Gongura pachadi and hot ghee podi took me right back to homemade traditional feasts.',
      },
    ]);
    console.log('Seeded Customer Reviews');

    console.log('=====================================================');
    console.log('🎉 NEARNEST DUMMY DATA SEED COMPLETED SUCCESSFULLY!');
    console.log('=====================================================');
    console.log('Demo Login Accounts:');
    console.log('• Customer: rahul@example.com / Password123');
    console.log('• Business: vamsi.business@example.com / Password123');
    console.log('• Admin:    admin@example.com / Password123');
    console.log('=====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
