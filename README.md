# ✈️ Pilot Flight Logbook Dashboard

Dashboard personal para piloto privado (PPL-A) que lee datos de vuelo desde un Google Sheet y los muestra en una interfaz limpia con temática de aviación.

## Funcionalidades

- **Resumen**: KPIs (horas totales, PIC, Cross-Country, despegues), vigencia de licencias, progreso hacia habilitaciones
- **Planificación**: Planificador CPL interactivo con sliders (horas/mes, costo/hora) y gráfico de proyección, seguimiento de teoría ATPL
- **Vuelos**: Heatmap de actividad (año/mes/semana con navegación), estadísticas (duración promedio, día de semana, rachas), tabla completa de vuelos
- **Mapa & Aeronaves**: Mapa interactivo Leaflet con aeródromos visitados, tabla de aeronaves voladas

## Stack Técnico

- **Framework**: Next.js 14 (App Router)
- **Datos**: Google Sheets API v4 (cuenta de servicio)
- **Gráficos**: Recharts
- **Mapa**: Leaflet + react-leaflet
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Deploy**: Vercel

## Configuración

### 1. Cuenta de servicio de Google (para leer el Sheet)

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un proyecto (o usar uno existente)
3. Habilitar la **Google Sheets API**
4. Ir a **IAM & Admin → Cuentas de servicio**
5. Crear una cuenta de servicio, descargar la clave JSON
6. Anotar el `client_email` y `private_key` del JSON

### 2. Compartir el Google Sheet

1. Abrir el spreadsheet del logbook en Google Sheets
2. Clic en **Compartir** → pegar el email de la cuenta de servicio
3. Dar acceso de **Lector**
4. Anotar el Sheet ID de la URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 3. Variables de entorno

Crear un archivo `.env.local`:

```env
GOOGLE_SHEETS_ID=tu_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-sa@proyecto.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 5. Deploy en Vercel

1. Subir a GitHub
2. Importar proyecto en [Vercel](https://vercel.com)
3. Agregar las variables de entorno en la configuración del proyecto
4. Deploy

## Estructura del Google Sheet

El spreadsheet debe tener estas hojas:

### Statistics
Pares clave-valor con etiquetas en columna A y valores en columna B:
- Total Flight Time, Single Engine, Multi Engine, Cross-Country (auto), Night, IFR
- PIC (Pilot in Command), Co-Pilot, Dual (under instruction), Instructor
- X-Country as PIC, TOTALS (T/O Day)

### Monthly Summary
Desde fila 5: Año | Mes | Total | SE | ME | PIC | Dual | X-Country | Noche | IFR

### Flight Log
Desde fila 6, columna B en adelante: Date | Dep Place | Dep Time | Arr Place | Arr Time | Aircraft Model | Registration | SE | ME | Multi-Pilot | Total Time | PIC Name | T/O Day | T/O Night | Ldg Day | Ldg Night | Night | IFR | X-Country | PIC | Co-Pilot | Dual | Instructor | Remarks

**Todos los valores de tiempo se almacenan como fracciones decimales de Excel** (ej: 0.0833 = 2h). La app multiplica por 24 automáticamente.

## Licencia

MIT
