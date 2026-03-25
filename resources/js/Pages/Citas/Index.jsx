import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { usePermission } from '@/Utils/Permissions';

export default function Index({ citas, pacientes, profesionales, filters }) {
    const { hasRole } = usePermission();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [editing, setEditing] = useState(null);
    
    const [search, setSearch] = useState(filters.search || '');
    const isFirstRender = useRef(true);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        paciente_id: '',
        profesional_id: '',
        fecha_hora: '',
        estado: 'pendiente',
        observaciones: '',
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(route('citas.index'), { search: search }, {
                preserveState: true,
                replace: true,
                only: ['citas', 'filters']
            });
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const openCreateModal = () => {
        setEditing(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (cita) => {
        setEditing(cita);
        setData({
            paciente_id: cita.paciente_id,
            profesional_id: cita.profesional_id,
            fecha_hora: cita.fecha_hora.slice(0, 16),
            estado: cita.estado,
            observaciones: cita.observaciones || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setEditing(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            patch(route('citas.update', editing.id), { onSuccess: () => closeModal() });
        } else {
            post(route('citas.store'), { onSuccess: () => closeModal() });
        }
    };

    const deleteCita = () => {
        destroy(route('citas.destroy', idToDelete), { onSuccess: () => setConfirmingDeletion(false) });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-foreground">Agenda Médica</h2>}>
            <Head title="Agenda" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, apellido o RUT del paciente..."
                                className="w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {(hasRole('admin') || hasRole('secretaria')) && (
                            <button onClick={openCreateModal} className="bg-kine-600 px-4 py-2 text-sm font-semibold text-white rounded-md hover:bg-kine-700 transition">
                                + Agendar Cita
                            </button>
                        )}
                    </div>

                    <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6 text-foreground text-sm">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase tracking-wider">Fecha y Hora</th>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase tracking-wider">Paciente</th>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase tracking-wider">Profesional</th>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-right font-medium text-foreground opacity-80 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {citas.data.map((cita) => (
                                        <tr key={cita.id} className="hover:bg-background transition">
                                            <td className="px-6 py-4 font-semibold text-foreground">
                                                {new Date(cita.fecha_hora).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">{cita.paciente?.nombre} {cita.paciente?.apellido}</div>
                                                <div className="text-xs text-foreground opacity-80">{cita.paciente?.rut}</div>
                                            </td>
                                            <td className="px-6 py-4 text-foreground opacity-80">
                                                Klgo. {cita.profesional?.nombre} {cita.profesional?.apellido}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                    cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 
                                                    cita.estado === 'cancelada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {cita.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                {(hasRole('admin') || hasRole('secretaria')) && (
                                                    <button onClick={() => openEditModal(cita)} className="text-kine-600 hover:text-kine-900 font-bold">Editar</button>
                                                )}
                                                {hasRole('admin') && (
                                                    <button onClick={() => { setIdToDelete(cita.id); setConfirmingDeletion(true); }} className="text-red-600 hover:text-red-900 font-bold">Eliminar</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {citas.data.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-foreground opacity-80 italic">
                                                No se encontraron resultados para "{search}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={citas.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-foreground mb-6">{editing ? 'Modificar Cita' : 'Agendar Nueva Cita'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Paciente</label>
                            <select value={data.paciente_id} onChange={(e) => setData('paciente_id', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground" required>
                                <option value="">Seleccione...</option>
                                {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nombre} {p.apellido} ({p.rut})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Profesional</label>
                            <select value={data.profesional_id} onChange={(e) => setData('profesional_id', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground" required>
                                <option value="">Seleccione...</option>
                                {profesionales.map((pr) => <option key={pr.id} value={pr.id}>{pr.nombre} {pr.apellido}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Fecha y Hora</label>
                            <input type="datetime-local" value={data.fecha_hora} onChange={(e) => setData('fecha_hora', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground" required />
                            {errors.fecha_hora && <div className="text-red-600 text-xs mt-1">{errors.fecha_hora}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Estado</label>
                            <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground">
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground opacity-80">Observaciones</label>
                            <textarea value={data.observaciones} onChange={(e) => setData('observaciones', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground" rows="2"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-background text-foreground hover:opacity-80 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-kine-600 text-white rounded-md shadow-sm hover:bg-kine-700" disabled={processing}>
                            {editing ? 'Guardar Cambios' : 'Agendar Cita'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmingDeletion} onClose={() => setConfirmingDeletion(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-foreground italic">¿Estás seguro de eliminar esta cita?</h2>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setConfirmingDeletion(false)} className="px-4 py-2 bg-background text-foreground hover:opacity-80 rounded-md">No, mantener</button>
                        <button onClick={deleteCita} className="px-4 py-2 bg-red-600 text-white rounded-md">Sí, eliminar</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}