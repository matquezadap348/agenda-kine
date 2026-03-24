import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { usePermission } from '@/Utils/Permissions';

export default function Index({ pacientes, filters }) {
    const { hasRole } = usePermission();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [editing, setEditing] = useState(null);
    const rutInput = useRef();

    const [search, setSearch] = useState(filters.search || '');
    const isFirstRender = useRef(true);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        rut: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(route('pacientes.index'), { search: search }, {
                preserveState: true,
                replace: true
            });
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const openCreateModal = () => {
        setEditing(null);
        reset();
        setIsModalOpen(true);
        setTimeout(() => rutInput.current?.focus(), 150);
    };

    const openEditModal = (paciente) => {
        setEditing(paciente);
        setData({
            rut: paciente.rut,
            nombre: paciente.nombre,
            apellido: paciente.apellido,
            email: paciente.email || '',
            telefono: paciente.telefono,
            fecha_nacimiento: paciente.fecha_nacimiento,
            direccion: paciente.direccion || '',
        });
        setIsModalOpen(true);
        setTimeout(() => rutInput.current?.focus(), 150);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setEditing(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            patch(route('pacientes.update', editing.id), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Ficha actualizada');
                },
            });
        } else {
            post(route('pacientes.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Paciente registrado');
                },
            });
        }
    };

    const deletePaciente = () => {
        destroy(route('pacientes.destroy', idToDelete), {
            onSuccess: () => {
                setConfirmingDeletion(false);
                toast.success('Registro eliminado');
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Registro de Pacientes</h2>}>
            <Head title="Pacientes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar por RUT o Nombre..."
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {(hasRole('admin') || hasRole('secretaria')) && (
                            <button onClick={openCreateModal} className="bg-kine-600 px-4 py-2 text-white rounded-md hover:bg-kine-700 transition font-semibold">
                                + Nuevo Paciente
                            </button>
                        )}
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">RUT</th>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Paciente</th>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Contacto</th>
                                        <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {pacientes.data.map((pac) => (
                                        <tr key={pac.id} className="hover:bg-kine-50/50 transition">
                                            <td className="px-6 py-4 font-mono text-gray-600">{pac.rut}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-kine-900">{pac.nombre} {pac.apellido}</div>
                                                <div className="text-xs text-gray-400">Nac: {pac.fecha_nacimiento}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 text-xs">
                                                <div>{pac.telefono}</div>
                                                <div>{pac.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-4">
                                                {(hasRole('admin') || hasRole('secretaria')) && (
                                                    <button onClick={() => openEditModal(pac)} className="text-kine-600 hover:text-kine-900 font-bold">Editar</button>
                                                )}
                                                {hasRole('admin') && (
                                                    <button onClick={() => { setIdToDelete(pac.id); setConfirmingDeletion(true); }} className="text-red-600 hover:text-red-900 font-bold">Eliminar</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={pacientes.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">{editing ? 'Actualizar Ficha' : 'Nueva Ficha de Paciente'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">RUT</label>
                            <input type="text" ref={rutInput} value={data.rut} onChange={(e) => setData('rut', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            {errors.rut && <div className="text-red-600 text-xs mt-1">{errors.rut}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input type="text" value={data.apellido} onChange={(e) => setData('apellido', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                            <input type="date" value={data.fecha_nacimiento} onChange={(e) => setData('fecha_nacimiento', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Cancelar</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-kine-600 text-white rounded-md">{editing ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmingDeletion} onClose={() => setConfirmingDeletion(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">¿Eliminar registro?</h2>
                    <p className="mt-1 text-sm text-gray-600">Esta acción no se puede deshacer.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setConfirmingDeletion(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Cancelar</button>
                        <button onClick={deletePaciente} className="px-4 py-2 bg-red-600 text-white rounded-md">Eliminar</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}