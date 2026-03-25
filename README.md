# 🏥 Agenda-Kine | Sistema de Gestión Clínica

Una plataforma web moderna y optimizada para la administración integral de una clínica kinésica. Diseñada para agilizar la gestión de pacientes, profesionales y citas médicas mediante una interfaz rápida, intuitiva y segura.

## ✨ Características Principales

* **Gestión de Agenda:** Panel centralizado para coordinar citas médicas, visualizar el estado de las atenciones y organizar el flujo diario.
* **Búsqueda Dinámica en Tiempo Real:** Filtros de búsqueda instantáneos sin recarga de página para Pacientes, Profesionales y Especialidades.
* **Control de Acceso por Roles (RBAC):** Sistema de seguridad con permisos específicos:
    * **Administrador:** Acceso total al sistema y configuraciones.
    * **Secretaria:** Gestión de citas y pacientes.
    * **Kinesiólogo:** Acceso exclusivo a su agenda y visualización de pacientes.
* **Modo Oscuro Dinámico:** Interfaz adaptable al gusto del usuario, guardando su preferencia en la base de datos para una experiencia consistente.
* **Notificaciones Integradas:** Alertas y confirmaciones visuales no intrusivas para cada acción del usuario.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido sobre un stack moderno que garantiza alto rendimiento y escalabilidad:

* **Backend:** Laravel 11 (PHP)
* **Frontend:** React 18 + Inertia.js
* **Estilos:** Tailwind CSS (con variables CSS dinámicas)
* **Base de Datos:** MySQL
* **Entorno:** Docker

## 🚀 Guía de Instalación y Uso

1. Clonar el repositorio
```bash
git clone [https://github.com/matquezadap348/agenda-kine.git](https://github.com/matquezadap348/agenda-kine.git)
cd agenda-kine
cp .env.example .env
docker compose up -d
docker exec -it agenda-kine-laravel.test-1 composer install npm install
docker exec -it agenda-kine-laravel.test-1 php artisan key:generate
docker exec -it agenda-kine-laravel.test-1 php artisan migrate:fresh --seed
npm run dev