import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TrashIcon, PlusIcon, MinusIcon } from '../assets/icons';

interface BillItem extends Product {
    quantity: number;
}

// In a real app, this would be fetched from the backend, here it's a mock DB
const MOCK_PRODUCT_DB: Product[] = [
    { id: '1', name: 'Leche Entera 1L', sku: 'LE-001', category: 'Lácteos', stock: 150, price: 1.20, supplier: 'Proveedor A', dateAdded: '2023-10-01' },
    { id: '2', name: 'Pan de Molde Blanco', sku: 'PA-001', category: 'Panadería', stock: 80, price: 2.50, supplier: 'Proveedor B', dateAdded: '2023-10-02' },
    { id: '3', name: 'Huevos Docena', sku: 'HU-001', category: 'General', stock: 200, price: 3.00, supplier: 'Proveedor A', dateAdded: '2023-10-01' },
    { id: '4', name: 'Manzanas Kilo', sku: 'FR-001', category: 'Frutas y Verduras', stock: 50, price: 1.80, supplier: 'Proveedor C', dateAdded: '2023-10-03' },
];

// This function simulates calling an API endpoint: GET /api/products?sku={sku}
const findProductBySkuAPI = async (sku: string): Promise<Product | null> => {
    console.log(`Searching for SKU: ${sku} in mock DB...`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    const product = MOCK_PRODUCT_DB.find(p => p.sku.toLowerCase() === sku.toLowerCase());
    return product || null;
};


const Billing: React.FC = () => {
    const [items, setItems] = useState<BillItem[]>([]);
    const [skuInput, setSkuInput] = useState('');
    const [clientName, setClientName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const skuInputRef = useRef<HTMLInputElement>(null);

    const resetError = () => {
        if (error) setError(null);
    };

    const handleAddItemBySku = async () => {
        if (!skuInput.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        const product = await findProductBySkuAPI(skuInput);

        if (product) {
            setItems(prevItems => {
                const existingItem = prevItems.find(item => item.id === product.id);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prevItems, { ...product, quantity: 1 }];
            });
            setSkuInput('');
        } else {
            setError(`Producto con SKU "${skuInput}" no encontrado.`);
        }
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        resetError();
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItemBySku();
        }
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        setItems(prevItems => {
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.id !== productId);
            }
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    const removeItem = (productId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const cancelBill = () => {
        setItems([]);
        setSkuInput('');
        setClientName('');
        setError(null);
        skuInputRef.current?.focus();
    };

    const finalizeBill = () => {
        if (!clientName.trim()) {
            alert('Por favor, ingrese el nombre del cliente para finalizar la factura.');
            return;
        }
        // In a real app, send the bill to the backend: POST /api/bills
        console.log("Finalizing bill, sending to backend:", {
            clientName,
            items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
            subtotal,
            tax,
            total
        });
        alert(`Factura para ${clientName} finalizada. Total: $${total.toFixed(2)}.\nVer la consola para los datos enviados.`);
        cancelBill();
    }
    
    useEffect(() => {
        skuInputRef.current?.focus();
    }, []);
    
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.16; // 16% IVA example
    const total = subtotal + tax;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Facturación</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left side: Items list */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <div className="flex gap-2">
                            <input
                                ref={skuInputRef}
                                type="text"
                                placeholder="Escanear o ingresar SKU del producto..."
                                value={skuInput}
                                onChange={e => {
                                    setSkuInput(e.target.value);
                                    resetError();
                                }}
                                onKeyDown={handleKeyDown}
                                className={`flex-grow p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={isLoading}
                            />
                            <Button onClick={handleAddItemBySku} disabled={isLoading || !skuInput.trim()}>
                                {isLoading ? 'Buscando...' : 'Agregar'}
                            </Button>
                        </div>
                        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                    </Card>

                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">P. Unitario</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-10 text-gray-500">No hay productos en la factura.</td>
                                        </tr>
                                    ) : (
                                        items.map(item => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-200"><MinusIcon className="w-4 h-4" /></button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-200"><PlusIcon className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right side: Summary */}
                <div className="lg:col-span-1">
                    <Card title="Resumen de Factura">
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    id="clientName"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Nombre y Apellido"
                                />
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>IVA (16%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 my-2"></div>
                                <div className="flex justify-between font-bold text-xl text-gray-800">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <Button className="w-full" disabled={items.length === 0} onClick={finalizeBill}>Finalizar Factura</Button>
                            <Button variant="secondary" className="w-full" onClick={cancelBill}>Cancelar</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Billing;