const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { ensureRequiredEnv } = require('../config/env');

ensureRequiredEnv();

const roleInclude = {
  doctor: {
    select: { id: true },
  },
  nurse: {
    select: { id: true },
  },
  patient: {
    select: { id: true, patientCode: true },
  },
};

const toAuthUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  doctorId: user.doctor?.id || null,
  nurseId: user.nurse?.id || null,
  patientId: user.patient?.id || null,
  patientCode: user.patient?.patientCode || null,
});

const signToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role,
      doctorId: user.doctor?.id || null,
      nurseId: user.nurse?.id || null,
      patientId: user.patient?.id || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );

const login = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: roleInclude,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: toAuthUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const registerPatient = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim();
    const password = String(req.body.password || '');

    if (!name || !phone || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone and password are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account already exists with this email or phone number',
      });
    }

    const nextPatientNumber = (await prisma.patient.count()) + 1001;
    const patientCode = `P${nextPatientNumber}`;
    const [firstName, ...lastNameParts] = name.split(' ');

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: 'PATIENT',
        },
      });

      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          patientCode,
          firstName,
          lastName: lastNameParts.join(' ') || null,
          phone,
          email,
        },
      });

      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          ...roleInclude,
          patient: {
            select: { id: true, patientCode: true },
          },
        },
      });
    });

    const token = signToken(created);

    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      token,
      user: toAuthUser(created),
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  login,
  registerPatient,
};
