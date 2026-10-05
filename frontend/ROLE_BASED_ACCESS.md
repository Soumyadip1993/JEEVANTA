# Jeevanta role-based frontend

The frontend now uses role-specific dashboards and navigation:

- ADMIN: full hospital/system access
- RECEPTIONIST: patients, appointments, admissions
- DOCTOR: patients, appointments, clinical records, prescriptions, laboratory, wards/beds, vitals, admissions
- NURSE: patients, appointments, clinical records (read-only), wards/beds, vitals, admissions
- LAB_TECHNICIAN: laboratory
- PHARMACIST: prescriptions and pharmacy

Important: frontend hiding is not security. Backend RBAC must also permit/deny the same resources.

## Required backend fix for Nurse Ward access

Your current Nurse login is getting "Unable to load wards" because the backend Ward GET route is not permitting NURSE. Update the Ward GET/list authorization to include `NURSE`. If Bed GET is separately protected, include `NURSE` there too.

Do not grant Nurse create/update/delete Ward permissions. Nurses should have read access to ward/bed status only.

Example intended GET role set:

```js
authorizeRoles("ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST");
```

Use the exact roles already present in your existing ward route/controller.
