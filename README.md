
## Índice

- [Descripción del proyecto](#descripción-del-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Componentes principales](#componentes-principales)
- [Módulo Admin](#módulo-admin)
    - [Componentes de Admin](#componentes-de-admin)
- [Módulo de Compañías](#módulo-de-compañías)
    - [Componentes de Compañías](#componentes-de-compañías)
- [Módulo Cliente](#módulo-cliente)
    - [Componentes de Cliente](#componentes-de-cliente)
- [Módulo Trabajador](#módulo-trabajador)
    - [Componentes de Trabajador](#componentes-de-trabajador)
- [Tecnologías usadas](#tecnologías-usadas)


## Descripción del proyecto
Este es el frontend de una aplicación web diseñada para que las empresas gestionen tanto a sus clientes como a sus trabajadores. Incluye pagos en tiempo real y gráficos interactivos que se actualizan automáticamente conforme cambian los datos en la base de datos.

## Estructura del proyecto
``` bash
.
├── api
│   ├── helpers.ts
│   └── intercepttors.ts
├── App.css
├── App.tsx
├── assets
├── components
│   ├── footer.tsx
│   └── header.tsx
├── config
│   └── api.ts
├── i18n.ts
├── index.css
├── main.tsx
├── pages
│   ├── admin
│   │   ├── adminAuth.tsx
│   │   ├── adminDashboard.tsx
│   │   ├── adminHome.tsx
│   │   ├── components
│   │   │   ├── Editor.tsx
│   │   │   └── header.tsx
│   │   ├── createNewsLetter.tsx
│   │   ├── editCompany.tsx
│   │   ├── listCompany.tsx
│   │   ├── registerCompany.tsx
│   │   ├── schemas
│   │   │   ├── registerCompanySchema.ts
│   │   │   ├── registerSchema.ts
│   │   │   └── suspendCompanySchema.ts
│   │   └── suspendCompany.tsx
│   ├── companies
│   │   ├── clients
│   │   │   ├── clientLayout.tsx
│   │   │   ├── clientsIndex.tsx
│   │   │   ├── listClients.tsx
│   │   │   └── registerUser.tsx
│   │   ├── companyHome.tsx
│   │   ├── components
│   │   │   └── header.tsx
│   │   ├── createBudget.tsx
│   │   ├── dashboardCompany.tsx
│   │   ├── incidents
│   │   │   ├── companyHistory.tsx
│   │   │   ├── incidentIndex.tsx
│   │   │   ├── incidentsLayout.tsx
│   │   │   └── myIncidents.tsx
│   │   ├── loginCompany.tsx
│   │   ├── machinery
│   │   │   ├── createMachinery.tsx
│   │   │   ├── editMachinery.tsx
│   │   │   ├── listMachinery.tsx
│   │   │   ├── MachineryIndex.tsx
│   │   │   ├── MachineryLayout.tsx
│   │   │   └── updateMaintence.tsx
│   │   ├── payments
│   │   │   ├── accountCreated.tsx
│   │   │   └── createAccounts.tsx
│   │   ├── schemas
│   │   │   ├── budgetSchema.ts
│   │   │   ├── CreateMachinerySchema.ts
│   │   │   ├── editSchema.ts
│   │   │   ├── loginSchema.ts
│   │   │   ├── registerUser.ts
│   │   │   ├── shiftSchema.ts
│   │   │   └── workerSchema.ts
│   │   └── worker
│   │       ├── editWorkers.tsx
│   │       ├── listWorkers.tsx
│   │       ├── registerWorker.tsx
│   │       ├── workerIndex.tsx
│   │       └── workerLayout.tsx
│   ├── forgotPassword.tsx
│   ├── home.tsx
│   ├── payments
│   │   ├── checkoutForm.tsx
│   │   ├── Payment.tsx
│   │   └── successPage.tsx
│   ├── users
│   │   ├── components
│   │   │   ├── header.tsx
│   │   │   ├── paymentSuccesfull.tsx
│   │   │   ├── userChekcout.tsx
│   │   │   └── userPayments.tsx
│   │   ├── incidents
│   │   │   ├── createIncident.tsx
│   │   │   ├── incidentHistory.tsx
│   │   │   ├── incidentIndex.tsx
│   │   │   └── incidentLayout.tsx
│   │   ├── myMachinery.tsx
│   │   ├── schemas
│   │   │   ├── incidentSchema.ts
│   │   │   ├── userLoginSchema.ts
│   │   │   └── userRegisterSchema.ts
│   │   ├── Searchcompnies.tsx
│   │   ├── userBudgets.tsx
│   │   ├── userDashboard.tsx
│   │   ├── userLogin.tsx
│   │   ├── userRegister.tsx
│   │   └── userrHome.tsx
│   └── worker
│       ├── components
│       │   ├── calendar.tsx
│       │   └── header.tsx
│       ├── schemas
│       │   ├── uploadFilesSchema.ts
│       │   └── workerLogin.ts
│       ├── workerDashboard.tsx
│       ├── workerHistory.tsx
│       ├── workerHome.tsx
│       ├── workerLogin.tsx
│       └── workerShifts.tsx
├── routes
│   ├── adminRoutes.tsx
│   ├── companyRoutes.tsx
│   ├── index.tsx
│   ├── paymentRoutes.tsx
│   ├── protectedRoute.tsx
│   ├── userRoutes.tsx
│   └── workerRoutes.tsx
├── types
│   ├── budgetType.ts
│   ├── clientType.ts
│   ├── companiesType.ts
│   ├── contract.ts
│   ├── directionType.ts
│   ├── formData.ts
│   ├── incidentHistory.ts
│   ├── incidentStatus.ts
│   ├── incidentType.ts
│   ├── itemType.ts
│   ├── machineryType.ts
│   ├── shitfts.ts
│   └── userType.ts
└── utils
    ├── authUtils.ts
    └── newPassword.ts
```

## Componentes principales

- **Header principal:** Barra superior de navegación de la aplicación.
- **Footer principal:** Pie de página común en toda la aplicación.
- **API:** Archivo principal para realizar llamadas al backend.

## Módulo Admin
En este módulo se encuentran las páginas relacionadas con la gestión de las compañías, permitiendo crearlas, eliminarlas, suspenderlas y activarlas. También cuenta con la visualización de gráficos que muestran los datos de incidencias activas, compañías activas y clientes activos.


### Componentes de Admin
- **Header:** Header personalizado para acceder a crear empresas y listar empresas.
- **Editor:** Editor para poder enviar la newsletter.

## Módulo de Compañías
En este módulo se encuentran las páginas relacionadas con la gestión de trabajadores, permitiendo crearlos, modificarlos, eliminarlos, asignarles incidencias y guardias, creación de maquinaria y actualización tanto de datos como de fecha de inspecciones, creación de presupuestos para los usuarios que reporten incidencias, ver las incidencias creadas y el historial de incidencias, gestionar la creación y listado de clientes.


### Componentes de Compañías
- **Header:** Header personalizado con acceso a las secciones de trabajadores donde se permite crearlos, modificarlos, eliminar, asignarles guardias. Visualizar las guardias para asignarles a los trabajadores y visualizar el historial de incidencias. Crear clientes y listar clientes. Crear maquinarias, modificarlas y eliminarlas. Crear presupuestos.

## Módulo Cliente
En este módulo se encuentran las páginas relacionadas con la gestión de incidencias, permitiendo crearlas, visualizar el historial de incidencias, visualizar sus incidencias creadas y su estado. Visualizar su maquinaria asignada y ver los presupuestos que se hayan creado en base a sus incidencias.


### Componentes de Cliente
- **Header:** Header personalizado con acceso a las secciones de crear incidencias, visualizar su maquinaria y presupuestos asignados.
- **userCheckout y userPayment:** Componentes para renderizar el formulario de pago dentro de la web.

## Módulo Trabajador
En este módulo se encuentran las páginas relacionadas con la visualización de las incidencias asignadas, así como las guardias asignadas y el historial de incidencias.


### Componentes de Trabajador
- **Header:** Header personalizado para acceder a las secciones de historial de incidencias y sus guardias.
- **Calendar:** Componente del calendario para visualizar sus guardias en el mes.

## Tecnologías usadas

- **Frontend:** React
- **Calendario:** FullCalendar
- **Gráficos:** Chart.js
- **Peticiones al backend:** Axios
- **Validaciones de formularios:** Zod + React Hook Form
- **Editor:** Quill

---

Coded by manudev · [manuelguiradobaeza.com](https://manuelguiradobaeza.com)
