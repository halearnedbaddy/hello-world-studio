import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  ArrowLeft, Loader2, Package, CheckCircle, Shield, Star, Share2, Heart, ChevronRight, ShoppingCart
} from 'lucide-react';
import { ManualCheckoutModal } from '@/components/ManualCheckoutModal';

const SUPABASE_URL = "https://pxyyncsnjpuwvnwyfdwx.supabase.co";

interface ProductData {
  id: string;
  name: string;
  description?: string;
  price?: number;
  images?: string[];
  currency?: string;
  status: string;
  is_available?: boolean;
  availability_note?: string;
  store?: {
    id: string;
    name: string;
    slug: string;
  };
  seller?: {
    name: string;
  };
  sellerProfile?: {
    rating?: number;
    total_reviews?: number;
    is_verified?: boolean;
  };
}

export function ProductDetailPage() {
  const { storeSlug, productId } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!storeSlug || !productId) return;
      setLoading(true);
      
      try {
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/storefront-api/product/${encodeURIComponent(storeSlug)}/${productId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        const res = await response.json();
        
        if (!mounted) return;
        if (res.success && res.data) {
          setProduct(res.data as ProductData);
          setError(null);
        } else {
          setError(res.error || 'Product not found');
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to connect to server');
        }
      }
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [storeSlug, productId]);

  const handleCheckoutSuccess = (transactionId: string) => {
    // Navigate to tracking page after successful payment submission
    navigate(`/track/${transactionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-destructive" />
          </div>
          <p className="font-bold text-foreground mb-2">Product Unavailable</p>
          <p className="text-sm text-muted-foreground mb-6">{error || 'The product could not be found.'}</p>
          <Link
            to={storeSlug ? `/store/${storeSlug}` : '/'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            <ArrowLeft size={18} />
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const isUnavailable = product.is_available === false;
  const sellerRating = product.sellerProfile?.rating || 0;
  const isVerified = product.sellerProfile?.is_verified || false;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          {product.store && (
            <Link 
              to={`/store/${product.store.slug}`}
              className="text-sm text-primary hover:underline"
            >
              View Store
            </Link>
          )}
          <div className="flex items-center gap-2 text-sm text-primary">
            <Shield size={16} />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-card border border-border rounded-xl overflow-hidden relative">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package size={64} className="text-muted-foreground/40" />
                </div>
              )}
              
              {isUnavailable && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="px-4 py-2 bg-muted text-muted-foreground rounded-full font-medium">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Quick actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2 bg-background/90 rounded-full hover:bg-background transition shadow-sm">
                  <Heart size={20} className="text-muted-foreground" />
                </button>
                <button className="p-2 bg-background/90 rounded-full hover:bg-background transition shadow-sm">
                  <Share2 size={20} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      activeImage === idx ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Seller Info */}
            {product.seller && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {product.seller.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{product.seller.name}</p>
                    {isVerified && (
                      <CheckCircle size={14} className="text-primary" />
                    )}
                  </div>
                  {sellerRating > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star size={12} className="fill-primary text-primary" />
                      <span>{sellerRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Name & Price */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {typeof product.price === 'number' 
                    ? formatPrice(product.price, product.currency || 'KES')
                    : 'Price on request'}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-medium text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Availability Note */}
            {isUnavailable && product.availability_note && (
              <div className="bg-muted border border-border rounded-lg p-4">
                <p className="text-muted-foreground text-sm">{product.availability_note}</p>
              </div>
            )}

            {/* Security Features */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-primary" />
                <span>PayLoom Protection - Payment held securely in escrow</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-primary" />
                <span>Money-back guarantee if item not received</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-primary" />
                <span>Secure M-Pesa & Bank Transfer payments</span>
              </div>
            </div>

            {/* Buy Button */}
            {!isUnavailable && product.price ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Buy Now
                <ChevronRight size={20} />
              </button>
            ) : (
              <div className="bg-muted border border-border rounded-lg p-4 text-center">
                <p className="text-muted-foreground">
                  {isUnavailable ? 'This product is currently unavailable' : 'Price not available. Please contact the seller.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Manual Checkout Modal */}
      {product && storeSlug && (
        <ManualCheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            currency: product.currency,
            images: product.images,
          }}
          storeSlug={storeSlug}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}

export default ProductDetailPage;
