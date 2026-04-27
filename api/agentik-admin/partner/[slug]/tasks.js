import { makeCrudHandler } from '../../../_lib/crud.js';

export default makeCrudHandler({
  table: 'partner_tasks',
  requiredFields: ['oppgave'],
  allowedFields: [
    'oppgave', 'status', 'category', 'type', 'tildelt', 'frist', 'notater',
  ],
});
