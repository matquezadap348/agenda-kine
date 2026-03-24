import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function Index({ profesionales, especialidades }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [editing, setEditing] = useState(null);
    const nombreInput = useRef();

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        especialidad_id: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
    });

    const openCreateModal = () => {
        setEditing(null);
        reset();
        setIsModalOpen(true);
        setTimeout(() => nombreInput.current?.focus(), 150);
    };

    const openEditModal = (profesional) => {
        setEditing(profesional);
        setData({
            especialidad_id: profesional.especialidad_id,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            email: profesional.email,
            telefono: profesional.telefono || '',
        });
        setIsModalOpen(true);
        setTimeout(() => nombreInput.current?.focus(), 150);
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
            patch(route('profesionales.update', editing.id), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Perfil actualizado correctamente', {
                        style: { background: '#134e4a', color: '#fff' },
                        iconTheme: { primary: '#fff', secondary: '#134e4a' },
                    });
                },
            });
        } else {
            post(route('profesionales.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Profesional registrado al equipo', { icon: '👨‍⚕️' });
                },
            });
        }
    };

    const deleteProfesional = () => {
        destroy(route('profesionales.destroy', idToDelete), {
            onSuccess: () => {
                closeDeletionModal();
                toast.success('Profesional desvinculado del sistema', { icon: '🗑️' });
            },
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Directorio de Profesionales</h2>}>
            <Head title="Profesionales" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Equipo Kinesiológico</h3>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center rounded-md bg-kine-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kine-700 transition"
                        >
                            + Nuevo Profesional
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 text-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Profesional</th>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Contacto</th>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Área</th>
                                        <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {profesionales.map((prof) => (
                                        <tr key={prof.id} className="hover:bg-kine-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-kine-900">{prof.nombre} {prof.apellido}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div>{prof.email}</div>
                                                <div className="text-xs text-gray-400">{prof.telefono}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    {prof.specialty?.nombre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-4">
                                                <button onClick={() => openEditModal(prof)} className="text-kine-600 hover:text-kine-900 font-bold">Editar</button>
                                                <button onClick={() => confirmDeletion(prof.id)} className="text-red-600 hover:text-red-900 font-bold">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {profesionales.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No hay profesionales registrados en el sistema.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">{editing ? 'Editar Perfil del Profesional' : 'Registrar Nuevo Profesional'}</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" ref={nombreInput} value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.nombre && <div className="text-red-600 text-xs mt-1">{errors.nombre}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input type="text" value={data.apellido} onChange={(e) => setData('apellido', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.apellido && <div className="text-red-600 text-xs mt-1">{errors.apellido}</div>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                            <select value={data.especialidad_id} onChange={(e) => setData('especialidad_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required>
                                <option value="">Seleccione un área...</option>
                                {especialidades.map((esp) => (
                                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                                ))}
                            </select>
                            {errors.especialidad_id && <div className="text-red-600 text-xs mt-1">{errors.especialidad_id}</div>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" placeholder="+56 9 1234 5678" />
                            {errors.telefono && <div className="text-red-600 text-xs mt-1">{errors.telefono}</div>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">Cancelar</button>
                        <button type="submit" disabled={processing} className={`px-4 py-2 text-white rounded-md shadow-sm transition ${editing ? 'bg-green-600 hover:bg-green-700' : 'bg-kine-600 hover:bg-kine-700'}`}>{editing ? 'Guardar Cambios' : 'Registrar Profesional'}</button>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmingDeletion} onClose={closeDeletionModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">¿Desvincular profesional?</h2>
                    <p className="mt-1 text-sm text-gray-600">Esta acción eliminará al profesional del sistema permanentemente.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeDeletionModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">Cancelar</button>
                        <button onClick={deleteProfesional} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Eliminar definitivamente</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}