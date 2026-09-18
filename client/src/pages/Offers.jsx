import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import OfferCard from '../components/OfferCard';
import Filter from '../components/Filter';
import SearchBar from '../components/SearchBar';
import { Spinner } from '../components/Loading';
import offerService from '../services/offerService';
import { Tag, Sparkles } from 'lucide-react';

const Offers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialDiscountType = searchParams.get('discountType') || 'All';

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [discountType, setDiscountType] = useState(initialDiscountType);
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const params = {
          search: query,
          category: category !== 'All' ? category : undefined,
          discountType: discountType !== 'All' ? discountType : undefined,
          sort,
        };
        const res = await offerService.getOffers(params);
        if (res.success) {
          setOffers(res.data);
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [category, sort, discountType, query]);

  const handleSearch = ({ query: q }) => {
    setQuery(q);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={13} /> Real-Time Local Promotions
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Explore Verified Community Deals
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Browse coupons, discounts, BOGO specials, and flash promotions from top-rated local merchants.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2.5rem' }}>
        <SearchBar onSearch={handleSearch} initialQuery={query} placeholder="Search discount title, business, or code..." />
      </div>

      {/* Filter Component */}
      <Filter
        selectedCategory={category}
        onSelectCategory={setCategory}
        selectedSort={sort}
        onSelectSort={setSort}
        discountType={discountType}
        onSelectDiscountType={setDiscountType}
      />

      {/* Offers Results Grid */}
      {loading ? (
        <Spinner text="Loading exclusive deals..." />
      ) : offers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <Tag size={48} color="#818cf8" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No offers matched your filter</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
            Try resetting your category or search query to find more promotional discounts.
          </p>
          <button
            onClick={() => {
              setCategory('All');
              setDiscountType('All');
              setQuery('');
            }}
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
            Showing {offers.length} active promotion{offers.length === 1 ? '' : 's'}
          </div>
          <div className="grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Offers;
