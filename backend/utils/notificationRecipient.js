// Use the server environment, never a client-supplied hostname, to route alerts.
export function getAppointmentNotificationRecipient() {
  return process.env.NODE_ENV === 'production'
    ? ['ppal36609@gmail.com', 'blessednishant@gmail.com']
    : 'ppal36609@gmail.com';
}
