import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from './context/auth-context';
import { useTheme } from './context/theme-context';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductCatalogView } from './components/products/ProductCatalogView';
import { ProductHistoryView } from './components/products/ProductHistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { ProductModal } from './components/products/ProductModal';
import { DeleteProductDialog } from './components/products/DeleteProductDialog';
import { ProductDetailFloatingWindow } from './components/products/ProductDetailFloatingWindow';
import { QuantixLogo } from './components/ui/QuantixLogo';
import { ClusterWakingScreen } from './components/ui/ClusterWakingScreen';
import { LandingPageView } from './components/landing/LandingPageView';
import { Product, CreateProductInput } from './types/product';
import { api } from './lib/api';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const username = user?.email ? user.email.split('@')[0] : 'User';

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    if (!isAuthenticated) return;
    setIsLoadingProducts(true);
    try {
      const response = await api.get<Product[]>('/api/products');
      if (response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleCreateOrUpdate = async (input: CreateProductInput) => {
    if (editingProduct) {
      const response = await api.put<Product>(`/api/products/${editingProduct.id}`, input);
      if (response.data) {
        const updated = response.data;
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? updated : p))
        );
        if (selectedProduct?.id === editingProduct.id) {
          setSelectedProduct(updated);
        }
      }
    } else {
      const response = await api.post<Product>('/api/products', input);
      if (response.data) {
        setProducts((prev) => [response.data!, ...prev]);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/products/${deletingProduct.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      if (selectedProduct?.id === deletingProduct.id) {
        setIsDetailOpen(false);
        setSelectedProduct(null);
      }
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAuthLoading) {
    return <ClusterWakingScreen />;
  }

  if (isAuthenticated) {
    const lowStockCount = products.filter((p) => {
      const th = p.lowStockThreshold !== undefined && p.lowStockThreshold !== null
        ? p.lowStockThreshold
        : 5;
      return p.quantityOnHand <= th;
    }).length;

    return (
      <div className={`min-h-screen flex flex-col relative selection:bg-[#ff6b00]/30 selection:text-white ${
        isLight ? 'bg-[#fafafa] text-zinc-900' : 'bg-[#09090b] text-[#f4f4f5]'
      }`}>
        <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors ${
          isLight
            ? 'bg-white/80 border-zinc-200/80 shadow-sm'
            : 'bg-[#09090b]/80 border-white/10'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QuantixLogo size="sm" withText />
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isLight
                      ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
                  }`}
                  title="Store Settings & Profile"
                >
                  <User className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-semibold capitalize">{username}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex relative">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            productCount={products.length}
            lowStockCount={lowStockCount}
          />

          <div className="flex-1 flex flex-col min-w-0 relative overflow-x-hidden">
            <div className="glow-horizon" />
            <div className="sunburst-crest" />

            <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:pl-28 pb-28 lg:pb-12">
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <DashboardView
                      products={products}
                      isLoading={isLoadingProducts}
                      onRefresh={fetchProducts}
                      onAddProduct={() => {
                        setEditingProduct(null);
                        setIsModalOpen(true);
                      }}
                      onViewProductDetail={(product) => {
                        setSelectedProduct(product);
                        setIsDetailOpen(true);
                      }}
                      onNavigateToProducts={() => setActiveTab('products')}
                    />
                  </motion.div>
                )}

                {activeTab === 'products' && (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCatalogView
                      products={products}
                      isLoading={isLoadingProducts}
                      onRefresh={fetchProducts}
                      onOpenCreate={() => {
                        setEditingProduct(null);
                        setIsModalOpen(true);
                      }}
                      onSelectProduct={(product) => {
                        setSelectedProduct(product);
                        setIsDetailOpen(true);
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductHistoryView
                      products={products}
                      onOpenProductDetail={(product) => {
                        setSelectedProduct(product);
                        setIsDetailOpen(true);
                      }}
                      onOpenAdjustStock={(product) => {
                        setSelectedProduct(product);
                        setIsDetailOpen(true);
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SettingsView
                      onSettingsUpdated={() => {
                        fetchProducts();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleCreateOrUpdate}
          initialData={editingProduct}
        />

        <DeleteProductDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDeletingProduct(null);
          }}
          onConfirm={handleDelete}
          product={deletingProduct}
          isDeleting={isDeleting}
        />

        <ProductDetailFloatingWindow
          isOpen={isDetailOpen}
          product={selectedProduct}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedProduct(null);
          }}
          onEdit={(prod) => {
            setEditingProduct(prod);
            setIsModalOpen(true);
          }}
          onDelete={(prod) => {
            setDeletingProduct(prod);
            setIsDeleteDialogOpen(true);
          }}
          onProductUpdated={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setSelectedProduct(updated);
          }}
        />
      </div>
    );
  }

  return <LandingPageView />;
};
