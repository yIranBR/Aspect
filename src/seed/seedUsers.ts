import sequelize from '../config/database';
import User, { UserRole } from '../models/User';

async function seedUsers() {
  try {
    await sequelize.sync();

    // Criar admin
    const adminExists = await User.findOne({ where: { email: 'admin@aspect.com' } });
    if (!adminExists) {
      await User.create({
        email: 'admin@aspect.com',
        password: 'admin123',
        name: 'Administrador',
        role: UserRole.ADMIN,
      });
      console.log('✓ Admin user created: admin@aspect.com');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Criar usuário comum
    const userExists = await User.findOne({ where: { email: 'user@aspect.com' } });
    if (!userExists) {
      await User.create({
        email: 'user@aspect.com',
        password: 'admin123',
        name: 'Usuário',
        role: UserRole.PATIENT,
      });
      console.log('✓ Regular user created: user@aspect.com');
    } else {
      console.log('✓ Regular user already exists');
    }

    console.log('✓ Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
