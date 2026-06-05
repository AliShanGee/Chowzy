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

  // Optimized: Deduplicate categories using useMemo and Set
  const uniqueCategories = useMemo(() => {
    const seen = new Set();
    return foodCat.filter(cat => {
      if (seen.has(cat.CategoryName)) return false;
      seen.add(cat.CategoryName);
      return true;
    });
  }, [foodCat]);

  // Optimized: Group and filter items in a single pass using useMemo
  const filteredGroupedItems = useMemo(() => {
    const searchLower = search.toLowerCase();
    const grouped = new Map();
    const seenInCat = new Map();

    foodItem.forEach(item => {
      if (item.name && item.name.toLowerCase().includes(searchLower)) {
        const catName = item.CategoryName;
        if (!grouped.has(catName)) {
          grouped.set(catName, []);
          seenInCat.set(catName, new Set());
        }

        // Deduplicate items by name within the same category
        if (!seenInCat.get(catName).has(item.name)) {
          seenInCat.get(catName).add(item.name);
          grouped.get(catName).push(item);
        }
      }
    });
    return grouped;
  }, [foodItem, search]);

  const totalPages = Math.ceil(uniqueCategories.length / itemsPerPage);
  const currentCategories = useMemo(() => {
    return uniqueCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [uniqueCategories, currentPage, itemsPerPage]);

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

          {currentCategories.length > 0 ? (
            <>
              {currentCategories.map((data) => {
                const items = filteredGroupedItems.get(data.CategoryName) || [];
                return (
                  <div className='row mb-3' key={data._id}>
                    <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                      {data.CategoryName}
                    </div>
                    <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                    {items.length > 0 ? (
                      items.map(filterItems => (
                        <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                          <Card foodItem={filterItems} options={filterItems.options[0]} />
                        </div>
                      ))
                    ) : (
                      <div className="ms-3" style={{ color: theme === 'dark' ? '#adb5bd' : '#555' }}>
                        No items found in this category matching your search.
                      </div>
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
          ) : (
            foodItem.length > 0 && <div className="text-center mt-5">No categories found.</div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  )
}
