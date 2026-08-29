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

  // Bolt optimization: Memoize unique categories and total pages to avoid re-calculating on every search keystroke/render
  const { uniqueCategories, totalPages } = useMemo(() => {
    const seenCats = new Set();
    const unique = [];
    for (let i = 0; i < foodCat.length; i++) {
      const cat = foodCat[i];
      if (cat && cat.CategoryName && !seenCats.has(cat.CategoryName)) {
        seenCats.add(cat.CategoryName);
        unique.push(cat);
      }
    }
    return {
      uniqueCategories: unique,
      totalPages: Math.ceil(unique.length / itemsPerPage)
    };
  }, [foodCat, itemsPerPage]);

  // Bolt optimization: Memoize filtered and deduplicated food items grouped by CategoryName
  // Replaces nested O(N^2) .filter().reduce() inside the render map loop with single-pass O(N) grouping
  const itemMap = useMemo(() => {
    const map = new Map();
    const seenKeys = new Set();
    const query = search.toLowerCase();

    for (let i = 0; i < foodItem.length; i++) {
      const item = foodItem[i];
      if (item && item.name && item.CategoryName) {
        if (!query || item.name.toLowerCase().includes(query)) {
          const compositeKey = `${item.CategoryName}_${item.name}`;
          if (!seenKeys.has(compositeKey)) {
            seenKeys.add(compositeKey);
            if (!map.has(item.CategoryName)) {
              map.set(item.CategoryName, []);
            }
            map.get(item.CategoryName).push(item);
          }
        }
      }
    }
    return map;
  }, [foodItem, search]);

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
          {foodCat.length > 0 && (
            <>
              {currentCategories.map((data) => {
                const categoryItems = itemMap.get(data.CategoryName) || [];
                return (
                  <div className='row mb-3' key={data._id}>
                    <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                      {data.CategoryName}
                    </div>
                    <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                    {foodItem.length > 0 ? (
                      categoryItems.length > 0 ? (
                        categoryItems.map(filterItems => (
                          <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                            <Card foodItem={filterItems} options={filterItems.options[0]} />
                          </div>
                        ))
                      ) : null
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
