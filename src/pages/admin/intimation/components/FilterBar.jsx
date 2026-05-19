import React, { useState } from 'react';

const SearchIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const FilterIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
    </svg>
);
const BookmarkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const inputStyle = {
    border: '1px solid #E5E7EB',
    borderRadius: 6,
    padding: '9px 12px',
    fontSize: 12,
    color: '#374151',
    background: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
};

/** Shared filter bar used across all Intimation sub-pages */
const FilterBar = ({ searchPlaceholder = 'Search...' }) => {
    const [search, setSearch] = useState('');

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
            boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
        }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                    <SearchIcon />
                </span>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    style={{ ...inputStyle, width: '100%', paddingLeft: 32, boxSizing: 'border-box' }}
                />
            </div>

            {/* Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</span>
                <div style={{ position: 'relative' }}>
                    <select defaultValue="all" style={{ ...inputStyle, paddingRight: 28, appearance: 'none', WebkitAppearance: 'none' }}>
                        <option value="all">All Status</option>
                        <option>Completed</option>
                        <option>Pending</option>
                        <option>In Progress</option>
                    </select>
                    <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, pointerEvents: 'none', color: '#6B7280' }}>▾</span>
                </div>
            </div>

            {/* Date Range */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date Range</span>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
                    <span style={{ fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>01 Mar 2026 - 31 Mar 2026</span>
                    <CalendarIcon />
                </div>
            </div>

            {/* Advanced Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Advanced Filters</span>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <span style={{ fontSize: 12 }}>Filters</span>
                    <FilterIcon />
                </div>
            </div>

            {/* Saved Views */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saved Views</span>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <span style={{ fontSize: 12 }}>Save</span>
                    <BookmarkIcon />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
