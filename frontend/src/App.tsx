import React, { useState, useEffect } from 'react';
import { Menu, Layers } from 'lucide-react';
import { useAuth } from './context/auth-context';
import { useTheme } from './context/theme-context';
import { AuthHeader } from './components/auth/AuthHeader';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductCatalogView } from './components/products/ProductCatalogView';
import { SettingsView } from './components/settings/SettingsView';
import { ProductModal } from './components/products/ProductModal';
import { DeleteProductDialog } from './components/products/DeleteProductDialog';
import { ProductDetailFloatingWindow } from './components/products/ProductDetailFloatingWindow';
import { Product, CreateProductInput } from './types/product';
import { api } from './lib/api';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center relative ambient-grid overflow-hidden ${
        isLight ? 'bg-[#fafafa] text-zinc-900' : 'bg-[#09090b] text-[#f4f4f5]'
      }`}>
        <div className="glow-horizon" />
        <div className="sunburst-crest" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-0.5 shadow-glow-md animate-pulse">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-[#09090b]'}`}>
              <span className="w-3 h-3 rounded-full bg-[#ff7300]" />
            </div>
          </div>
          <div className={`text-sm font-medium ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
            Waking Quantix Store Cluster...
          </div>
          <div className="text-xs text-zinc-500">Connecting via Neon Serverless Pooler</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const lowStockCount = products.filter((p) => {
      const th = p.lowStockThreshold !== undefined && p.lowStockThreshold !== null
        ? p.lowStockThreshold
        : 5;
      return p.quantityOnHand <= th;
    }).length;

    return (
      <div className={`min-h-screen flex relative selection:bg-[#ff6b00]/30 selection:text-white ${
        isLight ? 'bg-[#fafafa] text-zinc-900' : 'bg-[#09090b] text-[#f4f4f5]'
      }`}>
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          productCount={products.length}
          lowStockCount={lowStockCount}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-x-hidden">
          <div className="glow-horizon" />
          <div className="sunburst-crest" />

          <header className={`lg:hidden flex items-center justify-between p-4 border-b relative z-20 ${
            isLight ? 'bg-white/90 border-zinc-200' : 'bg-[#0d0d12]/90 border-white/10'
          } backdrop-blur-md`}>
            <button
              onClick={() => setIsMobileOpen(true)}
              className={`p-2 rounded-xl border ${
                isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-700' : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-0.5 flex items-center justify-center">
                <div className={`w-full h-full rounded-[6px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-[#09090b]'}`}>
                  <Layers className="w-3.5 h-3.5 text-[#ff7300]" />
                </div>
              </div>
              <span className={`font-bold text-sm ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Quantix
              </span>
            </div>

            <div className="text-xs font-semibold text-orange-400 capitalize">
              {activeTab}
            </div>
          </header>

          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === 'dashboard' && (
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
            )}

            {activeTab === 'products' && (
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
            )}

            {activeTab === 'settings' && (
              <SettingsView
                onSettingsUpdated={() => {
                  fetchProducts();
                }}
              />
            )}
          </main>
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

  return (
    <div className={`min-h-screen flex flex-col relative ambient-grid overflow-y-auto selection:bg-[#ff6b00]/30 selection:text-white ${
      isLight ? 'bg-[#fafafa] text-zinc-900' : 'bg-[#09090b] text-[#f4f4f5]'
    }`}>
      <AuthHeader
        isLogin={authMode === 'login'}
        onSwitchMode={() => setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'))}
      />
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-10 relative z-10">
        {authMode === 'login' ? (
          <LoginPage onGoToSignup={() => setAuthMode('signup')} />
        ) : (
          <SignupPage onGoToLogin={() => setAuthMode('login')} />
        )}
      </main>
    </div>
  );
};
