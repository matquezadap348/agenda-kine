import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ especialidades }) {
    const [editing, setEditing] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        nombre: '',
        descripcion: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            patch(route('especialidades.update', editing.id), {
                onSuccess: () => {
                    reset();
                    setEditing(null);
                },
            });
        } else {
            post(route('especialidades.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const editEspecialidad = (especialidad) => {
        setEditing(especialidad);
        setData({
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion || '',
        });
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar esta especialidad?')) {
            destroy(route('especialidades.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Especialidades</h2>}
        >
            <Head title="Especialidades" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg p-6 border-l-4 border-indigo-500">
                        <h3 className="mb-4 text-lg font-medium text-gray-900">
                            {editing ? 'Editar Especialidad' : 'Nueva Especialidad'}
                        </h3>
                        <form onSubmit={submit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <input
                                    type="text"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${editing ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {editing ? 'Actualizar' : 'Agregar'}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 text-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium uppercase text-gray-500">Nombre</th>
                                        <th className="px-6 py-3 text-left font-medium uppercase text-gray-500">Descripción</th>
                                        <th className="px-6 py-3 text-right font-medium uppercase text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {especialidades.map((esp) => (
                                        <tr key={esp.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-semibold">{esp.nombre}</td>
                                            <td className="px-6 py-4 text-gray-600">{esp.descripcion}</td>
                                            <td className="px-6 py-4 text-right space-x-4">
                                                <button
                                                    onClick={() => editEspecialidad(esp)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-bold"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(esp.id)}
                                                    className="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}