'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, User, Calendar, Tag, ChevronRight } from 'lucide-react';
import API from '@/utils/api';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await API.get('/blogs');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load blog posts:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-dark"></div>
        <p className="text-xs text-brand-sage font-bold tracking-wider uppercase">Loading health stories...</p>
      </div>
    );
  }

  // If a specific article is selected for reading, render detailed view!
  if (selectedPost) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
        
        {/* Back Button */}
        <button
          onClick={() => {
            setSelectedPost(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-1.5 text-xs font-bold text-brand-dark hover:text-brand-gold transition-colors"
        >
          <ArrowLeft size={14} />
          <span>BACK TO HEALTH STORIES</span>
        </button>

        {/* Big Banner Cover */}
        <div className="relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden border border-brand-sage/10 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Meta tags details row */}
        <div className="flex flex-wrap gap-4 text-xs font-bold text-brand-charcoal/50 pb-4 border-b border-brand-sage/10 items-center">
          <div className="flex items-center space-x-1">
            <User size={13} className="text-brand-sage" />
            <span>By {selectedPost.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={13} className="text-brand-sage" />
            <span>{selectedPost.readTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={13} className="text-brand-sage" />
            <span>{formatDate(selectedPost.createdAt)}</span>
          </div>
          {selectedPost.tags && selectedPost.tags.map((t, idx) => (
            <span key={idx} className="bg-brand-cream text-brand-dark px-2.5 py-0.5 rounded-full text-[10px] border border-brand-sage/5 flex items-center space-x-1">
              <Tag size={9} />
              <span>{t}</span>
            </span>
          ))}
        </div>

        {/* Title & Content */}
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-black font-display text-brand-dark leading-tight">
            {selectedPost.title}
          </h1>

          {/* Render multiline format content */}
          <div className="text-sm sm:text-base text-brand-charcoal/80 leading-relaxed font-light space-y-6">
            {selectedPost.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        <hr className="border-brand-sage/10 pt-4" />

        {/* Article footer subscription promotion */}
        <div className="bg-brand-cream/30 p-8 rounded-3xl border border-brand-sage/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-md text-center sm:text-left">
            <h4 className="font-display font-bold text-sm text-brand-dark uppercase tracking-wider">Enjoyed this health read?</h4>
            <p className="text-xs text-brand-charcoal/60 leading-normal font-light">Join the Crunch Club to receive organic snack digests, recipes, and special promo codes directly in your inbox!</p>
          </div>
          <a
            href="/#newsletter"
            onClick={() => setSelectedPost(null)}
            className="bg-brand-dark text-brand-light hover:bg-brand-gold hover:text-brand-dark px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase shadow transition-all duration-300"
          >
            SUBSCRIBE TO DIGEST
          </a>
        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase font-black tracking-widest text-brand-gold">
          Makhana Wellness Blog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-brand-dark">
          Healthy Lifestyle Stories
        </h1>
        <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light leading-relaxed">
          Unlock the secrets of holistic nutrition, ancient superfoods science, clean workspace snacking habits, and organic healthy recipes.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center text-brand-sage font-bold uppercase tracking-wider">
          🍂 No articles loaded yet. Fresh batches coming soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div 
              key={post._id}
              onClick={() => {
                setSelectedPost(post);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group bg-white border border-brand-sage/10 rounded-2xl overflow-hidden shadow-sm hover:border-brand-sage/35 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-cream/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-4 text-[10px] font-bold text-brand-charcoal/40">
                    <span className="flex items-center space-x-1">
                      <Clock size={11} />
                      <span>{post.readTime}</span>
                    </span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-brand-dark leading-tight line-clamp-2 group-hover:text-brand-gold transition-colors">
                    {post.title}
                  </h3>

                  {/* Summary preview */}
                  <p className="text-xs text-brand-charcoal/60 leading-relaxed line-clamp-3 font-light">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="px-6 pb-6 pt-4 border-t border-brand-sage/5 flex items-center justify-between text-xs font-bold text-brand-dark">
                <span className="text-[10px] text-brand-sage uppercase font-medium">By {post.author.split(',')[0]}</span>
                <span className="flex items-center space-x-0.5 hover:text-brand-gold transition-colors">
                  <span>Read Story</span>
                  <ChevronRight size={13} />
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default BlogPage;
