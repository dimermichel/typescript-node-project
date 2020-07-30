import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentsService';
import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

const appointmentsRouter = Router();


appointmentsRouter.use(ensureAuth);

// appointmentsRouter.get('/', async (req, res) => {
//     const appointments = await appointmentsRepository.find();
//     return res.json(appointments);
// });

appointmentsRouter.post('/', async (req, res) => {
    const { provider_id, date } = req.body;
    const parsedDate = parseISO(date);
    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate,
    });

    return res.json(appointment);
});

export default appointmentsRouter;
