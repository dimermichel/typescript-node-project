import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentsService';

const appointmentsRouter = Router();

const appointmentsrepository = new AppointmentsRepository();

appointmentsRouter.get('/', (req, res) => {
    const appointments = appointmentsrepository.all();
    return res.json(appointments);
})

appointmentsRouter.post('/', (req, res) => {
    try {
        const { provider, date } = req.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService(appointmentsrepository);

        const appointment = createAppointment.execute({ provider, date: parsedDate})

        return res.json(appointment);
    } catch (err) {
        return res.status(400).json({err: err.message})
    }
})

export default appointmentsRouter;
