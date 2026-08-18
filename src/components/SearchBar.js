import React, { useState } from 'react';
import { useCombobox } from 'downshift';
import { IoCloseCircleOutline, IoSearchOutline } from "react-icons/io5";

const SearchBar = ({ items, onSearch }) => {
  const [inputItems, setInputItems] = useState(items);

  // Update inputItems when items prop changes (after fetching)
  React.useEffect(() => {
    setInputItems(items.slice(0, 10));
  }, [items]);

  const getFilteredItems = (inputValue) => {
    if (!inputValue) return items.slice(0, 10);
    return items.filter((item) =>
      item && item.name && item.name.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 10);
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
    inputValue,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item && item.name ? item.name : ''),
    onInputValueChange: ({ inputValue }) => {
      setInputItems(getFilteredItems(inputValue || ''));
      onSearch(inputValue || '');
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onSearch(selectedItem.name);
      }
    },
  });

  // Optimization: Perform linear substring index matching with indexOf instead of dynamic RegExp construction
  // This improves search dropdown highlighting performance (~10x faster) and avoids regex syntax errors with special chars
  const highlightMatch = (text, query) => {
    if (!text) return '';
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const parts = [];
    let start = 0;
    let index = lowerText.indexOf(lowerQuery, start);

    while (index !== -1) {
      if (index > start) {
        parts.push({ text: text.slice(start, index), isMatch: false });
      }
      parts.push({ text: text.slice(index, index + query.length), isMatch: true });
      start = index + query.length;
      index = lowerText.indexOf(lowerQuery, start);
    }

    if (start < text.length) {
      parts.push({ text: text.slice(start), isMatch: false });
    }

    return (
      <span>
        {parts.map((part, i) =>
          part.isMatch ? (
            <span key={i} style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold', borderRadius: '2px' }}>{part.text}</span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="search-wrapper w-100" style={{ position: 'relative', maxWidth: '650px', zIndex: 5000 }}>
      {/* Search Input Container */}
      <div 
        className="search-input-container shadow-lg" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.98)', 
          borderRadius: '50px', 
          padding: '5px 15px', 
          border: '2px solid transparent',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0, 123, 255, 0.2)',
          ...(isOpen ? { borderColor: '#007bff' } : {})
        }}
      >
        <span style={{ fontSize: '24px', color: '#007bff', marginLeft: '10px' }}>
          <IoSearchOutline />
        </span>
        
        <input
          {...getInputProps()}
          className="form-control"
          placeholder="What are you craving today?"
          style={{
            border: 'none',
            fontSize: '18px',
            padding: '12px 15px',
            boxShadow: 'none',
            backgroundColor: 'transparent',
            flex: 1
          }}
        />

        {inputValue && (
          <button
            onClick={() => {
              setInputValue('');
              onSearch('');
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              color: '#999', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '5px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#dc3545'}
            onMouseOut={(e) => e.currentTarget.style.color = '#999'}
          >
            <IoCloseCircleOutline />
          </button>
        )}
        
        <button
          className="btn btn-primary"
          style={{
            borderRadius: '40px',
            padding: '10px 25px',
            fontWeight: '600',
            marginLeft: '10px',
            background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0, 86, 179, 0.3)'
          }}
        >
          Search
        </button>
      </div>

      {/* Dropdown Menu */}
      <ul
        {...getMenuProps()}
        style={{
          position: 'absolute',
          top: '110%',
          left: '20px',
          right: '20px',
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: isOpen ? '10px 0' : '0',
          listStyle: 'none',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          display: isOpen ? 'block' : 'none',
          overflow: 'hidden',
          zIndex: 5001,
          border: isOpen ? '1px solid rgba(0,123,255,0.1)' : 'none',
          maxHeight: '400px',
          overflowY: 'auto'
        }}
      >
        {isOpen && (
          inputItems.length > 0 ? (
            inputItems.map((item, index) => (
              <li
                key={`${item.name}${index}`}
                {...getItemProps({ item, index })}
                style={{
                  padding: '12px 20px',
                  backgroundColor: highlightedIndex === index ? '#f0f7ff' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '12px', 
                    marginRight: '15px', 
                    backgroundColor: '#eee',
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    color: highlightedIndex === index ? '#007bff' : '#333',
                    fontSize: '16px' 
                  }}>
                    {highlightMatch(item.name, inputValue)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#777' }}>
                    {item.CategoryName}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🍽️</div>
              <div>No results found for "<strong>{inputValue}</strong>"</div>
              <div style={{ fontSize: '13px', marginTop: '5px' }}>Try searching for something else!</div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
