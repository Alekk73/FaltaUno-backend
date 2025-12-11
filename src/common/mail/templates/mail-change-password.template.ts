export const MailChangePasswordTemplate = (resetUrl: string) => {
  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recuperación de Contraseña</title>
  </head>
  <body>
    <div
      style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px"
    >
      <div
        style="
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        "
      >
        <h2 style="color: #333">Recuperación de Contraseña</h2>
        <p style="color: #555">
          Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Si fuiste tú, por favor haz clic en el siguiente botón para restablecerla:
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            color: white;
            background: #007bff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 20px;
          "
        >
          Cambiar Contraseña
        </a>

        <p style="color: #777; margin-top: 20px">
          Si no solicitaste el cambio de contraseña, por favor ignora este mensaje.
        </p>

        <p style="color: #777; margin-top: 20px">
          Si tienes algún problema, no dudes en contactarnos.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
};
