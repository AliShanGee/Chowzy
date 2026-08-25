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

  // Memoize unique category list and total page count
  const { uniqueCategories, totalPages } = useMemo(() => {
    const categoryNamesSet = new Set();
    const result = [];
    for (let i = 0; i < foodCat.length; i++) {
      const cat = foodCat[i];
      if (cat.CategoryName && !categoryNamesSet.has(cat.CategoryName)) {
        categoryNamesSet.add(cat.CategoryName);
        result.push(cat);
      }
    }
    return {
      uniqueCategories: result,
      totalPages: Math.ceil(result.length / itemsPerPage)
    };
  }, [foodCat, itemsPerPage]);

  // Memoize filtered and deduplicated items map grouped by CategoryName
  const itemMap = useMemo(() => {
    const map = new Map();
    const lowerSearch = search.toLowerCase();

    for (let i = 0; i < foodItem.length; i++) {
      const item = foodItem[i];
      if (item.name && item.CategoryName) {
        if (lowerSearch && !item.name.toLowerCase().includes(lowerSearch)) continue;

        let categoryItemsMap = map.get(item.CategoryName);
        if (!categoryItemsMap) {
          categoryItemsMap = new Map();
          map.set(item.CategoryName, categoryItemsMap);
        }

        if (!categoryItemsMap.has(item.name)) {
          categoryItemsMap.set(item.name, item);
        }
      }
    }
    return map;
  }, [foodItem, search]);

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
        {/* Memoized Category & Item Lists */}
        {(() => {
          if (uniqueCategories.length === 0) return "";

          const currentCategories = uniqueCategories.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          );

          return (
            <>
              {currentCategories.map((data) => {
                const categoryItemsMap = itemMap.get(data.CategoryName);
                const categoryItems = categoryItemsMap ? Array.from(categoryItemsMap.values()) : [];

                return (
                  <div className='row mb-3' key={data._id}>
                    <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                      {data.CategoryName}
                    </div>
                    <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                    {foodItem.length > 0
                      ? categoryItems.map(filterItems => (
                          <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                            <Card foodItem={filterItems} options={filterItems.options[0]} />
                          </div>
                        ))
                      : <div>No Such Data Found</div>}
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
        })()}
        </div>
        <Footer/>
      </div>
    </div>
  )
}
