import { startOfHour } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/error/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
    provider_id: string;
    date: Date;
}

// Dependency Inversion

class CreateAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepository){}

    public async execute({
        provider_id,
        date,
    }: IRequestDTO): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        const findAppointmentSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentSameDate) {
            throw new AppError('This time is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
