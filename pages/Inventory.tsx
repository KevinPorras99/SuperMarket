import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PlusIcon } from '../assets/icons';

const Inventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            // In a real app, you would fetch from '/api/products'
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            const mockProducts: Product[] = [
                 { id: '1', name: 'Leche Entera 1L', sku: 'LE-001', category: 'Lácteos', stock: 150, price: 1.20, supplier: 'Proveedor A', dateAdded: '2023-10-01' },
                 { id: '2', name: 'Pan de Molde Blanco', sku: 'PA-001', category: 'Panadería', stock: 80, price: 2.50, supplier: 'Proveedor B', dateAdded: '2023-10-02' },
                 { id: '3', name: 'Huevos Docena', sku: 'HU-001', category: 'General', stock: 200, price: 3.00, supplier: 'Proveedor A', dateAdded: '2023-10-01' },
                 { id: '4', name: 'Manzanas Kilo', sku: 'FR-001', category: 'Frutas y Verduras', stock: 50, price: 1.80, supplier: 'Proveedor C', dateAdded: '2023-10-03' },
                 { id: '9', name: 'Queso Fresco 500g', sku: 'LA-002', category: 'Lácteos', stock: 4, price: 4.50, supplier: 'Proveedor F', dateAdded: '2023-10-04' },
            ];
            setProducts(mockProducts);
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };
    
    const handleSave = async (formData: Omit<Product, 'id' | 'dateAdded'>) => {
        // In a real app, this would be a POST or PUT request
        if (editingProduct) {
            // PUT /api/products/{editingProduct.id}
            console.log('Updating product:', editingProduct.id, formData);
        } else {
            // POST /api/products
            console.log('Creating new product:', formData);
        }
        // After successful save, refetch products to show changes
        await fetchProducts(); 
        closeModal();
    };
    
    const handleDelete = async (productId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            // DELETE /api/products/{productId}
            console.log('Deleting product:', productId);
             // After successful delete, refetch products
            await fetchProducts();
        }
    };

    const ProductForm: React.FC<{ product: Product | null, onSave: (data: any) => void, onCancel: () => void }> = ({ product, onSave, onCancel }) => {
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            // Basic data transformation, in a real app use a library like react-hook-form
            const processedData = {
                ...data,
                stock: parseInt(data.stock as string, 10),
                price: parseFloat(data.price as string)
            };
            onSave(processedData);
        };

        return (
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input name="name" type="text" defaultValue={product?.name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                    <input name="sku" type="text" defaultValue={product?.sku} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input name="stock" type="number" defaultValue={product?.stock} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <input name="price" type="number" step="0.01" defaultValue={product?.price} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                 </div>
                 {/* Add fields for category and supplier */}
                <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">{product ? 'Guardar Cambios' : 'Crear Producto'}</Button>
                </div>
            </form>
        );
    };

    const renderTableBody = () => {
        if (loading) {
            return <tr><td colSpan={6} className="text-center py-4">Cargando inventario...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan={6} className="text-center py-4 text-red-500">{error}</td></tr>;
        }
        if (products.length === 0) {
            return <tr><td colSpan={6} className="text-center py-4">No se encontraron productos.</td></tr>;
        }
        return products.map((product) => (
            <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button onClick={() => openModal(product)} className="text-blue-600 hover:text-blue-900">Editar</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
                <Button icon={<PlusIcon />} onClick={() => openModal()}>
                    Nuevo Producto
                </Button>
            </div>
            
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {renderTableBody()}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}>
                <ProductForm product={editingProduct} onSave={handleSave} onCancel={closeModal} />
            </Modal>
        </div>
    );
};

export default Inventory;