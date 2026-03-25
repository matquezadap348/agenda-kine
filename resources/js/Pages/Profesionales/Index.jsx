import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function Index({ profesionales, especialidades, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [editing, setEditing] = useState(null);
    const nombreInput = useRef();

    const [search, setSearch] = useState(filters?.search || '');
    const isFirstRender = useRef(true);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        especialidad_id: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(route('profesionales.index'), { search: search }, {
                preserveState: true,
                replace: true,
                only: ['profesionales', 'filters']
            });
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-foreground">Directorio de Profesionales</h2>}>
            <Head title="Profesionales" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o apellido..."
                                className="w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center rounded-md bg-kine-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-kine-700 transition"
                        >
                            + Nuevo Profesional
                        </button>
                    </div>

                    <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg">
                        <div className="p-6 text-foreground text-sm">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase">Profesional</th>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase">Contacto</th>
                                        <th className="px-6 py-3 text-left font-medium text-foreground opacity-80 uppercase">Área</th>
                                        <th className="px-6 py-3 text-right font-medium text-foreground opacity-80 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {profesionales.data.map((prof) => (
                                        <tr key={prof.id} className="hover:bg-background transition">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground">{prof.nombre} {prof.apellido}</div>
                                            </td>
                                            <td className="px-6 py-4 text-foreground opacity-80">
                                                <div>{prof.email}</div>
                                                <div className="text-xs text-foreground opacity-50">{prof.telefono}</div>
                                            </td>
                                            <td className="px-6 py-4 text-foreground opacity-80">
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
                                    {profesionales.data.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-foreground opacity-80 italic">
                                                No se encontraron resultados para "{search}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination links={profesionales.links} />
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-foreground mb-6">{editing ? 'Editar Perfil del Profesional' : 'Registrar Nuevo Profesional'}</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Nombre</label>
                            <input type="text" ref={nombreInput} value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.nombre && <div className="text-red-600 text-xs mt-1">{errors.nombre}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground opacity-80">Apellido</label>
                            <input type="text" value={data.apellido} onChange={(e) => setData('apellido', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.apellido && <div className="text-red-600 text-xs mt-1">{errors.apellido}</div>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-foreground opacity-80">Especialidad</label>
                            <select value={data.especialidad_id} onChange={(e) => setData('especialidad_id', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500" required>
                                <option value="">Seleccione un área...</option>
                                {especialidades.map((esp) => (
                                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                                ))}
                            </select>
                            {errors.especialidad_id && <div className="text-red-600 text-xs mt-1">{errors.especialidad_id}</div>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-foreground opacity-80">Correo Electrónico</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500" required />
                            {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-foreground opacity-80">Teléfono</label>
                            <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className="mt-1 block w-full rounded-md border-border bg-card text-foreground shadow-sm focus:border-kine-500 focus:ring-kine-500" placeholder="+56 9 1234 5678" />
                            {errors.telefono && <div className="text-red-600 text-xs mt-1">{errors.telefono}</div>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-background text-foreground hover:opacity-80 rounded-md transition">Cancelar</button>
                        <button type="submit" disabled={processing} className={`px-4 py-2 text-white rounded-md shadow-sm transition ${editing ? 'bg-green-600 hover:bg-green-700' : 'bg-kine-600 hover:bg-kine-700'}`}>{editing ? 'Guardar Cambios' : 'Registrar Profesional'}</button>
                    </div>
                </form>
            </Modal>

            <Modal show={confirmingDeletion} onClose={closeDeletionModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-foreground">¿Desvincular profesional?</h2>
                    <p className="mt-1 text-sm text-foreground opacity-80">Esta acción eliminará al profesional del sistema permanentemente.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeDeletionModal} className="px-4 py-2 bg-background text-foreground hover:opacity-80 rounded-md transition">Cancelar</button>
                        <button onClick={deleteProfesional} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Eliminar definitivamente</button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}