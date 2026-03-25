import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function Index({ especialidades, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [editing, setEditing] = useState(null);
    const nombreInput = useRef();

    const [search, setSearch] = useState(filters?.search || '');
    const isFirstRender = useRef(true);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        nombre: '',
        descripcion: '',
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(route('especialidades.index'), { search: search }, {
                preserveState: true,
                replace: true,
                only: ['especialidades', 'filters']
            });
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

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
            header={<h2 className="text-xl font-semibold text-foreground">Especialidades</h2>}
        >
            <Head title="Especialidades" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar especialidad..."
                                className="w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center rounded-md bg-kine-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kine-700 transition"
                        >
                            + Nueva Especialidad
                        </button>
                    </div>

                    <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6 text-foreground text-sm">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase">Descripción</th>
                                        <th className="px-6 py-3 text-right font-medium text-foreground opacity-80 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {especialidades.data.map((esp) => (
                                        <tr key={esp.id} className="hover:bg-background transition">
                                            <td className="px-6 py-4 font-semibold text-foreground">{esp.nombre}</td>
                                            <td className="px-6 py-4 text-foreground opacity-80">{esp.descripcion}</td>
                                            <td className="px-6 py-4 text-right space-x-4">
                                                <button onClick={() => openEditModal(esp)} className="text-kine-600 hover:text-kine-900 font-bold">Editar</button>
                                                <button onClick={() => confirmDeletion(esp.id)} className="text-red-600 hover:text-red-900 font-bold">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {especialidades.data.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-foreground opacity-80 italic">
                                                No se encontraron resultados para "{search}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={especialidades.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-foreground">{editing ? 'Editar Especialidad' : 'Nueva Especialidad'}</h2>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Nombre</label>
                            <input type="text" ref={nombreInput} value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Descripción</label>
                            <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500" rows="3"></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-background text-foreground hover:opacity-80 rounded-md">Cancelar</button>
                        <button type="submit" disabled={processing} className={`px-4 py-2 text-white rounded-md ${editing ? 'bg-green-600' : 'bg-kine-600'}`}>Guardar</button>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmingDeletion} onClose={closeDeletionModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-foreground">¿Estás seguro de eliminar esta especialidad?</h2>
                    <p className="mt-1 text-sm text-foreground opacity-80">Esta acción no se puede deshacer y se perderán todos los datos asociados.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeDeletionModal} className="px-4 py-2 bg-background text-foreground hover:opacity-80 rounded-md">Cancelar</button>
                        <button onClick={deleteEspecialidad} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Eliminar definitivamente</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}