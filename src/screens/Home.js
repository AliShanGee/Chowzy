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

  // Performance Optimization: Deduplicate categories using useMemo
  const uniqueCategories = useMemo(() => {
    return foodCat.filter((cat, index, self) =>
      index === self.findIndex(c => c.CategoryName === cat.CategoryName)
    );
  }, [foodCat]);

  // Performance Optimization: Group and deduplicate food items by category in O(N) time
  // This replaces the O(N*M) filtering inside the render loop
  const groupedItems = useMemo(() => {
    const searchLower = search.toLowerCase();
    const grouped = new Map();

    foodItem.forEach(item => {
      if (item.name && item.name.toLowerCase().includes(searchLower)) {
        if (!grouped.has(item.CategoryName)) {
          grouped.set(item.CategoryName, new Map()); // Use nested Map for O(1) deduplication by name
        }
        const catMap = grouped.get(item.CategoryName);
        if (!catMap.has(item.name)) {
          catMap.set(item.name, item);
        }
      }
    });

    // Convert nested Maps to Arrays for easier rendering
    const finalGrouped = new Map();
    grouped.forEach((itemsMap, category) => {
      finalGrouped.set(category, Array.from(itemsMap.values()));
    });
    return finalGrouped;
  }, [foodItem, search]);

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
          (() => {
            if (uniqueCategories.length === 0) return "";
            
            const totalPages = Math.ceil(uniqueCategories.length / itemsPerPage);
            const currentCategories = uniqueCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            return (
              <>
                {currentCategories.map((data) => {
                  const itemsInCat = groupedItems.get(data.CategoryName) || [];
                  return (
                    <div className='row mb-3' key={data._id}>
                      <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                        {data.CategoryName}
                      </div>
                      <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
              {itemsInCat.length > 0
              ? itemsInCat.map(filterItems => {
                  return (
                    <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                      <Card foodItem={filterItems} options={filterItems.options[0]} />
                    </div>
                  )
                })
              : <div className="ms-3">No Such Data Found</div>}
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
          })()
        }
        </div>
        <Footer/>
      </div>
    </div>
  )
}
