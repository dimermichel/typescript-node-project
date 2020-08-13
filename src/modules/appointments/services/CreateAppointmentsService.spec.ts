import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentsService from './CreateAppointmentsService';
import AppError from '@shared/error/AppError';


describe('CreateAppointments', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentsService(fakeAppointmentsRepository);

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123456789'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456789');
    });

    it('should not be able to create two appointments at the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentsService(fakeAppointmentsRepository);

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123456789'
        });

        expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123456789'
        })).rejects.toBeInstanceOf(AppError);
    });
})
