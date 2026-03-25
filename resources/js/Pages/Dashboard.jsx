import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, proximas_citas }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Panel de Control</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-kine-600">
                            <div className="text-sm font-medium text-foreground opacity-80 truncate">Pacientes Registrados</div>
                            <div className="mt-1 text-3xl font-semibold text-foreground">{stats.pacientes}</div>
                        </div>
                        <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-kine-600">
                            <div className="text-sm font-medium text-foreground opacity-80 truncate">Kinesiólogos Activos</div>
                            <div className="mt-1 text-3xl font-semibold text-foreground">{stats.profesionales}</div>
                        </div>
                        <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="text-sm font-medium text-foreground opacity-80 truncate">Citas para Hoy</div>
                            <div className="mt-1 text-3xl font-semibold text-foreground">{stats.citas_hoy}</div>
                        </div>
                        <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-yellow-500">
                            <div className="text-sm font-medium text-foreground opacity-80 truncate">Citas Pendientes</div>
                            <div className="mt-1 text-3xl font-semibold text-foreground">{stats.citas_pendientes}</div>
                        </div>
                    </div>

                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-medium text-foreground mb-4">Próximas Atenciones</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-background">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground opacity-80 uppercase tracking-wider">Fecha y Hora</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground opacity-80 uppercase tracking-wider">Paciente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground opacity-80 uppercase tracking-wider">Profesional</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-foreground opacity-80 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-card divide-y divide-border">
                                        {proximas_citas.map((cita) => (
                                            <tr key={cita.id} className="hover:bg-background transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                    {new Date(cita.fecha_hora).toLocaleString('es-CL', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground opacity-80">
                                                    {cita.paciente?.nombre} {cita.paciente?.apellido}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground opacity-80">
                                                    Klgo. {cita.profesional?.nombre} {cita.profesional?.apellido}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ring-1 ring-inset ${
                                                        cita.estado === 'confirmada' ? 'bg-green-100 text-green-800 ring-green-600/20' : 
                                                        cita.estado === 'cancelada' ? 'bg-red-100 text-red-800 ring-red-600/20' : 
                                                        'bg-yellow-100 text-yellow-800 ring-yellow-600/20'
                                                    }`}>
                                                        {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {proximas_citas.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-foreground opacity-80">
                                                    No hay atenciones programadas a futuro.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}