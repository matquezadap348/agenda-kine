import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function Index({ pacientes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [editing, setEditing] = useState(null);
    const rutInput = useRef();

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        rut: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        direccion: '',
    });

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

    const confirmDeletion = (id) => {
        setIdToDelete(id);
        setConfirmingDeletion(true);
    };

    const closeDeletionModal = () => {
        setConfirmingDeletion(false);
        setIdToDelete(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            patch(route('pacientes.update', editing.id), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Ficha de paciente actualizada', {
                        style: { background: '#134e4a', color: '#fff' },
                        iconTheme: { primary: '#fff', secondary: '#134e4a' },
                    });
                },
            });
        } else {
            post(route('pacientes.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Paciente registrado exitosamente', { icon: '🧑‍🤝‍🧑' });
                },
            });
        }
    };

    const deletePaciente = () => {
        destroy(route('pacientes.destroy', idToDelete), {
            onSuccess: () => {
                closeDeletionModal();
                toast.success('Ficha de paciente eliminada', { icon: '🗑️' });
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Registro de Pacientes</h2>}>
            <Head title="Pacientes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Listado de Pacientes</h3>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center rounded-md bg-kine-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kine-700 transition"
                        >
                            + Nuevo Paciente
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 text-sm">
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
                                    {pacientes.map((pac) => (
                                        <tr key={pac.id} className="hover:bg-kine-50/50 transition">
                                            <td className="px-6 py-4 font-mono text-gray-600">{pac.rut}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-kine-900">{pac.nombre} {pac.apellido}</div>
                                                <div className="text-xs text-gray-400">Nac: {pac.fecha_nacimiento}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div>{pac.telefono}</div>
                                                <div className="text-xs text-gray-400">{pac.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-4">
                                                <button onClick={() => openEditModal(pac)} className="text-kine-600 hover:text-kine-900 font-bold">Editar</button>
                                                <button onClick={() => confirmDeletion(pac.id)} className="text-red-600 hover:text-red-900 font-bold">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pacientes.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                Aún no hay pacientes registrados en la clínica.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">{editing ? 'Actualizar Ficha de Paciente' : 'Abrir Nueva Ficha'}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">RUT</label>
                            <input type="text" ref={rutInput} value={data.rut} onChange={(e) => setData('rut', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" placeholder="12345678-9" required />
                            {errors.rut && <div className="text-red-600 text-xs mt-1">{errors.rut}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.nombre && <div className="text-red-600 text-xs mt-1">{errors.nombre}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input type="text" value={data.apellido} onChange={(e) => setData('apellido', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.apellido && <div className="text-red-600 text-xs mt-1">{errors.apellido}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                            <input type="date" value={data.fecha_nacimiento} onChange={(e) => setData('fecha_nacimiento', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.fecha_nacimiento && <div className="text-red-600 text-xs mt-1">{errors.fecha_nacimiento}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.telefono && <div className="text-red-600 text-xs mt-1">{errors.telefono}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico (Opcional)</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" />
                            {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Dirección (Opcional)</label>
                            <input type="text" value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" />
                            {errors.direccion && <div className="text-red-600 text-xs mt-1">{errors.direccion}</div>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">Cancelar</button>
                        <button type="submit" disabled={processing} className={`px-4 py-2 text-white rounded-md shadow-sm transition ${editing ? 'bg-green-600 hover:bg-green-700' : 'bg-kine-600 hover:bg-kine-700'}`}>{editing ? 'Actualizar Ficha' : 'Registrar Paciente'}</button>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmingDeletion} onClose={closeDeletionModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">¿Eliminar registro del paciente?</h2>
                    <p className="mt-1 text-sm text-gray-600">Esta acción es irreversible. Se eliminará toda la información personal de este paciente de la base de datos.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeDeletionModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">Cancelar</button>
                        <button onClick={deletePaciente} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Eliminar permanentemente</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}