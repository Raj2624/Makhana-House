'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  BarChart3,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  Edit,
  ClipboardList,
  Tags,
  BookOpen,
  CheckCircle,
  Loader2,
  PlusCircle,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import API from '@/utils/api';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  // States for CRUD data
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '', price: '', compareAtPrice: '', category: 'Makhana',
    image: '', stock: '100', description: '',
    benefits: '', ingredients: '', calories: '140 kcal', protein: '4g', carbs: '21g', fat: '3g', fiber: '3g'
  });
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '0' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', image: '', tags: '', readTime: '4 min read', author: '' });

  const [editingProductId, setEditingProductId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Refresh admin data
  const refreshData = async () => {
    setLoading(true);
    try {
      const analyticRes = await API.get('/analytics');
      setAnalytics(analyticRes.data);

      const prodRes = await API.get('/products');
      setProducts(prodRes.data);

      const orderRes = await API.get('/orders');
      setOrders(orderRes.data);

      const couponRes = await API.get('/coupons');
      setCoupons(couponRes.data);

      const blogRes = await API.get('/blogs');
      setBlogs(blogRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAdmin) {
      refreshData();
    }
  }, [authLoading, isAdmin]);

  // Authorization Route Guard
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-brand-dark" size={32} />
        <p className="text-xs text-brand-sage font-bold tracking-wider uppercase">Verifying Admin clearance...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center space-y-6">
        <div className="flex justify-center text-red-600">
          <ShieldAlert size={64} className="fill-red-50" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-black text-xl text-brand-dark uppercase tracking-wide">Clearance Denied</h2>
          <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">
            You do not have administrative permissions to access this control cabinet. Please log in as an administrator.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/login')}
            className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3.5 px-6 rounded-full font-black tracking-widest text-xs uppercase shadow transition-all duration-300"
          >
            SIGN IN AS ADMIN
          </button>
          <button
            onClick={() => router.push('/')}
            className="border border-brand-sage/20 text-brand-charcoal hover:border-brand-dark py-3.5 px-6 rounded-full font-bold text-xs uppercase transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // --- Products CRUD Actions ---
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        price: Number(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
        category: productForm.category,
        image: productForm.image,
        images: [productForm.image],
        stock: Number(productForm.stock),
        description: productForm.description,
        benefits: productForm.benefits.split('\n').filter(b => b.trim() !== ''),
        ingredients: productForm.ingredients.split(',').map(i => i.trim()).filter(i => i !== ''),
        nutritionFacts: {
          calories: productForm.calories,
          protein: productForm.protein,
          carbs: productForm.carbs,
          fat: productForm.fat,
          fiber: productForm.fiber
        }
      };

      if (editingProductId) {
        await API.put(`/products/${editingProductId}`, payload);
        alert('Product modified successfully!');
      } else {
        await API.post('/products', payload);
        alert('New product created successfully!');
      }

      setEditingProductId(null);
      setProductForm({
        name: '', price: '', compareAtPrice: '', category: 'Makhana',
        image: '', stock: '100', description: '',
        benefits: '', ingredients: '', calories: '140 kcal', protein: '4g', carbs: '21g', fat: '3g', fiber: '3g'
      });
      refreshData();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProductId(prod._id);
    setProductForm({
      name: prod.name,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || '',
      category: prod.category,
      image: prod.image,
      stock: prod.stock,
      description: prod.description,
      benefits: prod.benefits?.join('\n') || '',
      ingredients: prod.ingredients?.join(', ') || '',
      calories: prod.nutritionFacts?.calories || '140 kcal',
      protein: prod.nutritionFacts?.protein || '4g',
      carbs: prod.nutritionFacts?.carbs || '21g',
      fat: prod.nutritionFacts?.fat || '3g',
      fiber: prod.nutritionFacts?.fiber || '3g'
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      await API.delete(`/products/${id}`);
      refreshData();
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  // --- Orders status update ---
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { orderStatus: status });
      refreshData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleUpdateOrderPaymentStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { paymentStatus: status });
      refreshData();
    } catch (err) {
      alert('Failed to update payment status: ' + err.message);
    }
  };

  // --- Coupons CRUD Actions ---
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: couponForm.code.toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minOrderAmount: Number(couponForm.minOrderAmount) || 0
      };
      await API.post('/coupons', payload);
      setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '0' });
      refreshData();
      alert('Promo coupon created successfully!');
    } catch (err) {
      alert('Failed to create coupon: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Delete this coupon code?')) return;
    try {
      await API.delete(`/coupons/${id}`);
      refreshData();
    } catch (err) {
      alert('Failed to delete coupon: ' + err.message);
    }
  };

  // --- Blogs CRUD Actions ---
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: blogForm.title,
        content: blogForm.content,
        image: blogForm.image,
        author: blogForm.author || undefined,
        readTime: blogForm.readTime,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(t => t !== '')
      };
      await API.post('/blogs', payload);
      setBlogForm({ title: '', content: '', image: '', tags: '', readTime: '4 min read', author: '' });
      refreshData();
      alert('Healthy lifestyle article published successfully!');
    } catch (err) {
      alert('Failed to post article: ' + err.message);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await API.delete(`/blogs/${id}`);
      refreshData();
    } catch (err) {
      alert('Failed to delete blog post: ' + err.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-brand-sage/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-brand-dark flex items-center space-x-2">
            <span>Admin Control Cabinet</span>
          </h1>
          <p className="text-[11px] text-brand-sage font-semibold uppercase tracking-wider mt-0.5">Control product CRUD, manage orders, view analytics charts</p>
        </div>
        <button
          onClick={refreshData}
          className="inline-flex self-start sm:self-center items-center space-x-1.5 border border-brand-sage/20 text-brand-dark hover:border-brand-dark px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
        >
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Tabs list switches */}
      <div className="flex space-x-2 overflow-x-auto border-b border-brand-sage/10 pb-1 scrollbar-thin">
        {[
          { id: 'analytics', name: 'Sales Analytics', icon: <BarChart3 size={14} /> },
          { id: 'products', name: 'Product CRUD Catalog', icon: <ShoppingBag size={14} /> },
          { id: 'orders', name: 'Orders Management', icon: <ClipboardList size={14} /> },
          { id: 'coupons', name: 'Promo Coupons', icon: <Tags size={14} /> },
          { id: 'blogs', name: 'Articles Writing', icon: <BookOpen size={14} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? 'border-brand-dark text-brand-dark font-extrabold bg-brand-dark/5'
                : 'border-transparent text-brand-charcoal/40 hover:text-brand-dark'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Main tab display panels */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Loader2 className="animate-spin text-brand-dark" size={24} />
          <p className="text-[11px] text-brand-sage font-bold tracking-widest uppercase">Fetching server registry...</p>
        </div>
      ) : (
        <div className="space-y-10">

          {/* 1. SALES ANALYTICS TAB */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-10">
              {/* Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Sales */}
                <div className="bg-white border border-brand-sage/10 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-charcoal/50 block font-bold uppercase tracking-wider">Gross Sales</span>
                    <span className="text-xl font-black text-brand-dark mt-0.5">₹{analytics.totalSales}</span>
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-white border border-brand-sage/10 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-charcoal/50 block font-bold uppercase tracking-wider">Orders Tracked</span>
                    <span className="text-xl font-black text-brand-dark mt-0.5">{analytics.totalOrders}</span>
                  </div>
                </div>

                {/* Products */}
                <div className="bg-white border border-brand-sage/10 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-cream text-brand-dark flex items-center justify-center">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-charcoal/50 block font-bold uppercase tracking-wider">Products Count</span>
                    <span className="text-xl font-black text-brand-dark mt-0.5">{analytics.productsCount}</span>
                  </div>
                </div>

                {/* Users */}
                <div className="bg-white border border-brand-sage/10 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-charcoal/50 block font-bold uppercase tracking-wider">Active Customers</span>
                    <span className="text-xl font-black text-brand-dark mt-0.5">{analytics.usersCount}</span>
                  </div>
                </div>

              </div>

              {/* Graphical Charts segment simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Monthly Sales chart bar mock */}
                <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-6">
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                    Monthly Revenue Progression (Simulated)
                  </h3>
                  
                  {/* Visual bars */}
                  <div className="h-64 flex items-end justify-between px-4 pt-8">
                    {analytics.monthlySales.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1 space-y-2">
                        <span className="text-[10px] font-black text-brand-dark">₹{item.sales}</span>
                        {/* Dynamic height calculations */}
                        <div 
                          className="w-8 sm:w-12 bg-brand-dark rounded-t-lg hover:bg-brand-gold transition-colors"
                          style={{ height: `${Math.max(10, Math.round((item.sales / analytics.totalSales) * 350))}px` }}
                        />
                        <span className="text-[10px] font-bold text-brand-charcoal/40">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category sales donut summary mock */}
                <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                    Sales Category Shares
                  </h3>

                  <div className="space-y-4 pt-4">
                    {analytics.categoryDistribution.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-brand-dark">
                          <span>{item.name}</span>
                          <span>₹{item.value}</span>
                        </div>
                        {/* Progress line */}
                        <div className="w-full bg-brand-light h-2 rounded-full overflow-hidden border border-brand-sage/5">
                          <div 
                            className="bg-brand-gold h-full"
                            style={{ width: `${Math.round((item.value / analytics.totalSales) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Orders table */}
              <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                  Recent Purchases
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-medium text-brand-charcoal/80 text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-sage/10 text-brand-sage uppercase font-black tracking-wider text-[10px]">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4 text-center">Items Count</th>
                        <th className="py-3 px-4 text-center">Charged Bill</th>
                        <th className="py-3 px-4 text-center">Method</th>
                        <th className="py-3 px-4 text-right">Progress Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentOrders.map((ord) => (
                        <tr key={ord._id} className="border-b border-brand-sage/5 hover:bg-brand-light/40 transition-colors font-semibold">
                          <td className="py-3 px-4 text-brand-dark font-black">{ord._id}</td>
                          <td className="py-3 px-4">{ord.shippingAddress.name}</td>
                          <td className="py-3 px-4 text-center">{ord.items?.reduce((sum, item) => sum + item.quantity, 0)}</td>
                          <td className="py-3 px-4 text-center text-brand-dark font-black">₹{ord.totalAmount}</td>
                          <td className="py-3 px-4 text-center">{ord.paymentMethod}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-inner ${
                              ord.orderStatus === 'Delivered' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-amber-50 text-amber-600 animate-pulse'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 2. PRODUCT CRUD TAB */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Product Add/Edit Form Left */}
              <div className="lg:col-span-1 bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                  {editingProductId ? '✏️ Modify Selected Product' : '➕ Add New Snack Product'}
                </h3>

                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Snack Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Garlic Herb Roasted Makhana"
                      value={productForm.name}
                      onChange={handleProductInputChange}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="180"
                        value={productForm.price}
                        onChange={handleProductInputChange}
                        className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Compare Price (₹)</label>
                      <input
                        type="number"
                        name="compareAtPrice"
                        placeholder="220"
                        value={productForm.compareAtPrice}
                        onChange={handleProductInputChange}
                        className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Category</label>
                      <select
                        name="category"
                        value={productForm.category}
                        onChange={handleProductInputChange}
                        className="w-full text-xs font-bold text-brand-dark px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark cursor-pointer"
                      >
                        <option value="Makhana">Makhana</option>
                        <option value="Seeds">Seeds</option>
                        <option value="Trail Mixes">Trail Mixes</option>
                        <option value="Dry Fruits">Dry Fruits</option>
                        <option value="Protein Snacks">Protein Snacks</option>
                        <option value="Roasted Snacks">Healthy Roasted Snacks</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Stock Inventory</label>
                      <input
                        type="number"
                        name="stock"
                        placeholder="100"
                        value={productForm.stock}
                        onChange={handleProductInputChange}
                        className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Product Cover Image URL</label>
                    <input
                      type="text"
                      name="image"
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.image}
                      onChange={handleProductInputChange}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Nutritional Description</label>
                    <textarea
                      name="description"
                      rows="2"
                      placeholder="Vibrant copywriting about the health benefits..."
                      value={productForm.description}
                      onChange={handleProductInputChange}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark resize-none"
                      required
                    />
                  </div>

                  {/* Bullet inputs */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Benefits (one per line)</label>
                    <textarea
                      name="benefits"
                      rows="2"
                      placeholder="Calcium rich superfood&#10;Low fat and cholesterol"
                      value={productForm.benefits}
                      onChange={handleProductInputChange}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Ingredients (comma-separated)</label>
                    <input
                      type="text"
                      name="ingredients"
                      placeholder="Premium Foxnuts, Ghee, Sea Salt"
                      value={productForm.ingredients}
                      onChange={handleProductInputChange}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                    />
                  </div>

                  {/* Nutrition details */}
                  <div className="grid grid-cols-5 gap-2 border border-brand-sage/10 p-2 rounded-lg bg-brand-cream/20">
                    <div className="space-y-1 text-center">
                      <label className="text-[8px] font-bold block text-brand-dark">Cals</label>
                      <input type="text" name="calories" value={productForm.calories} onChange={handleProductInputChange} className="w-full text-[10px] text-center border-0 bg-white font-semibold rounded p-1" />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[8px] font-bold block text-brand-dark">Prot</label>
                      <input type="text" name="protein" value={productForm.protein} onChange={handleProductInputChange} className="w-full text-[10px] text-center border-0 bg-white font-semibold rounded p-1" />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[8px] font-bold block text-brand-dark">Carbs</label>
                      <input type="text" name="carbs" value={productForm.carbs} onChange={handleProductInputChange} className="w-full text-[10px] text-center border-0 bg-white font-semibold rounded p-1" />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[8px] font-bold block text-brand-dark">Fat</label>
                      <input type="text" name="fat" value={productForm.fat} onChange={handleProductInputChange} className="w-full text-[10px] text-center border-0 bg-white font-semibold rounded p-1" />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[8px] font-bold block text-brand-dark">Fiber</label>
                      <input type="text" name="fiber" value={productForm.fiber} onChange={handleProductInputChange} className="w-full text-[10px] text-center border-0 bg-white font-semibold rounded p-1" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 text-xs">
                    <button
                      type="submit"
                      disabled={savingProduct}
                      className="flex-1 bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3 px-4 rounded-xl font-black tracking-widest uppercase transition-colors"
                    >
                      {savingProduct ? '...' : (editingProductId ? 'UPDATE' : 'SUBMIT PRODUCT')}
                    </button>
                    {editingProductId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProductId(null);
                          setProductForm({
                            name: '', price: '', compareAtPrice: '', category: 'Makhana',
                            image: '', stock: '100', description: '',
                            benefits: '', ingredients: '', calories: '140 kcal', protein: '4g', carbs: '21g', fat: '3g', fiber: '3g'
                          });
                        }}
                        className="border border-brand-sage/20 text-brand-charcoal hover:bg-red-50 hover:text-red-600 px-4 py-3 rounded-xl uppercase font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Products Table Right */}
              <div className="lg:col-span-2 bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                  Snacks Registry ({products.length} Products)
                </h3>

                <div className="overflow-y-auto max-h-[550px] pr-2">
                  <table className="w-full text-xs text-left border-collapse font-medium">
                    <thead>
                      <tr className="border-b border-brand-sage/10 text-brand-sage uppercase font-black tracking-wider text-[9px]">
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3 text-center">Category</th>
                        <th className="py-2.5 px-3 text-center">Price</th>
                        <th className="py-2.5 px-3 text-center">Stock</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod._id} className="border-b border-brand-sage/5 hover:bg-brand-light/35 transition-colors font-semibold">
                          <td className="py-3 px-3 flex items-center space-x-3 max-w-[200px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-brand-sage/5 flex-shrink-0" />
                            <span className="truncate text-brand-dark font-black" title={prod.name}>{prod.name}</span>
                          </td>
                          <td className="py-3 px-3 text-center text-brand-charcoal/70">{prod.category}</td>
                          <td className="py-3 px-3 text-center text-brand-dark font-black">₹{prod.price}</td>
                          <td className="py-3 px-3 text-center text-brand-charcoal/60">{prod.stock} units</td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditProductClick(prod)}
                                className="p-1.5 rounded-lg border border-brand-sage/10 text-brand-charcoal/60 hover:text-brand-dark hover:border-brand-dark hover:bg-brand-light"
                                title="Edit Product"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod._id)}
                                className="p-1.5 rounded-lg border border-brand-sage/10 text-brand-charcoal/40 hover:text-red-600 hover:border-red-150 hover:bg-red-50"
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 3. ORDERS LIST TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-brand-sage/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                Manage Customers Purchases ({orders.length} Records)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-brand-charcoal/80 text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-sage/10 text-brand-sage uppercase font-black tracking-wider text-[9px]">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Items / Qty</th>
                      <th className="py-3 px-4 text-center">Charged</th>
                      <th className="py-3 px-4 text-center">Payment Status</th>
                      <th className="py-3 px-4 text-center">Order Process</th>
                      <th className="py-3 px-4 text-right">Adjust Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id} className="border-b border-brand-sage/5 hover:bg-brand-light/35 transition-colors font-medium">
                        {/* ID */}
                        <td className="py-4 px-4 text-brand-dark font-black">{ord._id}</td>
                        
                        {/* Customer */}
                        <td className="py-4 px-4 leading-normal">
                          <p className="font-black text-brand-dark">{ord.shippingAddress.name}</p>
                          <p className="text-[10px] text-brand-charcoal/50 mt-0.5">{ord.shippingAddress.phone} | {ord.shippingAddress.email}</p>
                          <p className="text-[10px] text-brand-charcoal/60 mt-1 line-clamp-1">{ord.shippingAddress.address}, {ord.shippingAddress.city}</p>
                        </td>

                        {/* Items */}
                        <td className="py-4 px-4">
                          <div className="space-y-1 max-w-[180px] overflow-y-auto max-h-[80px]">
                            {ord.items && ord.items.map((item, idx) => (
                              <p key={idx} className="truncate text-[10px] font-bold text-brand-dark leading-tight">
                                • {item.name} <span className="text-brand-charcoal/40">(x{item.quantity})</span>
                              </p>
                            ))}
                          </div>
                        </td>

                        {/* Charged */}
                        <td className="py-4 px-4 text-center text-brand-dark font-black">₹{ord.totalAmount}</td>

                        {/* Payment */}
                        <td className="py-4 px-4 text-center">
                          <select
                            value={ord.paymentStatus}
                            onChange={(e) => handleUpdateOrderPaymentStatus(ord._id, e.target.value)}
                            className={`text-[10px] font-black uppercase border border-brand-sage/10 rounded-lg px-2 py-1.5 bg-brand-light cursor-pointer focus:outline-none ${
                              ord.paymentStatus === 'Completed' ? 'text-emerald-700 font-extrabold bg-emerald-50' : 'text-amber-700 bg-amber-50'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            ord.orderStatus === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-600 shadow-inner' 
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-red-50 text-red-600 shadow-inner'
                              : 'bg-amber-50 text-amber-600 animate-pulse'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>

                        {/* Action Status buttons */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end space-x-1">
                            {['Shipped', 'Delivered', 'Cancelled'].map((stat) => (
                              <button
                                key={stat}
                                onClick={() => handleUpdateOrderStatus(ord._id, stat)}
                                disabled={ord.orderStatus === stat}
                                className={`px-2 py-1 rounded-lg text-[9px] uppercase font-black border tracking-wider disabled:opacity-40 transition-colors ${
                                  stat === 'Delivered' 
                                    ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' 
                                    : stat === 'Cancelled'
                                    ? 'border-red-200 text-red-500 hover:bg-red-50'
                                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                                }`}
                              >
                                {stat[0]}
                              </button>
                            ))}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. PROMO COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Form left */}
              <div className="lg:col-span-1 bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                  ➕ Add New Promo Code
                </h3>

                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CRUNCH30"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Discount Type</label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                        className="w-full text-xs font-bold text-brand-dark px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none cursor-pointer"
                      >
                        <option value="percentage">Percent (%)</option>
                        <option value="fixed">Fixed Price (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Value</label>
                      <input
                        type="number"
                        placeholder="20"
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Min Cart Purchases (₹)</label>
                    <input
                      type="number"
                      placeholder="499"
                      value={couponForm.minOrderAmount}
                      onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-colors"
                  >
                    CREATE PROMO CODE
                  </button>
                </form>
              </div>

              {/* Coupons List Right */}
              <div className="lg:col-span-2 bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                  Active Coupons Registry
                </h3>

                <div className="overflow-y-auto max-h-[400px]">
                  <table className="w-full text-xs text-left border-collapse font-medium">
                    <thead>
                      <tr className="border-b border-brand-sage/10 text-brand-sage uppercase font-black tracking-wider text-[9px]">
                        <th className="py-2.5 px-3">Promo Code</th>
                        <th className="py-2.5 px-3 text-center">Type</th>
                        <th className="py-2.5 px-3 text-center">Discount Value</th>
                        <th className="py-2.5 px-3 text-center">Min Purchases</th>
                        <th className="py-2.5 px-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((cpn) => (
                        <tr key={cpn._id} className="border-b border-brand-sage/5 hover:bg-brand-light/35 transition-colors font-semibold">
                          <td className="py-3 px-3 text-brand-dark font-black uppercase tracking-wider">{cpn.code}</td>
                          <td className="py-3 px-3 text-center capitalize">{cpn.discountType}</td>
                          <td className="py-3 px-3 text-center text-brand-dark font-black">
                            {cpn.discountType === 'percentage' ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`}
                          </td>
                          <td className="py-3 px-3 text-center">₹{cpn.minOrderAmount}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(cpn._id)}
                              className="p-1.5 text-brand-charcoal/40 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. ARTICLES WRITING TAB */}
          {activeTab === 'blogs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Form left */}
              <div className="lg:col-span-1 bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                  ➕ Write Healthy Lifestyle Article
                </h3>

                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Article Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Nutritious Workouts Desk Snacks"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Author Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Roy"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Read Time</label>
                      <input
                        type="text"
                        placeholder="4 min read"
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                        className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Banner Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Tags (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Makhana, Nutrition, Wellness"
                      value={blogForm.tags}
                      onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-wide text-brand-dark">Article Content</label>
                    <textarea
                      name="content"
                      rows="6"
                      placeholder="Write rich, informative organic snacking paragraphs..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-brand-light border border-brand-sage/15 rounded-lg focus:outline-none focus:border-brand-dark resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-colors"
                  >
                    PUBLISH ARTICLE
                  </button>
                </form>
              </div>

              {/* Blogs list Right */}
              <div className="lg:col-span-2 bg-white border border-brand-sage/10 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-brand-dark border-b border-brand-sage/5 pb-2">
                  Published Health Articles
                </h3>

                <div className="overflow-y-auto max-h-[500px]">
                  <table className="w-full text-xs text-left border-collapse font-medium">
                    <thead>
                      <tr className="border-b border-brand-sage/10 text-brand-sage uppercase font-black tracking-wider text-[9px]">
                        <th className="py-2.5 px-3">Article Title</th>
                        <th className="py-2.5 px-3 text-center">Author</th>
                        <th className="py-2.5 px-3 text-center">Read Time</th>
                        <th className="py-2.5 px-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((b) => (
                        <tr key={b._id} className="border-b border-brand-sage/5 hover:bg-brand-light/35 transition-colors font-semibold">
                          <td className="py-3 px-3 flex items-center space-x-3 max-w-[220px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.image} alt={b.title} className="w-8 h-8 object-cover rounded-lg border border-brand-sage/5 flex-shrink-0" />
                            <span className="truncate text-brand-dark font-black" title={b.title}>{b.title}</span>
                          </td>
                          <td className="py-3 px-3 text-center text-brand-charcoal/70">{b.author.split(',')[0]}</td>
                          <td className="py-3 px-3 text-center">{b.readTime}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteBlog(b._id)}
                              className="p-1.5 text-brand-charcoal/40 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
