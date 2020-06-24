import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';
import Appointment from '../models/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentsrepository = new AppointmentsRepository();

appointmentsRouter.get('/', (req, res) => {
    const appointments = appointmentsrepository.all();
    return res.json(appointments);
})

appointmentsRouter.post('/', (req, res) => {
    const { provider, date } = req.body;

    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentSameDate = appointmentsrepository.findByDate(parsedDate);

    if (findAppointmentSameDate) {
        return res.status(400).json({ message: 'This time is already booked' });
    }

    const appointment = appointmentsrepository.create(provider, parsedDate)

    return res.json(appointment);
})

export default appointmentsRouter;
