import React, { useState, useEffect } from 'react';
import BusinessCard from '../components/BusinessCard';
import Filter from '../components/Filter';
import SearchBar from '../components/SearchBar';
import { Spinner } from '../components/Loading';
import businessService from '../services/businessService';
import { Store, ShieldCheck } from 'lucide-react';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const params = {
          search: query,
          category: category !== 'All' ? category : undefined,
          sort,
        };
        const res = await businessService.getBusinesses(params);
        if (res.success) {
          setBusinesses(res.data);
        }
      } catch (err) {
        console.error('Error fetching businesses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [category, query, sort]);

  const handleSearch = ({ query: q }) => {
    setQuery(q);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
        <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
          <ShieldCheck size={13} /> Vetted Neighborhood Merchants
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Local Business Directory
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Discover trusted local shops, dining hotspots, wellness clinics, and skilled local service providers.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto 2.5rem' }}>
        <SearchBar onSearch={handleSearch} initialQuery={query} placeholder="Search business name, category, or keyword..." />
      </div>

      {/* Filter Component */}
      <Filter
        selectedCategory={category}
        onSelectCategory={setCategory}
        selectedSort={sort}
        onSelectSort={setSort}
      />

      {/* Results Grid */}
      {loading ? (
        <Spinner text="Loading local business directory..." />
      ) : businesses.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <Store size={48} color="#06b6d4" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No businesses found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setCategory('All');
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
            Showing {businesses.length} verified business{businesses.length === 1 ? '' : 'es'}
          </div>
          <div className="grid-cols-3">
            {businesses.map((b) => (
              <BusinessCard key={b._id} business={b} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Businesses;
