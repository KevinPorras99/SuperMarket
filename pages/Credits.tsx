
import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceStatus, CreditNote, Payment, NewCreditNote, CreditTab } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PlusIcon } from '../assets/icons';
import Table, { Column } from '../components/ui/Table';

const statusColors: Record<InvoiceStatus, string> = {
    Pendiente: 'bg-yellow-100 text-yellow-800',
    Cancelada: 'bg-green-100 text-green-800',
    Vencida: 'bg-red-100 text-red-800',
};

const BillingTab: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                console.log('Fetching invoices...');
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
                const mockInvoices: Invoice[] = [
                    { id: 'FAC-001', clientName: 'Juan Pérez', issueDate: '2023-10-01', dueDate: '2023-10-31', amount: 150.75, status: 'Pendiente' },
                    { id: 'FAC-002', clientName: 'Ana Gómez', issueDate: '2023-09-15', dueDate: '2023-10-15', amount: 320.00, status: 'Cancelada' },
                    { id: 'FAC-003', clientName: 'Carlos Ruiz', issueDate: '2023-08-20', dueDate: '2023-09-20', amount: 85.50, status: 'Vencida' },
                    { id: 'FAC-004', clientName: 'Luisa Fernández', issueDate: '2023-10-05', dueDate: '2023-11-05', amount: 500.00, status: 'Pendiente' },
                    { id: 'FAC-005', clientName: 'Mario Vargas', issueDate: '2023-10-02', dueDate: '2023-11-02', amount: 75.20, status: 'Pendiente' },
                    { id: 'FAC-006', clientName: 'Isabel Allende', issueDate: '2023-09-25', dueDate: '2023-10-25', amount: 120.00, status: 'Cancelada' },
                    { id: 'FAC-007', clientName: 'Jorge Luis Borges', issueDate: '2023-08-01', dueDate: '2023-09-01', amount: 250.00, status: 'Vencida' },
                    { id: 'FAC-008', clientName: 'Gabriel García', issueDate: '2023-10-10', dueDate: '2023-11-10', amount: 95.00, status: 'Pendiente' },
                ];
                setInvoices(mockInvoices);
            } catch (err) {
                setError('No se pudieron cargar las facturas.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const columns: Column<Invoice>[] = [
        { title: 'Factura #', accessor: 'id', className: 'font-medium text-gray-900' },
        { title: 'Cliente', accessor: 'clientName' },
        { title: 'Fecha Emisión', accessor: 'issueDate' },
        { title: 'Monto', accessor: (item) => `$${item.amount.toFixed(2)}` },
        { 
          title: 'Estado', 
          accessor: (item) => (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[item.status]}`}>
              {item.status}
            </span>
          ) 
        },
        { 
          title: 'Acciones', 
          accessor: () => (
            <div className="space-x-2">
              <a href="#" className="text-blue-600 hover:text-blue-900">Ver</a>
              <a href="#" className="text-green-600 hover:text-green-900">Pagar</a>
            </div>
          ),
          className: 'text-right'
        }
    ];

    const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
    const currentInvoices = invoices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <Card>
            <Table<Invoice>
                columns={columns}
                data={currentInvoices}
                loading={loading}
                error={error}
                getRowKey={(invoice) => invoice.id}
            />
             {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Anterior</Button>
                        <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, invoices.length)}</span> de{' '}
                                <span className="font-medium">{invoices.length}</span> resultados
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

const PaymentsTab: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockPayments: Payment[] = [
                { id: 'P-001', invoiceId: 'FAC-002', date: '2023-10-14', amount: 320.00, paymentMethod: 'Tarjeta' },
                { id: 'P-002', invoiceId: 'FAC-001', date: '2023-10-15', amount: 50.00, paymentMethod: 'Efectivo' },
            ];
            setPayments(mockPayments);
            setLoading(false);
        };
        fetchPayments();
    }, []);

    const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log("Registrando pago (simulación):", data);
        alert(`Pago para factura ${data.invoiceId} por $${data.amount} registrado.`);
        e.currentTarget.reset();
    };
    
    const columns: Column<Payment>[] = [
        { title: 'Pago #', accessor: 'id', className: 'font-medium text-gray-900' },
        { title: 'Factura #', accessor: 'invoiceId' },
        { title: 'Fecha', accessor: 'date' },
        { title: 'Monto', accessor: (item) => `$${item.amount.toFixed(2)}` },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <Card title="Registrar Nuevo Pago">
                    <form className="space-y-4" onSubmit={handlePaymentSubmit}>
                        <div>
                            <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700">ID de Factura</label>
                            <input type="text" name="invoiceId" id="invoiceId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Monto a Pagar</label>
                            <input type="number" name="amount" id="amount" placeholder="0.00" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Método de Pago</label>
                            <select name="paymentMethod" id="paymentMethod" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option>Efectivo</option>
                                <option>Tarjeta</option>
                                <option>Transferencia</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <Button type="submit">Registrar Pago</Button>
                        </div>
                    </form>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <Card title="Pagos Recientes">
                    <Table<Payment>
                        columns={columns}
                        data={payments}
                        loading={loading}
                        error={null}
                        getRowKey={(payment) => payment.id}
                    />
                </Card>
            </div>
        </div>
    );
};

const CreditNotesTab: React.FC = () => {
    const [notes, setNotes] = useState<CreditNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchCreditNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockNotes: CreditNote[] = [
                { id: 'NC-001', invoiceId: 'FAC-001', clientName: 'Juan Pérez', date: '2023-10-03', amount: 20.00, reason: 'Producto dañado' },
                { id: 'NC-002', invoiceId: 'FAC-005', clientName: 'Restaurante El Buen Sabor', date: '2023-10-01', amount: 50.00, reason: 'Devolución de mercancía' },
            ];
            // This logic is to add new notes to the mock data without a real backend
            setNotes(prev => {
                const existingIds = new Set(prev.map(n => n.id));
                const newNotes = mockNotes.filter(n => !existingIds.has(n.id));
                return [...prev, ...newNotes];
            });
        } catch (err) {
            setError('No se pudieron cargar las notas de crédito.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreditNotes();
    }, []);

    const handleCreateNote = (newNoteData: NewCreditNote) => {
        // Simulate POST request to /api/credit-notes
        console.log("Creando nueva nota de crédito:", newNoteData);
        
        // In a real app, the backend would return the new note with an ID. We simulate it here.
        const newNote: CreditNote = {
            id: `NC-00${notes.length + 3}`,
            ...newNoteData,
            clientName: 'Cliente (Simulado)', // This would come from the invoice data
            date: new Date().toISOString().split('T')[0],
        };
        
        setNotes(prev => [newNote, ...prev]);
        alert('Nota de crédito creada exitosamente.');
        setModalOpen(false);
    };

    const CreditNoteForm: React.FC<{onSave: (data: NewCreditNote) => void; onCancel: () => void;}> = ({ onSave, onCancel }) => {
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
                invoiceId: formData.get('invoiceId') as string,
                amount: parseFloat(formData.get('amount') as string),
                reason: formData.get('reason') as string
            };
            onSave(data);
        };
        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Factura Asociada (ID)</label>
                    <input name="invoiceId" type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Monto</label>
                    <input name="amount" type="number" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Razón</label>
                    <textarea name="reason" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Crear Nota</Button>
                </div>
            </form>
        )
    }

    const columns: Column<CreditNote>[] = [
        { title: 'Nota #', accessor: 'id', className: 'font-medium text-gray-900' },
        { title: 'Factura Asociada', accessor: 'invoiceId' },
        { title: 'Cliente', accessor: 'clientName' },
        { title: 'Fecha', accessor: 'date' },
        { title: 'Monto', accessor: (item) => `$${item.amount.toFixed(2)}` },
    ];

    return (
        <Card>
           <div className="flex justify-end mb-4">
               <Button icon={<PlusIcon />} onClick={() => setModalOpen(true)}>Crear Nota de Crédito</Button>
           </div>
           <Table<CreditNote>
                columns={columns}
                data={notes}
                loading={loading}
                error={error}
                getRowKey={(note) => note.id}
            />
             <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Crear Nueva Nota de Crédito">
                <CreditNoteForm onSave={handleCreateNote} onCancel={() => setModalOpen(false)} />
            </Modal>
        </Card>
    );
}

interface CreditsProps {
    initialTab?: CreditTab;
}

const Credits: React.FC<CreditsProps> = ({ initialTab = 'Facturación' }) => {
    const [activeTab, setActiveTab] = useState<CreditTab>(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Facturación': return <BillingTab />;
            case 'Pagos': return <PaymentsTab />;
            case 'Notas de crédito': return <CreditNotesTab />;
            default: return null;
        }
    };
    
    const tabs: CreditTab[] = ['Facturación', 'Pagos', 'Notas de crédito'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Créditos</h1>
                 <Button icon={<PlusIcon />}>Nueva Factura</Button>
            </div>

            <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Credits;