import { makeCrudHandler } from '../../../_lib/crud.js';

export default makeCrudHandler({
  table: 'partner_meetings',
  requiredFields: ['tittel'],
  allowedFields: [
    'tittel', 'dato', 'type', 'deltakere', 'hovedtema', 'action_items',
  ],
  autoActivity: {
    relatedType: 'meeting',
    onCreate: (m) => {
      const futureMeeting = m.dato && new Date(m.dato) > new Date();
      if (futureMeeting) {
        return {
          type: 'meeting',
          tittel: `Møte planlagt: ${m.tittel}`,
          beskrivelse: m.hovedtema || null,
        };
      }
      return null;
    },
  },
});
