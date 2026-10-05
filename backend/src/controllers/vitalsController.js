const prisma = require('../config/prisma');

const nurseUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  isActive: true,
};

const createVitals = async (req, res) => {
  try {
    const { patientId, nurseId, temperature, bloodPressure, heartRate, respiratoryRate, oxygenSaturation, weight } = req.body;

    if (patientId === undefined) {
      return res.status(400).json({ success: false, message: 'Patient ID is required' });
    }

    const patient = await prisma.patient.findUnique({ where: { id: Number(patientId) } });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    if (nurseId !== undefined && nurseId !== null) {
      const nurse = await prisma.nurse.findUnique({ where: { id: Number(nurseId) } });
      if (!nurse) {
        return res.status(404).json({ success: false, message: 'Nurse not found' });
      }
    }

    const vitals = await prisma.vitals.create({
      data: {
        patientId: Number(patientId),
        nurseId: nurseId !== undefined && nurseId !== null ? Number(nurseId) : null,
        temperature: temperature !== undefined && temperature !== null ? Number(temperature) : null,
        bloodPressure: bloodPressure ?? null,
        heartRate: heartRate !== undefined && heartRate !== null ? Number(heartRate) : null,
        respiratoryRate: respiratoryRate !== undefined && respiratoryRate !== null ? Number(respiratoryRate) : null,
        oxygenSaturation: oxygenSaturation !== undefined && oxygenSaturation !== null ? Number(oxygenSaturation) : null,
        weight: weight !== undefined && weight !== null ? Number(weight) : null,
      },
      include: {
        patient: true,
        nurse: {
          include: {
            user: { select: nurseUserSelect },
            department: true,
          },
        },
      },
    });

    return res.status(201).json({ success: true, message: 'Vitals recorded successfully', vitals });
  } catch (error) {
    console.error('Create vitals error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getVitals = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'PATIENT') {
      if (!req.user.patientId) {
        return res.status(403).json({ success: false, message: 'Patient profile is not linked to this account' });
      }
      where.patientId = req.user.patientId;
    }

    const vitals = await prisma.vitals.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      include: {
        patient: true,
        nurse: {
          include: {
            user: { select: nurseUserSelect },
            department: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, count: vitals.length, vitals });
  } catch (error) {
    console.error('Get vitals error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getVitalsById = async (req, res) => {
  try {
    const vitalsId = Number(req.params.id);

    const vitals = await prisma.vitals.findUnique({
      where: { id: vitalsId },
      include: {
        patient: true,
        nurse: {
          include: {
            user: { select: nurseUserSelect },
            department: true,
          },
        },
      },
    });

    if (!vitals) {
      return res.status(404).json({ success: false, message: 'Vitals record not found' });
    }

    if (req.user.role === 'PATIENT' && req.user.patientId !== vitals.patientId) {
      return res.status(403).json({ success: false, message: 'You can only access your own vitals records' });
    }

    return res.status(200).json({ success: true, vitals });
  } catch (error) {
    console.error('Get vitals by ID error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getVitalsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    if (req.user.role === 'PATIENT' && req.user.patientId !== patientId) {
      return res.status(403).json({ success: false, message: 'You can only access your own vitals records' });
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const vitals = await prisma.vitals.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
      include: {
        nurse: {
          include: {
            user: { select: nurseUserSelect },
            department: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, count: vitals.length, patient, vitals });
  } catch (error) {
    console.error('Get patient vitals error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateVitals = async (req, res) => {
  try {
    const vitalsId = Number(req.params.id);
    const { temperature, bloodPressure, heartRate, respiratoryRate, oxygenSaturation, weight } = req.body;

    const existingVitals = await prisma.vitals.findUnique({ where: { id: vitalsId } });
    if (!existingVitals) {
      return res.status(404).json({ success: false, message: 'Vitals record not found' });
    }

    const vitals = await prisma.vitals.update({
      where: { id: vitalsId },
      data: {
        ...(temperature !== undefined && { temperature: temperature === null ? null : Number(temperature) }),
        ...(bloodPressure !== undefined && { bloodPressure }),
        ...(heartRate !== undefined && { heartRate: heartRate === null ? null : Number(heartRate) }),
        ...(respiratoryRate !== undefined && { respiratoryRate: respiratoryRate === null ? null : Number(respiratoryRate) }),
        ...(oxygenSaturation !== undefined && { oxygenSaturation: oxygenSaturation === null ? null : Number(oxygenSaturation) }),
        ...(weight !== undefined && { weight: weight === null ? null : Number(weight) }),
      },
      include: {
        patient: true,
        nurse: {
          include: {
            user: { select: nurseUserSelect },
            department: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, message: 'Vitals updated successfully', vitals });
  } catch (error) {
    console.error('Update vitals error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createVitals,
  getVitals,
  getVitalsById,
  getVitalsByPatient,
  updateVitals,
};
