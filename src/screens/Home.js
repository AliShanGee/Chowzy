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

  // Bolt Optimization: Memoize category deduplication and item grouping to avoid O(N^2) operations during render
  const processedData = useMemo(() => {
    if (foodCat.length === 0) return { uniqueCategories: [], groupedItems: {}, totalPages: 0 };

    // 1. Deduplicate categories once (O(M))
    const uniqueCategories = [];
    const seenCats = new Set();
    for (const cat of foodCat) {
      if (cat.CategoryName && !seenCats.has(cat.CategoryName)) {
        uniqueCategories.push(cat);
        seenCats.add(cat.CategoryName);
      }
    }

    // 2. Pre-group and deduplicate items once (O(N))
    const groupedItems = {};
    for (const item of foodItem) {
      if (!item.name) continue;
      const catName = item.CategoryName;
      if (!groupedItems[catName]) {
        groupedItems[catName] = new Map();
      }
      // Deduplicate by name using Map for O(1) lookups
      if (!groupedItems[catName].has(item.name)) {
        groupedItems[catName].set(item.name, item);
      }
    }

    const totalPages = Math.ceil(uniqueCategories.length / itemsPerPage);

    return { uniqueCategories, groupedItems, totalPages };
  }, [foodCat, foodItem, itemsPerPage]);

  const currentCategories = useMemo(() => {
    return processedData.uniqueCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [processedData.uniqueCategories, currentPage, itemsPerPage]);

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
          processedData.uniqueCategories.length > 0 ? (
            <>
              {currentCategories.map((data) => {
                const itemsInCategory = processedData.groupedItems[data.CategoryName]
                  ? Array.from(processedData.groupedItems[data.CategoryName].values())
                  : [];

                const filteredItems = search === ""
                  ? itemsInCategory
                  : itemsInCategory.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

                return (
                  <div className='row mb-3' key={data._id}>
                    <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                      {data.CategoryName}
                    </div>
                    <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                    {filteredItems.length > 0 ? (
                      filteredItems.map(filterItems => (
                        <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                          <Card foodItem={filterItems} options={filterItems.options[0]} />
                        </div>
                      ))
                    ) : (
                      <div className="ms-3" style={{ color: theme === 'dark' ? '#adb5bd' : '#6c757d' }}>
                        No items found in this category.
                      </div>
                    )}
                  </div>
                );
              })}
              {processedData.totalPages > 1 && (
                <Page
                  totalPages={processedData.totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : ""
        }
        </div>
        <Footer/>
      </div>
    </div>
  )
}
