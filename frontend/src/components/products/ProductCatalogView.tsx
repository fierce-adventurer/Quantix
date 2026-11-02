import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Layers,
  Store,
  User,
  LogOut,
  AlertTriangle,
  DollarSign,
  Edit2,
  Trash2,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { Product, CreateProductInput } from '../../types/product';
import { api } from '../../lib/api';
import { GlowButton } from '../ui/GlowButton';
import { ProductModal } from './ProductModal';
import { DeleteProductDialog } from './DeleteProductDialog';

export const ProductCatalogView: React.FC = () => {
  const { user, tenant, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Product[]>('/api/products');
      if (response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateOrUpdate = async (input: CreateProductInput) => {
    if (editingProduct) {
      const response = await api.put<Product>(`/api/products/${editingProduct.id}`, input);
      if (response.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? response.data! : p))
        );
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
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      const threshold = product.lowStockThreshold !== undefined ? product.lowStockThreshold : 5;
      if (filterTab === 'in-stock') {
        return product.quantityOnHand > threshold;
      }
      if (filterTab === 'low-stock') {
        return product.quantityOnHand > 0 && product.quantityOnHand <= threshold;
      }
      if (filterTab === 'out-of-stock') {
        return product.quantityOnHand === 0;
      }
      return true;
    });
  }, [products, searchQuery, filterTab]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce((acc, p) => acc + (p.quantityOnHand || 0), 0);
    const lowStockCount = products.filter((p) => {
      const t = p.lowStockThreshold !== undefined ? p.lowStockThreshold : 5;
      return p.quantityOnHand <= t;
    }).length;
    const inventoryValuation = products.reduce((acc, p) => {
      const price = p.sellingPrice || p.costPrice || 0;
      return acc + (p.quantityOnHand || 0) * price;
    }, 0);

    return { totalProducts, totalUnits, lowStockCount, inventoryValuation };
  }, [products]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] relative flex flex-col selection:bg-[#ff6b00]/30 selection:text-white">
      <div className="glow-horizon" />
      <div className="sunburst-crest" />

      <header className="relative z-20 w-full border-b border-white/10 bg-[#0d0d12]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-0.5 shadow-glow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#ff7300]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-tight">Quantix</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Tenant
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141c] border border-white/10 text-xs">
              <Store className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-zinc-400">Store:</span>
              <span className="font-semibold text-white">{tenant?.name}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141c] border border-white/10 text-xs">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-300">{user?.email}</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-[10px]">
                {user?.role}
              </span>
            </div>

            <GlowButton variant="secondary" size="sm" onClick={logout}>
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </GlowButton>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Inventory & Products
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Store-partitioned catalog control center. Manage SKUs, stock levels, and pricing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="p-2.5 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] text-zinc-400 hover:text-white border border-white/10 transition-colors"
              title="Refresh catalog"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>
            <GlowButton
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              size="md"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Product
            </GlowButton>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-medium">Total Products</span>
              <Package className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {metrics.totalProducts}
            </div>
            <div className="text-[11px] text-zinc-500">Unique SKUs in catalog</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-medium">Units on Hand</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {metrics.totalUnits.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-500">Total units across all items</div>
          </div>

          <div className="glass-panel-glow rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-orange-400 text-xs">
              <span className="font-medium">Low Stock Warnings</span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">
              {metrics.lowStockCount}
            </div>
            <div className="text-[11px] text-orange-300/80">Items below alert threshold</div>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-medium">Catalog Valuation</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              ${metrics.inventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-zinc-500">Potential retail selling value</div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Instant search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-[#14141c] border border-white/10 pl-10 pr-9 py-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14141c] border border-white/10 overflow-x-auto text-xs">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                  filterTab === 'all'
                    ? 'bg-[#20202c] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setFilterTab('in-stock')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                  filterTab === 'in-stock'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setFilterTab('low-stock')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                  filterTab === 'low-stock'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setFilterTab('out-of-stock')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                  filterTab === 'out-of-stock'
                    ? 'bg-red-500/20 text-red-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Depleted
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#121217] text-zinc-400 text-[11px] uppercase tracking-wider border-b border-white/5 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Product & SKU</th>
                  <th className="py-3.5 px-4">Stock on Hand</th>
                  <th className="py-3.5 px-4">Threshold</th>
                  <th className="py-3.5 px-4">Cost Price</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-orange-400 mx-auto mb-2" />
                      Loading inventory records...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400">
                      <div className="w-12 h-12 rounded-2xl bg-[#14141c] border border-white/10 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="text-base font-semibold text-white mb-1">
                        {searchQuery ? 'No matching products found' : 'No products in catalog yet'}
                      </div>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                        {searchQuery
                          ? `No items match the filter "${searchQuery}". Clear search or try a different SKU.`
                          : 'Begin by adding your first product to this store workspace.'}
                      </p>
                      {!searchQuery && (
                        <GlowButton
                          size="sm"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1.5" />
                          Add Product
                        </GlowButton>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const threshold = product.lowStockThreshold !== undefined ? product.lowStockThreshold : 5;
                    const isOut = product.quantityOnHand === 0;
                    const isLow = !isOut && product.quantityOnHand <= threshold;

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-white">{product.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20">
                              {product.sku}
                            </span>
                            {product.description && (
                              <span className="text-xs text-zinc-500 truncate max-w-[200px]">
                                {product.description}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                isOut
                                  ? 'text-red-400'
                                  : isLow
                                  ? 'text-orange-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {product.quantityOnHand}
                            </span>
                            <span className="text-[11px] text-zinc-500">units</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-xs">
                          {threshold}
                        </td>

                        <td className="py-3.5 px-4 text-zinc-300 font-mono text-xs">
                          {product.costPrice !== undefined && product.costPrice !== null
                            ? `$${Number(product.costPrice).toFixed(2)}`
                            : '—'}
                        </td>

                        <td className="py-3.5 px-4 text-white font-semibold font-mono text-xs">
                          {product.sellingPrice !== undefined && product.sellingPrice !== null
                            ? `$${Number(product.sellingPrice).toFixed(2)}`
                            : '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[11px] font-semibold">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[11px] font-semibold inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                              In Stock
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingProduct(product);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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
    </div>
  );
};
