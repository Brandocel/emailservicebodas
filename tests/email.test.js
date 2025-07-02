const request = require('supertest');
const app = require('../src/app');

describe('Email API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/email/rsvp', () => {
    const validRsvpData = {
      nombre: 'Juan Pérez',
      emailRemitente: 'juan@test.com',
      numeroAcompañantes: '1',
      menu: 'pollo',
      agregarAcompañantes: true,
      mismoPlato: false,
      acompañantes: [
        {
          nombre: 'María García',
          platillo: 'pasta'
        }
      ],
      alergias: 'Sin alergias'
    };

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/email/rsvp')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should validate email format', async () => {
      const invalidData = {
        ...validRsvpData,
        emailRemitente: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/email/rsvp')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should validate menu options', async () => {
      const invalidData = {
        ...validRsvpData,
        menu: 'invalid-menu'
      };

      const response = await request(app)
        .post('/api/email/rsvp')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    // Este test requiere una clave API válida de SendGrid
    it.skip('should send email successfully with valid data', async () => {
      const response = await request(app)
        .post('/api/email/rsvp')
        .send(validRsvpData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('messageId');
    });
  });

  describe('GET /api/email/status', () => {
    it('should return service status', async () => {
      const response = await request(app)
        .get('/api/email/status');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/email/test', () => {
    it('should require email field', async () => {
      const response = await request(app)
        .post('/api/email/test')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('code', 'MISSING_EMAIL');
    });

    it('should validate email format for test', async () => {
      const response = await request(app)
        .post('/api/email/test')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('404 handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('code', 'ROUTE_NOT_FOUND');
    });
  });
});
