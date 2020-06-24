import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';
import Appointment from '../models/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();


appointmentsRouter.post('/', (req, res) => {
    const { provider, date } = req.body;

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentSameDate = appointments.find(appointment =>
        isEqual(parsedDate, appointment.date));

    if (findAppointmentSameDate) {
        return res.status(400).json({ message: 'This time is already booked' });
    }

    appointments.push(appointment);

    return res.json(appointment);
})

export default appointmentsRouter;
