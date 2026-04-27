import { makeCrudHandler } from '../../../_lib/crud.js';

export default makeCrudHandler({
  table: 'partner_projects',
  requiredFields: ['tittel'],
  allowedFields: [
    'tittel', 'beskrivelse', 'status', 'type', 'tildelt', 'prioritet',
    'forventet_timer', 'faktiske_timer', 'verdi_estimat_arlig',
    'frist', 'hvorfor', 'blockers',
  ],
  autoActivity: {
    relatedType: 'project',
    onCreate: (project) => ({
      type: 'discovery',
      tittel: `Ny AI-løsning i pipeline: ${project.tittel}`,
      beskrivelse: project.beskrivelse || null,
    }),
    onUpdate: (prev, next) => {
      if (prev.status === next.status) return null;
      // Only log meaningful transitions
      if (next.status === 'bygges' && prev.status !== 'bygges') {
        return {
          type: 'milestone',
          tittel: `Bygging startet: ${next.tittel}`,
          beskrivelse: next.beskrivelse || null,
        };
      }
      if (next.status === 'live') {
        return {
          type: 'delivery',
          tittel: `${next.tittel} er live`,
          beskrivelse: next.verdi_estimat_arlig
            ? `Forventet årlig verdi: ${Number(next.verdi_estimat_arlig).toLocaleString('nb-NO')} kr.`
            : null,
        };
      }
      return null;
    },
  },
});
