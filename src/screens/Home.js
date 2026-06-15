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
  const [foodCat,setFoodCat] = useState([]);
  const [foodItem,setFoodItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Optimized data processing using useMemo
  const { uniqueCategories, filteredItemsByCategory, totalPages } = useMemo(() => {
    // 1. Get unique categories efficiently - O(C)
    const uniqueCats = [];
    const seenCats = new Set();

    if (Array.isArray(foodCat)) {
        for (const cat of foodCat) {
            if (cat.CategoryName && !seenCats.has(cat.CategoryName)) {
                seenCats.add(cat.CategoryName);
                uniqueCats.push(cat);
            }
        }
    }

    // 2. Pre-filter and group items by category in a single pass - O(N)
    const grouped = new Map();
    const searchLower = search.toLowerCase();

    if (Array.isArray(foodItem)) {
        for (const item of foodItem) {
            if (item.name && item.CategoryName && item.name.toLowerCase().includes(searchLower)) {
                if (!grouped.has(item.CategoryName)) {
                    grouped.set(item.CategoryName, []);
                }

                // Deduplicate by name within category efficiently using another set if needed,
                // but let's keep it simple O(N) overall if possible.
                // The original code used .reduce which was O(I^2) where I is items in category.
                const categoryItems = grouped.get(item.CategoryName);
                if (!categoryItems.some(i => i.name === item.name)) {
                    categoryItems.push(item);
                }
            }
        }
    }

    const total = Math.ceil(uniqueCats.length / itemsPerPage);

    return {
        uniqueCategories: uniqueCats,
        filteredItemsByCategory: grouped,
        totalPages: total
    };
  }, [foodCat, foodItem, search]);

  const loadData = async ()=>{
    try {
      let response = await fetch(`${API_BASE_URL}/api/foodData`,{
          method:"GET",
          headers:{
              "Content-Type":"application/json"
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
  useEffect(()=>{
    loadData()
  },[])
  useEffect(() => {
    AOS.init({
      duration: 1000 // values from 50 to 3000, with step 50ms
    });
  }, []);

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
            {/* Tags */}
            {/* <div className="col-12 text-center mt-3">
              <span className="badge rounded-pill bg-light text-dark me-2 p-2" style={{cursor: 'pointer'}}>latest food item</span>
              <span className="badge rounded-pill bg-light text-dark me-2 p-2" style={{cursor: 'pointer'}}>offer</span>
              <span className="badge rounded-pill bg-light text-dark me-2 p-2" style={{cursor: 'pointer'}}>new pizza</span>
              <span className="badge rounded-pill bg-light text-dark me-2 p-2" style={{cursor: 'pointer'}}>50% off foods</span>
            </div> */}
          </div>
        {
          uniqueCategories.length > 0 ? (
            (() => {
              const currentCategories = uniqueCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

              const result = (
                <>
                  {currentCategories.map((data) => {
                    const items = filteredItemsByCategory.get(data.CategoryName) || [];
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
                          <div className="ms-3" style={{ color: theme === 'dark' ? '#adb5bd' : '#6c757d' }}>No items found in this category matching your search.</div>
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
              );
              return result;
            })()
          ) : ""
        }
        </div>
        <Footer/>
      </div>
    </div>
  )
}
