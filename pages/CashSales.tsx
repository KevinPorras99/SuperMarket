import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PlusIcon } from '../assets/icons';

interface CartItem extends Product {
    quantity: number;
}

const CashSales: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // In a real app, you would fetch from '/api/products'
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
                const mockProducts: Product[] = [
                    { id: '1', name: 'Leche Entera 1L', sku: 'LE-001', category: 'Lácteos', stock: 150, price: 1.20, supplier: 'Proveedor A', dateAdded: '2023-10-01' },
                    { id: '2', name: 'Pan de Molde Blanco', sku: 'PA-001', category: 'Panadería', stock: 80, price: 2.50, supplier: 'Proveedor B', dateAdded: '2023-10-02' },
                    { id: '3', name: 'Huevos Docena', sku: 'HU-001', category: 'General', stock: 200, price: 3.00, supplier: 'Proveedor A', dateAdded: '2023-10-01' },
                ];
                setProducts(mockProducts);
            } catch (err) {
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
        });
    };
    
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length > 0) {
            // In a real app, you would send the cart data to '/api/sales'
            console.log('Finalizing sale:', {
                items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
                total: cartTotal,
            });
            setReceiptModalOpen(true);
        }
    };
    
    const finishSale = () => {
        setCart([]);
        setReceiptModalOpen(false);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Venta al Contado</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product List */}
                <div className="lg:col-span-2">
                    <Card>
                        <input
                            type="text"
                            placeholder="Buscar producto por nombre..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        />
                         {loading ? <p>Cargando productos...</p> : 
                         error ? <p className="text-red-500">{error}</p> :
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="border rounded-lg p-3 flex flex-col justify-between shadow-sm">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                                    </div>
                                    <Button onClick={() => addToCart(product)} className="mt-2 w-full text-xs" icon={<PlusIcon />}>
                                        Agregar
                                    </Button>
                                </div>
                            ))}
                        </div>}
                    </Card>
                </div>
                {/* Cart */}
                <div>
                    <Card title="Carrito de Compra">
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                            {cart.length === 0 && <p className="text-gray-500">El carrito está vacío.</p>}
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                            className="w-14 text-center border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {cart.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <Button onClick={handleCheckout} className="w-full mt-4">
                                    Generar Comprobante
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
             <Modal isOpen={isReceiptModalOpen} onClose={() => setReceiptModalOpen(false)} title="Comprobante de Venta">
                <div className="space-y-4">
                    <h3 className="text-center font-bold">Supermercado XYZ</h3>
                    <p className="text-center text-sm">{new Date().toLocaleString()}</p>
                    <div className="border-t border-b py-2 space-y-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                        <span>TOTAL</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => window.print()}>Imprimir</Button>
                        <Button onClick={finishSale}>Finalizar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CashSales;