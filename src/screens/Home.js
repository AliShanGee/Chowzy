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

  // 1. Extract unique categories in O(C) complexity using Set and memoize them
  const uniqueCategories = useMemo(() => {
    const seen = new Set();
    return foodCat.filter((cat) => {
      if (!cat.CategoryName || seen.has(cat.CategoryName)) return false;
      seen.add(cat.CategoryName);
      return true;
    });
  }, [foodCat]);

  // 2. Memoize total pages based on unique categories length
  const totalPages = useMemo(() => {
    return Math.ceil(uniqueCategories.length / itemsPerPage);
  }, [uniqueCategories, itemsPerPage]);

  // 3. Memoize current page's active categories
  const currentCategories = useMemo(() => {
    return uniqueCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [uniqueCategories, currentPage, itemsPerPage]);

  // 4. Group, filter, and deduplicate food items for only the current categories in a single O(N) pass
  const categoryItemsMap = useMemo(() => {
    const map = new Map();
    if (!foodItem || foodItem.length === 0) return map;

    // Set of active category names for O(1) checks
    const activeCategoryNames = new Set(currentCategories.map(cat => cat.CategoryName));
    const lowerSearch = search.toLowerCase();
    const seenNames = new Set();

    for (const item of foodItem) {
      if (!item.name || !activeCategoryNames.has(item.CategoryName)) continue;

      // Filter by search query
      if (lowerSearch && !item.name.toLowerCase().includes(lowerSearch)) continue;

      // Deduplicate items with the same name within the same category
      const dupKey = `${item.CategoryName}_${item.name}`;
      if (seenNames.has(dupKey)) continue;
      seenNames.add(dupKey);

      if (!map.has(item.CategoryName)) {
        map.set(item.CategoryName, []);
      }
      map.get(item.CategoryName).push(item);
    }
    return map;
  }, [foodItem, currentCategories, search]);

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
          foodCat.length > 0 && (
            <>
              {currentCategories.map((data) => {
                const items = categoryItemsMap.get(data.CategoryName) || [];
                return (
                  <div className='row mb-3' key={data._id}>
                    <div className="fs-3 m-3 fw-bold" style={{ color: theme === 'dark' ? '#fff' : '#1a1a1a', transition: 'color 0.3s ease' }}>
                      {data.CategoryName}
                    </div>
                    <hr className={theme === 'dark' ? 'bg-light' : 'bg-dark'} style={{ opacity: 0.1, margin: '0 1rem' }} />
                    {foodItem.length > 0 ? (
                      items.map(filterItems => (
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
          )
        }
        </div>
        <Footer/>
      </div>
    </div>
  )
}
