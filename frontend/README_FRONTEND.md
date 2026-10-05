# Jeevanta Frontend

This frontend is a React + Vite UI for the Jeevanta Government Hospital Management System.

## Run

From `frontend/`:

```bash
npm install
npm run dev
```

The API defaults to:

`http://localhost:5000/api`

Optional `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Included screens

- Login / JWT authentication
- Dashboard with live patient, appointment, bed and lab counts
- Patients
- Appointments
- Clinical Records
- Prescriptions
- Laboratory
- Pharmacy / Inventory / Dispensation
- Wards & Beds
- Nurses
- Vitals
- Admissions / Discharge

The backend remains authoritative for authentication, validation and RBAC.

## Important

The current backend does not expose every administrative endpoint described in the project documentation, so this frontend does not invent staff/department CRUD endpoints.
