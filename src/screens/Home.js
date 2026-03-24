import React, { useEffect, useState } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../components/Footer'
import Card from '../components/Card'
import Lottie from 'lottie-react'
import homeBg from '../animations/YDT9GjiZWg.json'

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat,setFoodCat] = useState([]);
  const [foodItem,setFoodItem] = useState([]);

  const loadData = async ()=>{
    let response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/foodData`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    response = await response.json();
    setFoodItem(response[0]);
    setFoodCat(response[1]);
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
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundColor: '#000' }}>
        <Lottie
          animationData={homeBg}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice', progressiveLoad: true, clearCanvas: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          {/* Search Bar */}
          <div className="row mb-2 mt-2" data-aos="fade-down">
            <div className="col-12 text-center mb-3">
              <h1 style={{ 
                color: '#fff', 
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                fontWeight: 'bold'
              }}>Explore Amazing Foods</h1>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-center">
                <div className="input-group shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for food items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '3px solid #007bff',
                      borderRadius: '30px 0 0 30px',
                      padding: '15px 25px',
                      fontSize: '18px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      // Search functionality is already implemented via onChange
                      console.log('Searching for:', search);
                    }}
                    style={{
                      borderRadius: '0 30px 30px 0',
                      padding: '15px 30px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      background: 'linear-gradient(45deg, #007bff, #0056b3)'
                    }}
                  >
                    🔍 Search
                  </button>
                </div>
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
          foodCat.length > 0
          ? foodCat.filter((cat, index, self) => 
              index === self.findIndex(c => c.CategoryName === cat.CategoryName)
            ).map((data)=>{
            return ( <div className='row mb-3'>
              <div key={data._id} className="fs-3 m-3">
                {data.CategoryName}
              </div>
              <hr />
              {foodItem.length > 0
              ? foodItem.filter((item) => item.name && (item.CategoryName === data.CategoryName) && (item.name.toLowerCase().includes(search.toLowerCase()))) 
                .reduce((unique, item) => {
                  return unique.some(i => i.name === item.name) ? unique : [...unique, item];
                }, [])
                .map(filterItems => {
                  return (
                    <div key={filterItems._id} className='col-12 col-md-6 col-lg-3 mb-3'>
                      <Card foodItem={filterItems} options={filterItems.options[0]} />
                    </div>
                  )
                })
              : <div>No Such Data Found</div>}
              </div>
            )
          })
          : ""
        }
        </div>
        <Footer/>
      </div>
    </div>
  )
}
