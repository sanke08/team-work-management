import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType.toLowerCase()} : `;
    case ACTION.UPDATE:
      return `updated ${entityType.toLowerCase()} : `;
    case ACTION.DELETE:
      return `deleted ${entityType.toLowerCase()} : `;
    case ACTION.JOINED:
      return `joined`;
    case ACTION.ROLE_CHANGED:
      return `change role of ${entityType.toLowerCase()} : `;
    case ACTION.REMOVE:
      return `removed ${entityType.toLowerCase()} : `;
    case ACTION.RESTORED:
      return `restored ${entityType.toLowerCase()} : `;
    case ACTION.TRASHED:
      return `trashed ${entityType.toLowerCase()} : `;
    default:
      return `unknown action ${entityType.toLowerCase()} :`;
  };
};
