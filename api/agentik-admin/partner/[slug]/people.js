import { makeCrudHandler } from '../../../_lib/crud.js';

export default makeCrudHandler({
  table: 'partner_people',
  requiredFields: ['navn'],
  allowedFields: [
    'navn', 'rolle', 'epost', 'telefon', 'omrade',
    'inviter_slack', 'bookket_intro',
  ],
});
