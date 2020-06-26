import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
    provider: string;
    date: Date;
}

//Dependency Inversion

class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepository;
    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public execute({provider, date}: RequestDTO): Appointment {
        const appointmentDate = startOfHour(date);

    const findAppointmentSameDate = this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentSameDate) {
        throw Error("This time is already booked");
    }

    const appointment = this.appointmentsRepository.create({
        provider,
        date: appointmentDate
    })

    return appointment
    }
}

export default CreateAppointmentService;