import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Social Media Icons
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.13 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;
const ADMIN_EMAIL = 'admin@proteinstore.com';
const ADMIN_PASSWORD = 'admin123';
const OWNER_WHATSAPP = '923058666797';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loginMode, setLoginMode] = useState('add');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Modal states
  const [zoomProduct, setZoomProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState('');
  
  // Admin status
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Server wake status
  const [serverReady, setServerReady] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Dropdown and sections
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('products');
  
  // ✅ FIXED: Reviews from backend
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  
  // ✅ FIXED: Sales data from backend
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalOrders: 0,
    orders: []
  });

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'protein', name: 'Protein' },
    { id: 'pre-workout', name: 'Pre-Workout' },
    { id: 'bcaa', name: 'BCAA' },
    { id: 'weight-gainer', name: 'Weight Gainer' },
    { id: 'fat-burner', name: 'Fat Burner' },
    { id: 'performance', name: 'Performance' }
  ];

  // Initial load
  useEffect(() => {
    checkServerAndLoad();
    const adminStatus = localStorage.getItem("isAdminLoggedIn");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
    const timer = setTimeout(() => setIsFirstLoad(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Load products when server ready or category changes
  useEffect(() => {
    if (serverReady) {
      fetchProducts();
      fetchReviews();
      fetchSalesData();
    }
  }, [activeCategory, serverReady]);

  // ✅ Check if server is awake
  const checkServerAndLoad = async () => {
    try {
      setLoading(true);
      const pingResponse = await fetch(`${API_BASE_URL}/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      if (pingResponse.ok) {
        setServerReady(true);
        setLoading(false);
      } else {
        throw new Error('Server sleeping');
      }
    } catch (error) {
      wakeUpServer();
    }
  };

  // ✅ Wake up server
  const wakeUpServer = async () => {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        await fetch(`${API_BASE_URL}/ping`, {
          method: 'GET',
          signal: AbortSignal.timeout(8000)
        });
        
        setServerReady(true);
        setLoading(false);
        return;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    setLoading(false);
  };

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      let url = `${API_URL}/products`;
      if (activeCategory !== 'all') url += `?category=${activeCategory}`;

      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.success && data.products) {
        setProducts(data.products);
      } else if (data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  // ✅ FIXED: Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // ✅ FIXED: Fetch sales data from backend
  const fetchSalesData = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      if (data.success) {
        setSalesData({
          totalSales: data.stats.totalSales,
          totalRevenue: data.stats.totalRevenue,
          pendingOrders: data.stats.pendingOrders,
          totalOrders: data.stats.totalOrders,
          orders: data.orders
        });
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      setIsAdmin(true);
      setShowLogin(false);
      if (loginMode === 'add') {
        setShowAddProduct(true);
      } else {
        setShowAdminPanel(true);
      }
    } else {
      alert('Invalid credentials!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAdmin(false);
    setShowAdminPanel(false);
    setShowAddProduct(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a photo!');
      return;
    }

    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('category', e.target.category.value);
    formData.append('description', e.target.description.value);
    formData.append('originalPrice', e.target.originalPrice.value);
    formData.append('discountedPrice', e.target.discountedPrice.value);
    formData.append('whatsappNumber', e.target.whatsappNumber.value);
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('Product added successfully!');
        setShowAddProduct(false);
        setSelectedFile(null);
        setPreviewUrl('');
        e.target.reset();
        fetchProducts();
      } else {
        alert(data.message || 'Error adding product');
      }
    } catch (error) {
      alert('Network error!');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editProduct) return;

    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('category', e.target.category.value);
    formData.append('description', e.target.description.value);
    formData.append('originalPrice', e.target.originalPrice.value);
    formData.append('discountedPrice', e.target.discountedPrice.value);
    formData.append('whatsappNumber', e.target.whatsappNumber.value);
    
    if (editFile) {
      formData.append('image', editFile);
    }

    try {
      const response = await fetch(`${API_URL}/products/${editProduct._id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert('Product updated successfully!');
        setEditProduct(null);
        setEditFile(null);
        setEditPreviewUrl('');
        fetchProducts();
      } else {
        alert(data.message || 'Error updating product');
      }
    } catch (error) {
      alert('Network error!');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  // ✅ FIXED: Submit review to backend
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReview.name,
          rating: newReview.rating,
          text: newReview.text,
          date: new Date()
        })
      });
      const data = await response.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setNewReview({ name: '', rating: 5, text: '' });
        setShowReviewForm(false);
        alert('Thank you for your review!');
      }
    } catch (error) {
      alert('Error submitting review. Please try again.');
    }
  };

  // ✅ FIXED: Track order when customer clicks Order
  const trackOrder = async (product) => {
    try {
      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          productPrice: product.discountedPrice,
          productId: product._id,
          status: 'pending'
        })
      });
      // Refresh sales data if admin
      if (isAdmin) {
        fetchSalesData();
      }
    } catch (error) {
      console.error('Error tracking order:', error);
    }
  };

  const handleEditClick = (product, fromZoom = false) => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isLoggedIn === "true") {
      if (fromZoom) setZoomProduct(null);
      setEditProduct(product);
    } else {
      setLoginMode('edit');
      setShowLogin(true);
    }
  };

  const handleAddClick = () => {
    if (isAdmin) {
      setShowAddProduct(true);
    } else {
      setLoginMode('add');
      setShowLogin(true);
    }
  };

  const handleManageClick = () => {
    if (isAdmin) {
      setShowAdminPanel(true);
    } else {
      setLoginMode('view');
      setShowLogin(true);
    }
  };

  const generateWhatsAppMessage = (product) => {
    const savings = product.originalPrice - product.discountedPrice;
    const message = `*Bodyblast Sports & Nutrition - New Order*

*Product:* ${product.name}
*Category:* ${product.category.toUpperCase()}
*Original Price:* Rs. ${product.originalPrice}
*Discounted Price:* Rs. ${product.discountedPrice}
*You Save:* Rs. ${savings}
*Description:* ${product.description}

Please confirm availability.`;
    return encodeURIComponent(message);
  };

  const isImageBroken = (imageUrl) => {
    return !imageUrl || imageUrl.includes('placeholder') || imageUrl === '';
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < rating} />
    ));
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // First load screen
  if (loading && isFirstLoad) {
    return (
      <div className="app">
        <div className="first-load-screen">
          <div className="logo-pulse">💪</div>
          <h1>Bodyblast</h1>
          <p>Starting server...</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="sub-text">Free hosting - takes 20-30 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header-classy">
        <div className="header-top">
          <div className="brand-section">
            <span className="logo-icon">💪</span>
            <div className="brand-text">
              <h1>Bodyblast</h1>
              <span>Premium Supplements</span>
            </div>
          </div>
          
          <div className="dropdown-container">
            <button 
              className="dropdown-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Explore <ChevronDownIcon />
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => { setActiveSection('products'); setShowDropdown(false); }}>
                  🛍️ Products
                </button>
                <button onClick={() => { setActiveSection('reviews'); setShowDropdown(false); }}>
                  ⭐ Reviews
                </button>
                {isAdmin && (
                  <button onClick={() => { setActiveSection('sales'); setShowDropdown(false); }}>
                    📊 Sales Stats
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar - ✅ FIXED: Dynamic from backend */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{salesData.totalSales}</span>
            <span className="stat-label">Sales</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{salesData.totalOrders}</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">⭐ {averageRating}</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </header>

      {/* Admin Buttons */}
      <div className="admin-section-classy">
        <button className="btn-classy btn-primary" onClick={handleAddClick}>
          ➕ Add Product
        </button>
        <button className="btn-classy btn-secondary" onClick={handleManageClick}>
          ⚙️ Manage
        </button>
        {isAdmin && (
          <button className="btn-classy btn-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        )}
      </div>

      {/* Main Content */}
      {activeSection === 'products' && (
        <>
          <div className="category-tabs-classy">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`tab-classy ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="products-grid-classy">
            {products.length === 0 ? (
              <div className="empty-state">
                <p>No products found</p>
                {isAdmin && (
                  <button className="btn-classy btn-primary" onClick={handleAddClick}>
                    Add First Product
                  </button>
                )}
              </div>
            ) : (
              products.map(product => {
                const imageUrl = product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image || ''}`;
                const brokenImage = isImageBroken(imageUrl);

                return (
                  <div key={product._id} className="product-card-classy">
                    <div className="product-image-wrap" onClick={() => setZoomProduct(product)}>
                      <img 
                        src={imageUrl} 
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                      />
                      <div className="discount-tag">
                        -{Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}%
                      </div>
                      {brokenImage && isAdmin && (
                        <div className="broken-overlay" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleEditClick(product)}>📷 Add Photo</button>
                        </div>
                      )}
                    </div>

                    <div className="product-info-classy">
                      <span className="category-tag">{product.category}</span>
                      <h3 onClick={() => setZoomProduct(product)}>{product.name}</h3>
                      <div className="price-wrap">
                        <span className="price-current">Rs. {product.discountedPrice}</span>
                        <span className="price-old">Rs. {product.originalPrice}</span>
                      </div>
                      <a 
                        href={`https://wa.me/${product.whatsappNumber || OWNER_WHATSAPP}?text=${generateWhatsAppMessage(product)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp"
                        onClick={() => trackOrder(product)}
                      >
                        <WhatsAppIcon /> Order Now
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ✅ FIXED: Reviews from backend */}
      {activeSection === 'reviews' && (
        <div className="reviews-section">
          <h2>⭐ Customer Reviews ({reviews.length})</h2>
          <div className="reviews-grid">
            {reviews.length === 0 ? (
              <p style={{color: 'white', textAlign: 'center'}}>No reviews yet. Be the first!</p>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{review.name}</span>
                    <div className="review-stars">{renderStars(review.rating)}</div>
                  </div>
                  <p className="review-text">"{review.text}"</p>
                  <span className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <button 
            className="btn-classy btn-primary"
            onClick={() => setShowReviewForm(true)}
            style={{marginTop: '30px'}}
          >
            ✍️ Write a Review
          </button>
        </div>
      )}

      {/* ✅ FIXED: Sales from backend */}
      {activeSection === 'sales' && isAdmin && (
        <div className="sales-section">
          <h2>📊 Sales Dashboard</h2>
          <div className="sales-cards">
            <div className="sales-card">
              <h3>Total Sales</h3>
              <p className="big-number">{salesData.totalSales}</p>
            </div>
            <div className="sales-card">
              <h3>Total Orders</h3>
              <p className="big-number">{salesData.totalOrders}</p>
            </div>
            <div className="sales-card">
              <h3>Pending Orders</h3>
              <p className="big-number">{salesData.pendingOrders}</p>
            </div>
            <div className="sales-card">
              <h3>Total Revenue</h3>
              <p className="big-number">Rs. {salesData.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Recent Orders Table */}
          <div style={{marginTop: '40px', background: 'white', borderRadius: '16px', padding: '25px'}}>
            <h3 style={{marginBottom: '20px', color: '#0f172a'}}>Recent Orders</h3>
            {salesData.orders.length === 0 ? (
              <p style={{color: '#64748b'}}>No orders yet</p>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #e2e8f0'}}>
                    <th style={{textAlign: 'left', padding: '10px', color: '#64748b'}}>Product</th>
                    <th style={{textAlign: 'left', padding: '10px', color: '#64748b'}}>Price</th>
                    <th style={{textAlign: 'left', padding: '10px', color: '#64748b'}}>Status</th>
                    <th style={{textAlign: 'left', padding: '10px', color: '#64748b'}}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.orders.slice(0, 10).map(order => (
                    <tr key={order._id} style={{borderBottom: '1px solid #e2e8f0'}}>
                      <td style={{padding: '10px'}}>{order.productName}</td>
                      <td style={{padding: '10px'}}>Rs. {order.productPrice}</td>
                      <td style={{padding: '10px'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: order.status === 'completed' ? '#dcfce7' : 
                                    order.status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: order.status === 'completed' ? '#166534' : 
                                 order.status === 'pending' ? '#92400e' : '#991b1b'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{padding: '10px', fontSize: '0.85rem', color: '#64748b'}}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-classy">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Bodyblast</h3>
            <p>Premium Sports & Nutrition</p>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/share/1DwCUHAMrU/" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://www.instagram.com/invites/contact/?igsh=ic62sdtkl4e7&utm_content=2jqjmkz" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
            <a href={`https://wa.me/${OWNER_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
        <p className="copyright">© 2024 Bodyblast. All rights reserved.</p>
      </footer>

      {/* Zoom Modal */}
      {zoomProduct && (
        <div className="modal-overlay-classy" onClick={() => setZoomProduct(null)}>
          <div className="modal-classy modal-zoom" onClick={e => e.stopPropagation()}>
            <button className="close-btn-classy" onClick={() => setZoomProduct(null)}>×</button>
            
            <div className="zoom-layout">
              <div className="zoom-image-section">
                <img 
                  src={zoomProduct.image?.startsWith('http') ? zoomProduct.image : `${API_BASE_URL}${zoomProduct.image || ''}`} 
                  alt={zoomProduct.name}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
                />
              </div>
              
              <div className="zoom-info-section">
                <span className="category-pill">{zoomProduct.category}</span>
                <h2>{zoomProduct.name}</h2>
                <p className="description">{zoomProduct.description}</p>
                
                <div className="price-box">
                  <div className="price-row">
                    <span className="price-big">Rs. {zoomProduct.discountedPrice}</span>
                    <span className="price-strike">Rs. {zoomProduct.originalPrice}</span>
                  </div>
                  <p className="savings">💰 You save Rs. {zoomProduct.originalPrice - zoomProduct.discountedPrice}</p>
                </div>

                <div className="zoom-actions-classy">
                  <a 
                    href={`https://wa.me/${zoomProduct.whatsappNumber || OWNER_WHATSAPP}?text=${generateWhatsAppMessage(zoomProduct)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-classy btn-whatsapp-lg"
                    onClick={() => trackOrder(zoomProduct)}
                  >
                    <WhatsAppIcon /> Order on WhatsApp
                  </a>
                  
                  {isAdmin && (
                    <button 
                      className="btn-classy btn-edit-lg"
                      onClick={() => handleEditClick(zoomProduct, true)}
                    >
                      ✏️ Edit Product
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="modal-overlay-classy" onClick={() => setShowReviewForm(false)}>
          <div className="modal-classy" onClick={e => e.stopPropagation()}>
            <button className="close-btn-classy" onClick={() => setShowReviewForm(false)}>×</button>
            <h2>Write a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group-classy">
                <label>Your Name</label>
                <input 
                  type="text" 
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group-classy">
                <label>Rating</label>
                <select 
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                >
                  {[5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} Stars</option>
                  ))}
                </select>
              </div>
              <div className="form-group-classy">
                <label>Your Review</label>
                <textarea 
                  value={newReview.text}
                  onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                  required
                  rows="4"
                />
              </div>
              <button type="submit" className="btn-classy btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && isAdmin && (
        <div className="modal-overlay-classy" onClick={() => setEditProduct(null)}>
          <div className="modal-classy modal-large" onClick={e => e.stopPropagation()}>
            <button className="close-btn-classy" onClick={() => setEditProduct(null)}>×</button>
            <h2>✏️ Edit Product</h2>
            <form onSubmit={handleEditProduct}>
              <div className="form-row-classy">
                <div className="form-group-classy">
                  <label>Name</label>
                  <input type="text" name="name" defaultValue={editProduct.name} required />
                </div>
                <div className="form-group-classy">
                  <label>Category</label>
                  <select name="category" defaultValue={editProduct.category} required>
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group-classy">
                <label>Description</label>
                <textarea name="description" defaultValue={editProduct.description} required rows="3" />
              </div>
              <div className="form-row-classy">
                <div className="form-group-classy">
                  <label>Original Price</label>
                  <input type="number" name="originalPrice" defaultValue={editProduct.originalPrice} required />
                </div>
                <div className="form-group-classy">
                  <label>Discounted Price</label>
                  <input type="number" name="discountedPrice" defaultValue={editProduct.discountedPrice} required />
                </div>
              </div>
              <div className="form-group-classy">
                <label>Photo</label>
                <div className="file-inputs-classy">
                  <label className="btn-file">
                    📁 Gallery
                    <input type="file" accept="image/*" onChange={handleEditFileSelect} hidden />
                  </label>
                  <label className="btn-file">
                    📷 Camera
                    <input type="file" accept="image/*" capture="environment" onChange={handleEditFileSelect} hidden />
                  </label>
                </div>
                {editPreviewUrl && <img src={editPreviewUrl} alt="Preview" className="preview-img" />}
              </div>
              <div className="form-actions-classy">
                <button type="button" className="btn-classy btn-secondary" onClick={() => setEditProduct(null)}>Cancel</button>
                <button type="submit" className="btn-classy btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal - ✅ NO PLACEHOLDER */}
      {showLogin && (
        <div className="modal-overlay-classy" onClick={() => setShowLogin(false)}>
          <div className="modal-classy" onClick={e => e.stopPropagation()}>
            <button className="close-btn-classy" onClick={() => setShowLogin(false)}>×</button>
            <h2>🔐 Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group-classy">
                <label>Email</label>
                {/* ✅ NO PLACEHOLDER */}
                <input type="email" name="email" required />
              </div>
              <div className="form-group-classy">
                <label>Password</label>
                {/* ✅ NO PLACEHOLDER */}
                <input type="password" name="password" required />
              </div>
              <button type="submit" className="btn-classy btn-primary">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && isAdmin && (
        <div className="modal-overlay-classy" onClick={() => setShowAddProduct(false)}>
          <div className="modal-classy modal-large" onClick={e => e.stopPropagation()}>
            <button className="close-btn-classy" onClick={() => setShowAddProduct(false)}>×</button>
            <h2>➕ Add Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-row-classy">
                <div className="form-group-classy">
                  <label>Name</label>
                  <input type="text" name="name" placeholder="e.g. Gold Standard Whey" required />
                </div>
                <div className="form-group-classy">
                  <label>Category</label>
                  <select name="category" required>
                    <option value="">Select</option>
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group-classy">
                <label>Description</label>
                <textarea name="description" placeholder="Product details..." required rows="3" />
              </div>
              <div className="form-row-classy">
                <div className="form-group-classy">
                  <label>Original Price</label>
                  <input type="number" name="originalPrice" placeholder="5000" required />
                </div>
                <div className="form-group-classy">
                  <label>Discounted Price</label>
                  <input type="number" name="discountedPrice" placeholder="4000" required />
                </div>
              </div>
              <div className="form-group-classy">
                <label>Photo</label>
                <div className="file-inputs-classy">
                  <label className="btn-file">
                    📁 Gallery
                    <input type="file" accept="image/*" onChange={handleFileSelect} hidden />
                  </label>
                  <label className="btn-file">
                    📷 Camera
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileSelect} hidden />
                  </label>
                </div>
                {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}
              </div>
              <button type="submit" className="btn-classy btn-primary">Add Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && isAdmin && (
        <div className="modal-overlay-classy" onClick={() => setShowAdminPanel(false)}>
          <div className="modal-classy modal-xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Manage Products</h2>
              <button className="btn-classy btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            <table className="admin-table-classy">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const imageUrl = product.image?.startsWith('http') ? product.image : `${API_BASE_URL}${product.image || ''}`;
                  return (
                    <tr key={product._id}>
                      <td><img src={imageUrl} alt="" className="admin-thumb" onError={(e) => e.target.src = 'https://via.placeholder.com/50?text=No+Image'} /></td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>Rs. {product.discountedPrice}</td>
                      <td>
                        <button className="btn-classy btn-warning" onClick={() => { setShowAdminPanel(false); setEditProduct(product); }}>Edit</button>
                        <button className="btn-classy btn-danger" onClick={() => deleteProduct(product._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;