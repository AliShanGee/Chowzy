import React, { useEffect, useState } from 'react'
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

  // Memoize unique categories and total pages based only on foodCat to avoid redundant processing
  const { uniqueCategories, totalPages } = React.useMemo(() => {
    const unique = foodCat.filter((cat, index, self) =>
      index === self.findIndex(c => c.CategoryName === cat.CategoryName)
    );
    const total = Math.ceil(unique.length / itemsPerPage);
    return { uniqueCategories: unique, totalPages: total };
  }, [foodCat]);

  // Memoize categories for the current page
  const currentCategories = React.useMemo(() => {
    return uniqueCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [uniqueCategories, currentPage]);

  // Memoize the search-filtered itemMap grouped by category in O(N) complexity
  const itemMap = React.useMemo(() => {
    const map = new Map();

    // Initialize empty list for each category in uniqueCategories to preserve headers
    uniqueCategories.forEach(cat => {
      map.set(cat.CategoryName, []);
    });

    const seen = new Set();
    const searchLower = search.toLowerCase();

    for (let i = 0; i < foodItem.length; i++) {
      const item = foodItem[i];
      if (!item || !item.name) continue;

      // Filter by search query
      if (searchLower && !item.name.toLowerCase().includes(searchLower)) {
        continue;
      }

      // Check uniqueness with composite category + item identifier key (preventing de-duplication omissions)
      const compositeKey = `${item.CategoryName}_${item.name}`;
      if (seen.has(compositeKey)) {
        continue;
      }
      seen.add(compositeKey);

      // Add to list under CategoryName
      const list = map.get(item.CategoryName);
      if (list) {
        list.push(item);
      } else {
        map.set(item.CategoryName, [item]);
      }
    }
    return map;
  }, [foodItem, uniqueCategories, search]);

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
          </div>
        {
          (() => {
            if (foodCat.length === 0) return "";

            return (
              <>
                {currentCategories.map((data) => {
                  const filteredItems = itemMap.get(data.CategoryName) || [];
                  return (
                    <div className='row mb-3' key={data._id}>
                      <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                        {data.CategoryName}
                      </div>
                      <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                      {foodItem.length > 0
                        ? (filteredItems.length > 0
                            ? filteredItems.map(filterItems => {
                                return (
                                  <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                                    <Card foodItem={filterItems} options={filterItems.options[0]} />
                                  </div>
                                );
                              })
                            : null // Keeps row empty but preserves category header, matching existing layout logic
                          )
                        : <div>No Such Data Found</div>
                      }
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
