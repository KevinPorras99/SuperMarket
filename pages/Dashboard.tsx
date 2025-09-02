import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Card from '../components/ui/Card';
import { salesData, profitData, topProductsData } from '../constants';
import { Product } from '../types';

const StatCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    return (
        <Card>
            <h4 className="text-sm font-medium text-gray-500">{title}</h4>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
            {change && (
                <p className={`mt-1 text-sm ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </p>
            )}
        </Card>
    );
};

const Dashboard: React.FC = () => {
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState({ revenue: 'Cargando...', invoices: 'Cargando...', outOfStock: 'Cargando...', newClients: 'Cargando...' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // In a real app, you would fetch this from one or more API endpoints
                // For demonstration, we'll use a timeout to simulate a network request
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock API responses
                const statsResponse = { revenue: '$7,642', invoices: '128', outOfStock: '3', newClients: '8' };
                // You would fetch from an endpoint like /api/products?stock_lt=10
                const lowStockResponse: Product[] = [
                    { id: '9', name: 'Queso Fresco 500g', sku: 'LA-002', category: 'Lácteos', stock: 4, price: 4.50, supplier: 'Proveedor F', dateAdded: '2023-10-04' },
                    { id: '8', name: 'Refresco Cola 2L', sku: 'BE-001', category: 'Bebidas', stock: 9, price: 2.00, supplier: 'Proveedor A', dateAdded: '2023-10-02' },
                ];
                
                setStats(statsResponse);
                setLowStockProducts(lowStockResponse);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                // Handle error state if needed
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Ingresos del Día" value={loading ? '...' : stats.revenue} change="+12.5%" changeType="increase" />
                <StatCard title="Facturas Emitidas" value={loading ? '...' : stats.invoices} change="+2.1%" changeType="increase" />
                <StatCard title="Productos Agotados" value={loading ? '...' : stats.outOfStock} change="-1" changeType="decrease" />
                <StatCard title="Nuevos Clientes" value={loading ? '...' : stats.newClients} change="+5" changeType="increase" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="Ventas de la Semana">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Ventas" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Ganancias (Últimos 6 meses)">
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={profitData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Ganancia" stroke="#16a34a" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Productos Más Vendidos" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={400}>
                         <BarChart layout="vertical" data={topProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Unidades Vendidas" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Alertas de Inventario Bajo">
                    {loading ? <p>Cargando alertas...</p> : (
                        <ul className="divide-y divide-gray-200">
                            {lowStockProducts.length > 0 ? lowStockProducts.map(product => (
                                <li key={product.id} className="py-3 flex justify-between items-center">
                                    <span>{product.name}</span>
                                    <span className="font-bold text-red-500">{product.stock}</span>
                                </li>
                            )) : <p className="text-gray-500">No hay alertas de inventario.</p>}
                        </ul>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;