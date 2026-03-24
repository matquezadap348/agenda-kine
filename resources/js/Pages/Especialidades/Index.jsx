import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function Index({ especialidades }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [editing, setEditing] = useState(null);
    const nombreInput = useRef();

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        nombre: '',
        descripcion: '',
    });

    const openCreateModal = () => {
        setEditing(null);
        reset();
        setIsModalOpen(true);
        setTimeout(() => nombreInput.current.focus(), 150);
    };

    const openEditModal = (especialidad) => {
        setEditing(especialidad);
        setData({
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion || '',
        });
        setIsModalOpen(true);
        setTimeout(() => nombreInput.current.focus(), 150);
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
            patch(route('especialidades.update', editing.id), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Cambios guardados correctamente');
                },
            });
        } else {
            post(route('especialidades.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Nueva especialidad registrada');
                },
            });
        }
    };

    const deleteEspecialidad = () => {
        destroy(route('especialidades.destroy', idToDelete), {
            onSuccess: () => {
                closeDeletionModal();
                toast.success('Especialidad eliminada', { icon: '🗑️' });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Especialidades</h2>}
        >
            <Head title="Especialidades" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Listado de Especialidades</h3>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center rounded-md bg-kine-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kine-700 transition"
                        >
                            + Nueva Especialidad
                        </button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 text-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Descripción</th>
                                        <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {especialidades.map((esp) => (
                                        <tr key={esp.id} className="hover:bg-kine-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-kine-900">{esp.nombre}</td>
                                            <td className="px-6 py-4 text-gray-600">{esp.descripcion}</td>
                                            <td className="px-6 py-4 text-right space-x-4">
                                                <button onClick={() => openEditModal(esp)} className="text-kine-600 hover:text-kine-900 font-bold">Editar</button>
                                                <button onClick={() => confirmDeletion(esp.id)} className="text-red-600 hover:text-red-900 font-bold">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">{editing ? 'Editar Especialidad' : 'Nueva Especialidad'}</h2>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" ref={nombreInput} value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-kine-500 focus:ring-kine-500" rows="3"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Cancelar</button>
                        <button type="submit" disabled={processing} className={`px-4 py-2 text-white rounded-md ${editing ? 'bg-green-600' : 'bg-kine-600'}`}>Guardar</button>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmingDeletion} onClose={closeDeletionModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">¿Estás seguro de eliminar esta especialidad?</h2>
                    <p className="mt-1 text-sm text-gray-600">Esta acción no se puede deshacer y se perderán todos los datos asociados.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeDeletionModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">Cancelar</button>
                        <button onClick={deleteEspecialidad} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Eliminar definitivamente</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}