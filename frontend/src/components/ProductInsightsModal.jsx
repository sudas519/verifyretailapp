import React, { useState, useEffect } from "react";
import { getProducts, getProductInsights } from "../api";

// Product Insights Modal Component
// Fetches AI-powered insights from backend API

function ProductInsightsModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (productId) {
      loadProductAndInsights();
    }
  }, [productId]);

  async function loadProductAndInsights() {
    setLoading(true);
    try {
      // Fetch product details
      const products = await getProducts();
      const foundProduct = products.find(p => p.id === parseInt(productId));
      
      if (!foundProduct) {
        onClose();
        return;
      }
      
      setProduct(foundProduct);
      
      // Fetch AI insights from backend API
      const insightsData = await getProductInsights(productId);
      setInsights(insightsData);
      setLoading(false);
      
    } catch (error) {
      console.error("Error loading product insights:", error);
      setLoading(false);
      // Show error state or fallback
      setInsights({
        summary: "Unable to load AI insights at this time. Please try again later.",
        keyFeatures: [],
        useCases: [],
        technicalSpecs: {},
        customerSentiment: { positive: 0, neutral: 0, negative: 0 },
        recommendations: []
      });
    }
  }

  if (!productId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {loading ? (
          <div className="modal-loading">
            <div className="loading-spinner"></div>
            <p>Loading AI insights...</p>
          </div>
        ) : product && insights ? (
          insights.status === "generating" ? (
            // Show generating state with animation
            <div className="modal-body">
              <div className="insights-generating">
                <div className="generating-animation">
                  <div className="spinner-large"></div>
                  <div className="sparkles">✨</div>
                </div>
                <h3 className="generating-title">🤖 AI Insights Coming Soon!</h3>
                <p className="generating-message">{insights.message}</p>
                <div className="generating-info">
                  <p>Our AI is analyzing product documentation and generating personalized insights for <strong>{insights.productName}</strong>.</p>
                  <p className="generating-tip">💡 Tip: Refresh this page in a few moments to see the insights!</p>
                </div>
              </div>
            </div>
          ) : (
          <div className="modal-body">
            {/* Product Header */}
            <div className="modal-header">
              <div className="modal-product-image">
                <img src={product.image_url} alt={product.name} />
              </div>
              <div className="modal-product-info">
                <div className="modal-badge">✨ AI-Powered Insights</div>
                <h2 className="modal-product-title">{product.name}</h2>
                <div className="modal-product-meta">
                  <span className="modal-price">₹{product.price}</span>
                  <span className="modal-stock">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="modal-scroll">
              {/* AI Summary */}
              <div className="modal-section">
                <h3 className="modal-section-title">🤖 AI Summary</h3>
                <p className="modal-summary">{insights.summary}</p>
              </div>

              {/* Key Features */}
              <div className="modal-section">
                <h3 className="modal-section-title">⭐ Key Features</h3>
                <ul className="modal-list">
                  {insights.keyFeatures && insights.keyFeatures.map((feature, idx) => (
                    <li key={idx}>
                      {typeof feature === 'string' ? feature : (
                        <>
                          <strong>{feature.title}:</strong> {feature.description}
                          {feature.impact && <span className="feature-impact"> ({feature.impact} impact)</span>}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div className="modal-section">
                <h3 className="modal-section-title">💡 Ideal Use Cases</h3>
                <ul className="modal-list">
                  {insights.useCases && insights.useCases.map((useCase, idx) => (
                    <li key={idx}>
                      {typeof useCase === 'string' ? useCase : (
                        <>
                          <strong>{useCase.scenario}:</strong> {useCase.description}
                          {useCase.benefit && <div className="use-case-benefit">✓ {useCase.benefit}</div>}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specs */}
              <div className="modal-section">
                <h3 className="modal-section-title">⚙️ Technical Specifications</h3>
                <div className="modal-specs">
                  {Object.entries(insights.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="modal-spec-item">
                      <span className="modal-spec-label">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="modal-spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Sentiment */}
              {insights.customerSentiment && (
                <div className="modal-section">
                  <h3 className="modal-section-title">📊 Customer Sentiment</h3>
                  <div className="modal-sentiment">
                    {insights.customerSentiment.overallRating && (
                      <div className="sentiment-rating">
                        <strong>Overall Rating:</strong> {insights.customerSentiment.overallRating}/5
                        {insights.customerSentiment.totalReviews > 0 && (
                          <span> ({insights.customerSentiment.totalReviews} reviews)</span>
                        )}
                      </div>
                    )}
                    {insights.customerSentiment.positiveAspects && insights.customerSentiment.positiveAspects.length > 0 && (
                      <div className="sentiment-aspects">
                        <strong>Positive Aspects:</strong>
                        <ul>
                          {insights.customerSentiment.positiveAspects.map((aspect, idx) => (
                            <li key={idx}>✓ {aspect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {insights.customerSentiment.commonConcerns && insights.customerSentiment.commonConcerns.length > 0 && (
                      <div className="sentiment-concerns">
                        <strong>Common Concerns:</strong>
                        <ul>
                          {insights.customerSentiment.commonConcerns.map((concern, idx) => (
                            <li key={idx}>⚠ {concern}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {insights.customerSentiment.recommendationRate && (
                      <div className="sentiment-recommendation">
                        <strong>Recommendation Rate:</strong> {insights.customerSentiment.recommendationRate}%
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              {insights.recommendations && insights.recommendations.length > 0 && (
                <div className="modal-section">
                  <h3 className="modal-section-title">🎯 AI Recommendations</h3>
                  <div className="modal-recommendations">
                    {insights.recommendations.map((rec, idx) => (
                      <div key={idx} className="modal-recommendation">
                        <span className="rec-number">{idx + 1}</span>
                        <span className="rec-text">
                          {typeof rec === 'string' ? rec : (
                            <>
                              <strong>{rec.type}:</strong> {rec.item}
                              {rec.reason && <div className="rec-reason">{rec.reason}</div>}
                            </>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="modal-disclaimer">
                <strong>Note:</strong> This is a prototype with simulated AI insights. 
                In production, insights will be generated from actual product documentation 
                using IBM watsonx and vector search technology.
              </div>
            </div>
          </div>
          )
        ) : (
          <div className="modal-error">
            <p>Unable to load product insights</p>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInsightsModal;

// Made with Bob
