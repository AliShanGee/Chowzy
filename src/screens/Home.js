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

  // Performance Optimization: Extract unique categories using Set to achieve O(C) complexity instead of O(C^2)
  const uniqueCategories = useMemo(() => {
    const seen = new Set();
    const unique = [];
    for (let i = 0; i < foodCat.length; i++) {
      const cat = foodCat[i];
      if (cat && cat.CategoryName && !seen.has(cat.CategoryName)) {
        seen.add(cat.CategoryName);
        unique.push(cat);
      }
    }
    return unique;
  }, [foodCat]);

  // Performance Optimization: Memoize total pages calculation
  const totalPages = useMemo(() => {
    return Math.ceil(uniqueCategories.length / itemsPerPage);
  }, [uniqueCategories, itemsPerPage]);

  // Performance Optimization: Paginate categories via slice inside memoized hook
  const currentCategories = useMemo(() => {
    return uniqueCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [uniqueCategories, currentPage, itemsPerPage]);

  // Performance Optimization: Single-pass O(N) filtering, category grouping, and deduplication
  const filteredItemsByCategory = useMemo(() => {
    const map = new Map();
    if (!foodItem || foodItem.length === 0) return map;

    const lowerSearch = search.toLowerCase();
    const seenNamesByCategory = new Map();
    const currentPageCats = new Set(currentCategories.map(c => c.CategoryName));

    for (let i = 0; i < foodItem.length; i++) {
      const item = foodItem[i];
      if (!item || !item.name || !item.CategoryName) continue;

      // Only process items that belong to the active, visible categories
      if (!currentPageCats.has(item.CategoryName)) continue;

      // Filter by search term
      if (lowerSearch && !item.name.toLowerCase().includes(lowerSearch)) continue;

      const catName = item.CategoryName;
      if (!seenNamesByCategory.has(catName)) {
        seenNamesByCategory.set(catName, new Set());
        map.set(catName, []);
      }

      const seenSet = seenNamesByCategory.get(catName);
      if (!seenSet.has(item.name)) {
        seenSet.add(item.name);
        map.get(catName).push(item);
      }
    }
    return map;
  }, [foodItem, search, currentCategories]);

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
        {
          foodCat.length === 0 ? "" : (
            <>
              {currentCategories.map((data) => {
                const categoryItems = filteredItemsByCategory.get(data.CategoryName) || [];
                return (
                  <div className='row mb-3' key={data._id}>
                    <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                      {data.CategoryName}
                    </div>
                    <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                    {categoryItems.length > 0 ? (
                      categoryItems.map(filterItems => {
                        return (
                          <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                            <Card foodItem={filterItems} options={filterItems.options[0]} />
                          </div>
                        )
                      })
                    ) : (
                      <div className="ps-3" style={{ color: theme === 'dark' ? '#adb5bd' : '#555' }}>No Such Data Found</div>
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
          )
        }
        </div>
        <Footer/>
      </div>
    </div>
  )
}
