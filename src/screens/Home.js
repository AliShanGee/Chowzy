import React, { useEffect, useState, useMemo } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../components/Footer.js'
import Card from '../components/Card.js'
import Page from '../components/Pagination.js'
import Lottie from 'lottie-react'
import homeBg from '../animations/YDT9GjiZWg.json'
import { useTheme } from 'next-themes'
import SearchBar from '../components/SearchBar.js'

import API_BASE_URL from '../config'

export default function Home() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const loadData = async () => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/foodData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      setFoodItem(data[0] || []);
      setFoodCat(data[1] || []);
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    AOS.init({
      duration: 1000 // values from 50 to 3000, with step 50ms
    });
  }, []);

  // Performance Optimization:
  // 1. Deduplicate unique categories in O(C) time using a Set instead of O(C^2) Array.prototype.findIndex.
  // 2. Memoize pagination slicing so it only recalculates when categories or page change.
  const { uniqueCategories, totalPages, currentCategories } = useMemo(() => {
    if (!foodCat || foodCat.length === 0) {
      return { uniqueCategories: [], totalPages: 0, currentCategories: [] };
    }

    const seenCategories = new Set();
    const unique = [];
    for (const cat of foodCat) {
      if (cat && cat.CategoryName && !seenCategories.has(cat.CategoryName)) {
        seenCategories.add(cat.CategoryName);
        unique.push(cat);
      }
    }

    const pages = Math.ceil(unique.length / itemsPerPage);
    const pagedCategories = unique.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
      uniqueCategories: unique,
      totalPages: pages,
      currentCategories: pagedCategories
    };
  }, [foodCat, currentPage, itemsPerPage]);

  // Performance Optimization:
  // Index and deduplicate food items for visible categories in a single O(M) pass.
  // Eliminates:
  // - O(C * M) redundant full-array passes per category
  // - O(K^2) quadratic deduplication via Array.prototype.reduce + .some() + array spreading [...unique, item]
  // - Repeated toLowerCase() string allocations inside nested loops
  const filteredItemsByCategory = useMemo(() => {
    if (!foodItem || foodItem.length === 0 || currentCategories.length === 0) {
      return new Map();
    }

    const searchLower = search ? search.toLowerCase() : '';
    const categoryNamesOnPage = new Set(currentCategories.map(c => c.CategoryName));
    const itemsMap = new Map();
    const seenNamesMap = new Map();

    for (const item of foodItem) {
      if (!item || !item.name || !item.CategoryName || !categoryNamesOnPage.has(item.CategoryName)) {
        continue;
      }
      if (searchLower && !item.name.toLowerCase().includes(searchLower)) {
        continue;
      }

      let seenNames = seenNamesMap.get(item.CategoryName);
      if (!seenNames) {
        seenNames = new Set();
        seenNamesMap.set(item.CategoryName, seenNames);
        itemsMap.set(item.CategoryName, []);
      }

      if (!seenNames.has(item.name)) {
        seenNames.add(item.name);
        itemsMap.get(item.CategoryName).push(item);
      }
    }

    return itemsMap;
  }, [foodItem, currentCategories, search]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {theme !== 'dark' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundColor: '#000' }}>
          <Lottie
            animationData={homeBg}
            loop
            autoplay
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice', progressiveLoad: true, clearCanvas: false }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          {/* Search Bar */}
          <div className="row mb-2 mt-2" data-aos="fade-down" style={{ position: 'relative', zIndex: 5000 }}>
            <div className="col-12 text-center mb-3">
              <h1 style={{ 
                color: theme === 'dark' ? '#fff' : '#1a1a1a', 
                textShadow: theme === 'dark' ? '2px 2px 8px rgba(0,0,0,0.7)' : '0 2px 4px rgba(0,0,0,0.1)',
                fontWeight: 'bold',
                transition: 'color 0.3s ease'
              }}>Explore Amazing Foods</h1>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-center">
                <SearchBar 
                  items={foodItem} 
                  onSearch={(val) => setSearch(val)} 
                />
              </div>
            </div>
          </div>
          {uniqueCategories.length > 0 && (
            <>
              {currentCategories.map((data) => {
                const categoryItems = filteredItemsByCategory.get(data.CategoryName) || [];
                return (
                  <div className='row mb-3' key={data._id}>
                    <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                      {data.CategoryName}
                    </div>
                    <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                    {foodItem.length > 0 ? (
                      categoryItems.map(filterItems => (
                        <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                          <Card foodItem={filterItems} options={filterItems.options[0]} />
                        </div>
                      ))
                    ) : (
                      <div>No Such Data Found</div>
                    )}
                  </div>
                );
              })}
              {totalPages > 1 && (
                <Page
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
        <Footer/>
      </div>
    </div>
  )
}
